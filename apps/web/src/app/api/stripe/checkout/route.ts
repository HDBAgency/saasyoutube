import { NextRequest, NextResponse } from 'next/server';
import { stripe, PREMIUM_PRICE_ID } from '@/lib/stripe';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const session = getSession();
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  let email: string | undefined = session?.email;

  try {
    const body = await req.json().catch(() => ({}));
    if (body.email) email = body.email;
  } catch {}

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
    customer_email: email,
    success_url: `${base}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?canceled=1`,
    metadata: { source: 'videosave' },
    subscription_data: {
      metadata: { source: 'videosave' },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
