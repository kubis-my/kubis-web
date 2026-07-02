import { loadStripe, Stripe } from '@stripe/stripe-js';
import { env } from '@repo/commons/constant/env';

let stripePromise: Promise<Stripe | null> | undefined;

export function getStripe() {
    if (!stripePromise) {
        stripePromise = loadStripe(env.NEXT_PUBLIC_FORGE_STRIPE_PUBLISHABLE_KEY);
    }

    return stripePromise;
}
