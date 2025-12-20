"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

/* ================= CHECKOUT FORM ================= */
function CheckoutForm({
  customerName,
  customerEmail,
  customerPhone,
  items,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [allBooked, setAllBooked] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            },
          },
        },
      });

      if (paymentIntent?.status === "succeeded") {
        await pollBookingStatus(paymentIntent.id, items.length);
        setAllBooked(true);
        setTimeout(() => onSuccess?.(), 800);
      }

      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function pollBookingStatus(paymentIntentId, expectedCount) {
    for (let i = 0; i < 20; i++) {
      const res = await fetch(`/api/bookings/status?pi=${paymentIntentId}`);
      const data = await res.json();
      if (data.count === expectedCount) return true;
      await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontSize: "0.85rem" }}>
      <PaymentElement 
      options={{
    layout: {
      type: "accordion",
      defaultCollapsed: false,
      radios: true,
    },
  }}
      />

      <button
        type="submit"
        disabled={loading || allBooked}
        style={payButton}
      >
        {loading ? "Processing..." : allBooked ? "✅ Booked!" : "Pay Now"}
      </button>

      {allBooked && (
        <p style={{ color: "green", textAlign: "center", marginTop: 8 }}>
          All seats successfully booked!
        </p>
      )}
    </form>
  );
}

/* ================= POPUP ================= */
export default function StripePaymentPopup({
  open,
  onClose,
  items,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
}) {
  const [clientSecret, setClientSecret] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponType, setCouponType] = useState("");
  const [discountpercentage, setDiscountPercentage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [activeAction, setActiveAction] = useState(null);
// "coupon" | "continue" | null


  const totalAmount = items.reduce(
    (sum, seat) => sum + Number(seat.price),
    0
  );

  const payable = Math.max(totalAmount - discount, 0);

 async function createPaymentIntent(action) {
  setActiveAction(action);
  setCreating(true);
  setError("");

  const res = await fetch("/api/payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      customerName,
      customerEmail,
      customerPhone,
      coupon,
    }),
  });

  const data = await res.json();

  if (coupon && !data.couponApplied) {
    setError("Coupon expired or invalid");
    setCreating(false);
    setActiveAction(null);
    return;
  }

  if (data.clientSecret) {
    setDiscount(data.discount || 0);
    setCouponType(data.couponType);
    setDiscountPercentage(data.discountpercentage);
    setClientSecret(data.clientSecret);
  } else {
    setError("Unable to start payment. Try again.");
  }

  setCreating(false);
  setActiveAction(null);
}

  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={popup}>
        {/* 🔒 Sticky Top Summary */}
<div style={topSummary}>
  <div>
    <strong>Payable Amount</strong>
    {discount > 0 && couponType && (
      <div style={{ fontSize: 12, color: "#ffffffb3" }}>
        Coupon applied −{" "}
        {couponType === "FIXED"
          ? `AED ${discount}`
          : `${discountpercentage}%`}
      </div>
    )}
  </div>
  <div style={amountText}>
    AED {payable.toLocaleString("en-IN")}
  </div>
</div>


        {/* 🔽 Scroll Area */}
        <div style={scrollArea}>
          {!clientSecret ? (
            <>
              <input
  value={coupon}
  onChange={(e) => setCoupon(e.target.value)}
  placeholder="Enter Coupon Code"
  style={input}
/>

<div style={{ display: "flex", gap: 8 }}>
  {/* Apply Coupon */}
  <button
    onClick={() => createPaymentIntent("coupon")}
    disabled={creating || !coupon.trim()}
    style={{
      ...continueBtn,
      background: !coupon.trim() ? "#ccc" : "#111",
      color: !coupon.trim() ? "#666" : "#fff",
    }}
  >
    {creating && activeAction === "coupon"
      ? "Applying..."
      : "Apply Coupon"}
  </button>

  {/* Continue to Payment */}
  <button
    onClick={() => createPaymentIntent("continue")}
    disabled={creating}
    style={continueBtn}
  >
    {creating && activeAction === "continue"
      ? "Preparing..."
      : "Continue to Payment"}
  </button>
</div>



              {error && (
                <p style={{ color: "red", marginTop: 8 }}>{error}</p>
              )}
            </>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                items={items}
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                onSuccess={() => {
                  onSuccess?.();
                  onClose();
                }}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
};

const popup = {
  width: 420,
  maxHeight: "80vh",
  background: "#fff",
  borderRadius: 8,
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const topSummary = {
  position: "sticky",
  top: 0,
  background: "#f5c400",
  padding: "10px 14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
  zIndex: 5,
};

const amountText = {
  fontSize: 18,
  fontWeight: 700,
  color: "#000000ff",
};

const scrollArea = {
  padding: 14,
  overflowY: "auto",
  flex: 1,
};

const closeBtn = {
  position: "absolute",
  right: 10,
  top: 10,
  background: "transparent",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  zIndex: 10,
};

const input = {
  width: "100%",
  padding: 8,
  marginBottom: 8,
  color:'red',
  border:"1px solid rgb(204, 204, 204)",
  borderRadius: '6px',
  color:'black'
};

const continueBtn = {
  width: "100%",
  padding: 10,
  background: "#f5c400",
  border: "none",
  fontWeight: 600,
  cursor:'pointer'
};

const payButton = {
  width: "100%",
  padding: 10,
  background: "#f5c400",
  border: "none",
  fontWeight: 600,
  marginTop: 10,
};