'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../lib/supabase';
import { isAdminEmail } from '../../lib/admin';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(isAdminEmail(session.user.email) ? '/curator' : '/contribute');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace(isAdminEmail(session.user.email) ? '/curator' : '/contribute');
    });
    return () => subscription.unsubscribe();
  }, [router]);
  async function sendLink(event) {
    event?.preventDefault(); setState('loading'); setMessage('');
    const supabase = getSupabaseClient();
    if (!supabase) { setState('error'); setMessage('Sign-in is not configured yet. Add your Supabase project URL and publishable key to .env.local, then restart the Next.js server.'); return; }
    const destination = isAdminEmail(email) ? '/curator' : '/contribute';
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${destination}` } });
    if (error) { setState('error'); setMessage(error.message); } else { setState('sent'); setMessage(`A sign-in link is on its way to ${email}.`); }
  }
  return <main className="login-page">
    <div className="login-petals left">✿<br/>✿<br/>✿<br/>✿<br/>✿</div><div className="login-petals right">✿<br/>✿<br/>✿<br/>✿<br/>✿</div>
    <header className="login-nav"><Link className="brand" href="/">LOKA</Link><Link href="/" className="back">← Back to the story</Link></header>
    <section className="login-wrap"><div className="login-intro"><div className="stamp">COMMUNITY / CONTRIBUTE</div><h1>SHARE A<br/><em>STORY.</em></h1><p>Sign in to contribute event details and share local cultural experiences for curator review.</p><div className="login-sun">✦</div></div>
      <div className="login-card">{state === 'demo' ? <><div className="mail-icon">✉</div><span className="eyebrow">DEMO PREVIEW · NOT SIGNED IN</span><h2>LINK<br/>SENT!</h2><p>This is a demo only. No email was sent, and you are not signed in. Real contributions still require a configured Supabase sign-in.</p><button className="primary login-button" onClick={() => { setState('idle'); setMessage(''); }}>BACK TO REAL SIGN-IN <b>↗</b></button></> : state === 'sent' ? <><div className="mail-icon">✉</div><span className="eyebrow">CHECK YOUR INBOX</span><h2>LINK<br/>SENT!</h2><p>{message}</p><button className="primary login-button" onClick={sendLink}>RESEND THE LINK <b>↗</b></button><button className="change-email" onClick={() => { setState('idle'); setMessage(''); }}>Use another email</button></> : <><span className="eyebrow">STEP 01 / JOIN THE JOURNEY</span><h2>LET&apos;S GET<br/>YOU <i>IN.</i></h2><p>We&apos;ll send a secure sign-in link. No password, no fuss.</p><form onSubmit={sendLink}><label htmlFor="email">YOUR EMAIL ADDRESS</label><input id="email" type="email" autoComplete="email" placeholder="you@party.com" value={email} onChange={(e) => setEmail(e.target.value)} required/><button className="primary login-button" disabled={state === 'loading'}>{state === 'loading' ? 'SENDING...' : 'SEND ME A LINK'} <b>→</b></button></form>{message && <p className="form-message" role="alert">{message}</p>}<button type="button" className="change-email" onClick={() => { setState('demo'); setMessage(''); }}>Preview demo sign-in</button></>}</div>
    </section><footer className="login-footer">A LITTLE LINK. A LOT OF JOY. <span>✦</span> TRAVEL WITH CURIOSITY.</footer>
  </main>;
}
