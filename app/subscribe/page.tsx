'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API_Caller from "../src/api_caller";
import { getToken, getUser } from "../src/auth";

interface Plan {
  slug: string;
  name: string;
  price: string;
  billing_period: string;
  description: string;
  features: string[];
  free?: boolean;
}

export default function SubscribePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState('');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push('/auth/signin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const plansResponse = await API_Caller('GET', null, '/subscriptions/plans/', null);
      setPlans(plansResponse.plans || plansResponse || []);
    } catch (fetchError) {
      console.error('Failed to load plans:', fetchError);
    }

    try {
      const subscriptionResponse = await API_Caller('GET', null, '/subscriptions/my-subscription/', null);
      setSubscription(subscriptionResponse.subscription || subscriptionResponse || null);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planSlug: string) => {
    setProcessingPlan(planSlug);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        plan_slug: planSlug,
        payment_method: paymentMethod,
        phone_number: phoneNumber
      };

      if (planSlug === 'basic' || plans.find((plan) => plan.slug === planSlug)?.free) {
        delete payload.payment_method;
        delete payload.phone_number;
      }

      const response = await API_Caller('POST', null, '/subscriptions/subscribe/', payload);

      if (response.redirect_url) {
        window.location.href = response.redirect_url;
        return;
      }

      if (response.subscription) {
        setSubscription(response.subscription);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start subscription.');
    } finally {
      setProcessingPlan('');
    }
  };

  const user = getUser();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Subscription Plans</h1>
        <p className="mt-2 text-gray-600">
          Secure your access to premium content, personalized recommendations, and subscriber-only stories.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading subscription details…</div>
      ) : (
        <>
          {subscription?.status === 'active' ? (
            <div className="rounded-3xl border border-green-200 bg-green-50 p-6 text-green-800 mb-8">
              <p className="text-lg font-semibold">You have an active subscription.</p>
              <p className="mt-2">Enjoy premium access and continue reading without limits.</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 mb-8 shadow-sm">
              <p className="text-lg font-semibold">No active subscription found.</p>
              <p className="mt-2 text-gray-600">Select a plan below to subscribe now.</p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {plans.length === 0 ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center">
                <p className="text-gray-600">No plans are available right now. Please try again later.</p>
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.slug} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">{plan.name}</h2>
                      <p className="mt-2 text-gray-600">{plan.description}</p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                      {plan.billing_period}
                    </span>
                  </div>

                  <div className="mt-6 mb-6 text-4xl font-bold text-gray-900">{plan.price}</div>

                  <ul className="space-y-3 text-gray-600 mb-6">
                    {plan.features?.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.slug)}
                    disabled={processingPlan === plan.slug}
                    className="inline-flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-70"
                  >
                    {processingPlan === plan.slug ? 'Processing…' : 'Subscribe'}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold mb-4">Payment details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Payment method</span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="ecocash">EcoCash</option>
                  <option value="onemoney">OneMoney</option>
                  <option value="bank_card">Bank card</option>
                  <option value="bank_transfer">Bank transfer</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Phone number</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder={(user?.phone_number as string) || '+263771234567'}
                />
              </label>
            </div>
          </div>

          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
