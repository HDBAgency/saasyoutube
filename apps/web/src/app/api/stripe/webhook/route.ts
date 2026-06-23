import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@saasyoutube/db';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Invalid signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;

      const email = session.customer_email;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!email) break;

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
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const isActive = sub.status === 'active' || sub.status === 'trialing';

      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          plan: isActive ? 'premium' : 'free',
          subscriptionStatus: sub.status,
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;

      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { plan: 'free', subscriptionStatus: 'canceled' },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
