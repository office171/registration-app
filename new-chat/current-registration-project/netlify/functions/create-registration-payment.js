const STRIPE_CHECKOUT_URL = "https://api.stripe.com/v1/checkout/sessions";
const REGISTRATION_FEE_CENTS = 1000;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return json(500, { error: "Missing STRIPE_SECRET_KEY environment variable." });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const origin = allowedOrigin(event);
  const studentEmail = String(body.studentEmail || "").trim();
  const studentName = String(body.studentName || "").trim();

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/?payment=registration_success&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/?payment=registration_cancelled`);
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(REGISTRATION_FEE_CENTS));
  params.set("line_items[0][price_data][product_data][name]", "דמי הרשמה");
  params.set("line_items[0][price_data][product_data][description]", "דמי הרשמה לתוכנית תלמידי התמימים");
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[kind]", "registration_fee");
  if (studentEmail) params.set("customer_email", studentEmail);
  if (studentName) params.set("metadata[student_name]", studentName);
  if (studentEmail) params.set("metadata[student_email]", studentEmail);
  params.set("payment_intent_data[metadata][kind]", "registration_fee");
  if (studentName) params.set("payment_intent_data[metadata][student_name]", studentName);
  if (studentEmail) params.set("payment_intent_data[metadata][student_email]", studentEmail);

  const response = await fetch(STRIPE_CHECKOUT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json(response.status, { error: result.error?.message || "Stripe checkout session creation failed." });
  }

  return json(200, { id: result.id, url: result.url });
};

function allowedOrigin(event) {
  const origin = event.headers.origin || event.headers.Origin;
  const allowed = (process.env.ALLOWED_SITE_ORIGIN || process.env.URL || "").replace(/\/$/, "");
  if (allowed) return allowed;
  if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  if (process.env.URL) return process.env.URL;
  return "http://localhost:8888";
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
