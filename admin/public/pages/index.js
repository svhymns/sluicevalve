import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const session = useSession();
  const router = useRouter();

  // Redirect to admin if already logged in
  if (session) {
    router.push('/music-admin');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Head>
        <title>Sluice Valve Admin</title>
        <meta name="description" content="Sluice Valve Music Admin Panel" />
      </Head>

      <main className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Sluice Valve Admin</h1>
        <a 
          href="/login" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login to Access Admin Panel
        </a>
      </main>
    </div>
  );
}
