const REGISTRATION_FEE_CENTS = 1000;
const REGISTRATION_FEE_CURRENCY = "usd";
const REGISTRATION_FEE_KIND = "registration_fee";
const MANUAL_PAID_REGISTRATION_FEES = [
  {
    birthDate: "1993-08-20",
    lastNameEn: "margalyot",
    paymentIntentId: "manual-paid-margalyot-1993-08-20",
    paidAt: "2026-07-12T00:00:00.000Z"
  }
];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const birthDate = String(body.birthDate || "").trim();
  const lastNameEn = normalizeLookupValue(body.lastNameEn || "");
  if (!birthDate || !lastNameEn) {
    return json(400, { error: "Missing payment lookup details." });
  }

  const manualPayment = manualPaidRegistrationFee_(birthDate, lastNameEn);
  if (manualPayment) {
    return json(200, {
      paid: true,
      paymentIntentId: manualPayment.paymentIntentId,
      amountUsd: REGISTRATION_FEE_CENTS / 100,
      currency: REGISTRATION_FEE_CURRENCY,
      paidAt: manualPayment.paidAt,
      source: "manual",
      birthDate: manualPayment.birthDate,
      lastNameEn: manualPayment.lastNameEn
    });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return json(500, { error: "Missing STRIPE_SECRET_KEY environment variable." });
  }

  const query = [
    "metadata['kind']:'" + escapeSearchValue(REGISTRATION_FEE_KIND) + "'",
    "metadata['registration_birth_date']:'" + escapeSearchValue(birthDate) + "'",
    "metadata['registration_last_name_en']:'" + escapeSearchValue(lastNameEn) + "'",
    "status:'succeeded'"
  ].join(" AND ");

  const params = new URLSearchParams();
  params.set("query", query);
  params.set("limit", "1");

  const response = await fetch(`https://api.stripe.com/v1/payment_intents/search?${params.toString()}`, {
    headers: { Authorization: `Bearer ${stripeSecretKey}` }
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json(response.status, { error: result.error?.message || "Stripe payment lookup failed." });
  }

  const paymentIntent = Array.isArray(result.data) ? result.data.find(isValidRegistrationFee) : null;
  if (!paymentIntent) {
    return json(200, { paid: false });
  }

  return json(200, {
    paid: true,
    paymentIntentId: paymentIntent.id,
    amountUsd: paymentIntent.amount_received / 100,
    currency: paymentIntent.currency,
    paidAt: paidAt(paymentIntent),
    birthDate: paymentIntent.metadata?.registration_birth_date || birthDate,
    lastNameEn: paymentIntent.metadata?.registration_last_name_en || lastNameEn
  });
};

function manualPaidRegistrationFee_(birthDate, lastNameEn) {
  return MANUAL_PAID_REGISTRATION_FEES.find(function(payment) {
    return payment.birthDate === birthDate && payment.lastNameEn === lastNameEn;
  }) || null;
}

function isValidRegistrationFee(paymentIntent) {
  return (
    paymentIntent &&
    paymentIntent.status === "succeeded" &&
    paymentIntent.amount_received === REGISTRATION_FEE_CENTS &&
    paymentIntent.currency === REGISTRATION_FEE_CURRENCY &&
    paymentIntent.metadata?.kind === REGISTRATION_FEE_KIND
  );
}

function normalizeLookupValue(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeSearchValue(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function paidAt(paymentIntent) {
  const timestamp = typeof paymentIntent.created === "number" ? paymentIntent.created * 1000 : Date.now();
  return new Date(timestamp).toISOString();
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
