'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../lib/supabase';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await getSupabaseClient()?.auth.signOut();
    router.replace('/login');
  }
  return <button className="logout-button" type="button" onClick={logout}>LOG OUT ↗</button>;
}
