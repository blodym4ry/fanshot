import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  /* ── No Stripe configured — dev log ──────────────── */
  if (!stripeSecret || !webhookSecret) {
    console.log('[FanShot] Stripe webhook received (mock mode — skipping)');
    return NextResponse.json({ received: true });
  }

  /* ── Real webhook processing ─────────────────────── */
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2026-01-28.clover',
    });

    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing signature.' },
        { status: 400 }
      );
    }

    /* Verify webhook signature */
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    /* ── Handle events ─────────────────────────────── */
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { packageName, credits } = session.metadata || {};

        console.log(
          `[FanShot] ✅ Payment completed — package: ${packageName}, credits: ${credits}`,
          {
            sessionId: session.id,
            customerEmail: session.customer_details?.email,
            amountTotal: session.amount_total,
          }
        );

        // TODO: Connect to Supabase when ready
        // 1. Look up userId from metadata
        // 2. Add credits to user's paid_credits
        // 3. Create credit_transaction record
        // Example:
        // await supabase.rpc('add_credits', {
        //   p_user_id: userId,
        //   p_amount: Number(credits),
        //   p_type: 'purchase',
        //   p_description: `Purchased ${packageName} package`,
        // });

        break;
      }

      default:
        console.log(`[FanShot] Unhandled webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[FanShot] Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed.' },
      { status: 400 }
    );
  }
}
