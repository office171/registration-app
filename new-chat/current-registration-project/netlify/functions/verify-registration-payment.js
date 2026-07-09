const REGISTRATION_FEE_CENTS = 1000;
const REGISTRATION_FEE_CURRENCY = "usd";
const REGISTRATION_FEE_KIND = "registration_fee";

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return json(500, { error: "Missing STRIPE_SECRET_KEY environment variable." });
  }

  const sessionId = event.queryStringParameters?.session_id;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return json(400, { error: "Missing or invalid Stripe session id." });
  }

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${stripeSecretKey}` }
  });

  const session = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json(response.status, { error: session.error?.message || "Stripe payment verification failed." });
  }

  const amountOk = session.amount_total === REGISTRATION_FEE_CENTS;
  const currencyOk = session.currency === REGISTRATION_FEE_CURRENCY;
  const kindOk = session.metadata?.kind === REGISTRATION_FEE_KIND;
  const paid = session.payment_status === "paid" && session.status === "complete" && amountOk && currencyOk && kindOk;
  const amountUsd = typeof session.amount_total === "number" ? session.amount_total / 100 : null;

  return json(200, {
    paid,
    status: session.status,
    paymentStatus: session.payment_status,
    amountUsd,
    currency: session.currency,
    sessionId: session.id,
    paidAt: paid ? paidAt(session) : null
  });
};

function paidAt(session) {
  const timestamp = typeof session.created === "number" ? session.created * 1000 : Date.now();
  return new Date(timestamp).toISOString();
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}

