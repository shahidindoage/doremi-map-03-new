// CheckoutForm.jsx
"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutForm({ items, setClientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Create PaymentIntent with customer info
    const res = await fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        customer: { name: customerName, email: customerEmail }
      }),
    });
    const data = await res.json();
    if (!data.clientSecret) {
      console.error("Failed to create PaymentIntent");
      setLoading(false);
      return;
    }

    setClientSecret(data.clientSecret);

    // 2️⃣ Confirm Payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: data.clientSecret,
      redirect: "if_required",
      payment_method_data: {
        billing_details: { name: customerName, email: customerEmail },
      },
    });

    if (paymentIntent?.status === "succeeded") onSuccess();
    if (error) console.error(error);

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input type="text" placeholder="Enter your name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
      
      <label>Email</label>
      <input type="email" placeholder="Enter your email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />

      <PaymentElement />

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
