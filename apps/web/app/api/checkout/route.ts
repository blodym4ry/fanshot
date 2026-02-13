import { NextRequest, NextResponse } from 'next/server';

/* ── Package definitions (mirroring DB seed) ────────── */
const PACKAGES: Record<
  string,
  { name: string; credits: number; priceId: string; amount: number }
> = {
  starter: {
    name: 'Starter',
    credits: 5,
    priceId: 'price_starter_test', // replace with real Stripe price ID
    amount: 299,
  },
  fan_pack: {
    name: 'Fan Pack',
    credits: 15,
    priceId: 'price_fan_pack_test',
    amount: 699,
  },
  super_fan: {
    name: 'Super Fan',
    credits: 50,
    priceId: 'price_super_fan_test',
    amount: 1499,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { packageName } = await req.json();

    if (!packageName || !PACKAGES[packageName]) {
      return NextResponse.json(
        { error: 'Geçersiz paket.' },
        { status: 400 }
      );
    }

    const pkg = PACKAGES[packageName];
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    /* ── Mock mode: no Stripe key ──────────────────── */
    if (!stripeSecret) {
      console.log(
        `[FanShot] Mock checkout — package: ${packageName}, credits: ${pkg.credits}`
      );
      return NextResponse.json({
        url: `/credits/success?mock=true&package=${packageName}&credits=${pkg.credits}`,
      });
    }

    /* ── Real Stripe Checkout ──────────────────────── */
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2026-01-28.clover',
    });

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FanShot ${pkg.name} — ${pkg.credits} Kredi`,
              description: `${pkg.credits} AI fotoğraf üretim hakkı`,
            },
            unit_amount: pkg.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/credits/success?session_id={CHECKOUT_SESSION_ID}&package=${packageName}&credits=${pkg.credits}`,
      cancel_url: `${origin}/credits`,
      metadata: {
        packageName,
        credits: String(pkg.credits),
        // userId will be added when Supabase auth is connected
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[FanShot] Checkout error:', err);
    return NextResponse.json(
      { error: 'Ödeme başlatılamadı.' },
      { status: 500 }
    );
  }
}
