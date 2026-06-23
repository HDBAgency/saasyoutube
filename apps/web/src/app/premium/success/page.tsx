import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { prisma } from '@saasyoutube/db';
import { setSessionCookie } from '@/lib/session';
import Link from 'next/link';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect('/');

  let email = '';
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });
    email = checkoutSession.customer_email ?? '';
    const customerId = checkoutSession.customer as string;
    const subscriptionId = checkoutSession.subscription as string;

    if (email && checkoutSession.payment_status === 'paid') {
      await prisma.user.upsert({
        where: { email },
        update: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: 'premium',
          subscriptionStatus: 'active',
        },
        create: {
          email,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          plan: 'premium',
          subscriptionStatus: 'active',
        },
      });
      setSessionCookie({ email, plan: 'premium' });
    }
  } catch (err) {
    console.error('[success]', err);
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        Bienvenue en Premium !
      </h1>
      <p className="text-gray-600 mb-2">
        Votre abonnement est actif. Profitez de téléchargements illimités sans publicité.
      </p>
      {email && (
        <p className="text-sm text-gray-400 mb-8">Compte : {email}</p>
      )}
      <Link
        href="/"
        className="inline-block px-8 py-4 text-white font-bold rounded-xl text-lg"
        style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)' }}
      >
        Commencer à télécharger →
      </Link>
    </main>
  );
}
