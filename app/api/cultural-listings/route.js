import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function userClient(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!url || !key) return { error: 'Supabase URL and publishable key are not configured.', status: 503 };
  if (!token) return { error: 'Please sign in to submit a cultural experience.', status: 401 };

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  return { client, token };
}

async function authenticatedUser(request) {
  const context = userClient(request);
  if (context.error) return context;

  const { data: { user }, error } = await context.client.auth.getUser(context.token);
  if (error || !user) return { error: 'Your sign-in has expired. Please sign in again.', status: 401 };

  return { ...context, user };
}

export async function POST(request) {
  const context = await authenticatedUser(request);
  if (context.error) return NextResponse.json({ error: context.error }, { status: context.status });

  const body = await request.json();
  if (body.start_time && body.end_time && body.end_time <= body.start_time) {
    return NextResponse.json({ error: 'End time must be later than start time.' }, { status: 400 });
  }
  if (!body.title?.trim() || !body.category || !body.location?.trim() || !body.description?.trim() || !body.source_url?.trim()) {
    return NextResponse.json({ error: 'Title, category, location, description and source URL are required.' }, { status: 400 });
  }

  let sourceUrl;
  try {
    sourceUrl = new URL(body.source_url);
    if (!['http:', 'https:'].includes(sourceUrl.protocol)) throw new Error('Unsupported protocol');
  } catch {
    return NextResponse.json({ error: 'Enter a valid http or https source URL.' }, { status: 400 });
  }

  const { data, error } = await context.client.from('cultural_listings').insert({
    contributor_id: context.user.id,
    title: body.title.trim(),
    category: body.category,
    location: body.location.trim(),
    description: body.description.trim(),
    date: body.date || null,
    start_time: body.start_time || null,
    end_time: body.end_time || null,
    venue: body.venue || null,
    cultural_significance: body.cultural_significance || null,
    organiser: body.organiser || null,
    source_url: sourceUrl.toString(),
    image_url: body.image_url || null,
    contact: body.contact || null,
    status: 'pending',
  }).select('id,status').single();

  if (error?.code === '42501') {
    return NextResponse.json({
      error: 'Contributor permissions are not configured. Apply supabase/contributor-submissions.sql in your Supabase SQL Editor.',
    }, { status: 403 });
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ listing: data }, { status: 201 });
}

export async function GET(request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return NextResponse.json({ error: 'Supabase URL and publishable key are not configured.' }, { status: 503 });

  if (!token) {
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await client.from('cultural_listings').select('*').eq('status', 'approved').order('date');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ listings: data || [] });
  }

  const context = await authenticatedUser(request);
  if (context.error) return NextResponse.json({ error: context.error }, { status: context.status });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: 'Curator dashboard requires the server-only SUPABASE_SERVICE_ROLE_KEY.' }, { status: 503 });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: profile, error: profileError } = await admin.from('profiles').select('role').eq('id', context.user.id).maybeSingle();
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  if (!['curator', 'admin'].includes(profile?.role)) return NextResponse.json({ error: 'Curator access required.' }, { status: 403 });

  const { data, error } = await admin.from('cultural_listings').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listings: data || [] });
}
