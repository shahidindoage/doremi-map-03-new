"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ onSuccess, clientSecret, customerName, customerEmail, customerPhone, items }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [allBooked, setAllBooked] = useState(false);

  const totalAmount = items.reduce((sum, seat) => sum + Number(seat.price), 0);

  async function handleSubmit(e) {
    e.preventDefault();
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
        const piId = paymentIntent.id;
        const booked = await pollBookingStatus(piId, items.length);
        if (booked) setAllBooked(true);

        setTimeout(() => onSuccess?.(), 1000);
      }

      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function pollBookingStatus(paymentIntentId, expectedCount) {
    const maxTries = 20;
    const interval = 1000;
    for (let i = 0; i < maxTries; i++) {
      const res = await fetch(`/api/bookings/status?pi=${paymentIntentId}`);
      const data = await res.json();
      if (data.count === expectedCount) return true;
      await new Promise((r) => setTimeout(r, interval));
    }
    return false;
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontSize: "0.85rem" }}>
      {/* Total Amount */}
      <div style={{ fontWeight: 600, textAlign: "right", marginBottom: 10, color: "black" }}>
        Total: AED {totalAmount.toFixed(2)}
      </div>

      <PaymentElement options={{ layout: "tabs" }} />

      <button type="submit" disabled={loading || allBooked} style={smallButtonStyle}>
        {loading && !allBooked ? <div style={smallSpinnerStyle}></div> : allBooked ? "✅ Booked!" : "Pay Now"}
      </button>

      {allBooked && (
        <p style={{ color: "green", marginTop: 10, fontWeight: 600, textAlign: "center", fontSize: "0.85rem" }}>
          All seats successfully booked!
        </p>
      )}
    </form>
  );
}


export default function StripePaymentPopup({ open, onClose, items, customerName, customerEmail, customerPhone, onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!open || clientSecret) return;

    fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customerName, customerEmail, customerPhone }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch(console.error);
  }, [open, clientSecret, items, customerName, customerEmail, customerPhone]);

  if (!open) return null;

  return (
    <div style={smallPopupOverlay}>
      <div style={smallPopupContainer}>
        <button onClick={onClose} style={closeButton}>✖</button>
        <h3 style={{ marginBottom: 15, fontSize: "1rem",color:'#0772de' }}>Complete Payment</h3>

        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              customerName={customerName}
              customerEmail={customerEmail}
              customerPhone={customerPhone}
              items={items}
              onSuccess={() => {
                onSuccess?.();
                onClose();
              }}
              clientSecret={clientSecret}
            />
          </Elements>
        ) : (
          <p style={{ textAlign: "center", fontSize: "0.85rem" }}>Loading payment options...</p>
        )}
      </div>
    </div>
  );
}

// Styles
const smallButtonStyle = {
  width: "100%",
  marginTop: 10,
  padding: 8,
  borderRadius: 5,
  background: "#f5c400",
  border: "none",
  fontWeight: 600,
  fontSize: "0.85rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
};

const smallPopupOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
};

const smallPopupContainer = {
  width: 450,
  maxHeight: "80vh",      // popup height won't exceed 80% of viewport
  background: "#fff",
  borderRadius: 8,
  padding: 15,
  position: "relative",
  overflowY: "auto",      // enable vertical scrolling
};


const closeButton = {
  position: "absolute",
  right: 8,
  top: 8,
  fontSize: 18,
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const smallSpinnerStyle = {
  width: 16,
  height: 16,
  border: "3px solid #fff",
  borderTop: "3px solid #f5c400",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};
