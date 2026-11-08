import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { allocateEvents } from '../../../lib/kmeans';
import { isAdminEmail } from '../../../lib/admin';

function clients(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!url || !publishable || !serviceKey || !token) return null;
  return {
    auth: createClient(url, publishable, { auth: { persistSession: false, autoRefreshToken: false } }),
    admin: createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } }),
    token,
  };
}

async function currentUser(request) {
  const supabase = clients(request);
  if (!supabase) return { error: 'Server authentication is not configured.' };
  const { data: { user }, error } = await supabase.auth.auth.getUser(supabase.token);
  return error || !user ? { error: 'Please sign in again.' } : { ...supabase, user };
}

export async function POST(request) {
  const context = await currentUser(request);
  if (context.error) return NextResponse.json({ error: context.error }, { status: 401 });
  const body = await request.json();
  if (!body.name?.trim() || !body.title || !body.locationName?.trim() || !Number.isFinite(body.latitude) || !Number.isFinite(body.longitude) || !Number.isInteger(body.crowd) || body.crowd < 1) {
    return NextResponse.json({ error: 'Please provide your name, event title, location name, map pin, and guest count.' }, { status: 400 });
  }
  const { data: event, error: insertError } = await context.admin.from('events').insert({
    user_id: context.user.id, host_name: body.name.trim(), title: body.title, location_name: body.locationName.trim(), latitude: body.latitude, longitude: body.longitude,
    crowd: body.crowd, details: body.details || null,
  }).select().single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const { data: events, error: eventsError } = await context.admin.from('events').select('id, latitude, longitude');
  if (eventsError) return NextResponse.json({ error: eventsError.message }, { status: 500 });
  const allocations = allocateEvents(events);
  const result = await Promise.all(allocations.map((allocation) => context.admin.from('events').update({
    cluster_index: allocation.clusterIndex, allotted_latitude: allocation.allottedLatitude,
    allotted_longitude: allocation.allottedLongitude, allotted_time: allocation.allottedTime,
  }).eq('id', allocation.id)));
  const failed = result.find(({ error }) => error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });
  const allocation = allocations.find((item) => item.id === event.id);
  return NextResponse.json({ event: { ...event, ...allocation } });
}

export async function GET(request) {
  const context = await currentUser(request);
  if (context.error) return NextResponse.json({ error: context.error }, { status: 401 });
  const plan = new URL(request.url).searchParams.get('plan');
  if (plan === 'final') {
    if (!isAdminEmail(context.user.email)) return NextResponse.json({ error: 'This plan is reserved for the Maveli administrator.' }, { status: 403 });
    const { data, error } = await context.admin.from('events').select('*').order('cluster_index').order('created_at');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ events: data });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing event id.' }, { status: 400 });
  const { data, error } = await context.admin.from('events').select('*').eq('id', id).eq('user_id', context.user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ event: data });
}
