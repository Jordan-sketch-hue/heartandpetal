// PayPal JS SDK v6 integration for Heart & Petal
// Handles PayPal, Pay Later, and PayPal Credit buttons

async function onPayPalWebSdkLoaded() {
  try {
    // Get client token for authentication
    const clientToken = await getBrowserSafeClientToken();
    // Create PayPal SDK instance
    const sdkInstance = await window.paypal.createInstance({
      clientToken,
      components: ["paypal-payments"],
      pageType: "checkout",
    });
    // Check eligibility for all payment methods
    const paymentMethods = await sdkInstance.findEligibleMethods({
      currencyCode: "USD",
    });
    // Set up PayPal button if eligible
    if (paymentMethods.isEligible("paypal")) {
      setUpPayPalButton(sdkInstance);
    }
    // Set up Pay Later button if eligible
    if (paymentMethods.isEligible("paylater")) {
      const payLaterPaymentMethodDetails = paymentMethods.getDetails("paylater");
      setUpPayLaterButton(sdkInstance, payLaterPaymentMethodDetails);
    }
    // Set up PayPal Credit button if eligible
    if (paymentMethods.isEligible("credit")) {
      const paypalCreditPaymentMethodDetails = paymentMethods.getDetails("credit");
      setUpPayPalCreditButton(sdkInstance, paypalCreditPaymentMethodDetails);
    }
  } catch (error) {
    console.error("SDK initialization error:", error);
    document.getElementById('paypal-error').classList.remove('hidden');
  }
}

const paymentSessionOptions = {
  async onApprove(data) {
    console.log("Payment approved:", data);
    try {
      const orderData = await captureOrder({ orderId: data.orderId });
      console.log("Payment captured successfully:", orderData);
      // You can add order confirmation logic here
    } catch (error) {
      console.error("Payment capture failed:", error);
    }
  },
  onCancel(data) {
    console.log("Payment cancelled:", data);
  },
  onError(error) {
    console.error("Payment error:", error);
    document.getElementById('paypal-error').classList.remove('hidden');
  },
};

async function setUpPayPalButton(sdkInstance) {
  const paypalPaymentSession = sdkInstance.createPayPalOneTimePaymentSession(paymentSessionOptions);
  const paypalButton = document.querySelector("paypal-button");
  paypalButton.removeAttribute("hidden");
  paypalButton.addEventListener("click", async () => {
    try {
      await paypalPaymentSession.start({ presentationMode: "auto" }, createOrder());
    } catch (error) {
      console.error("PayPal payment start error:", error);
    }
  });
}

async function setUpPayLaterButton(sdkInstance, payLaterPaymentMethodDetails) {
  const payLaterPaymentSession = sdkInstance.createPayLaterOneTimePaymentSession(paymentSessionOptions);
  const { productCode, countryCode } = payLaterPaymentMethodDetails;
  const payLaterButton = document.querySelector("paypal-pay-later-button");
  payLaterButton.productCode = productCode;
  payLaterButton.countryCode = countryCode;
  payLaterButton.removeAttribute("hidden");
  payLaterButton.addEventListener("click", async () => {
    try {
      await payLaterPaymentSession.start({ presentationMode: "auto" }, createOrder());
    } catch (error) {
      console.error("Pay Later payment start error:", error);
    }
  });
}

async function setUpPayPalCreditButton(sdkInstance, paypalCreditPaymentMethodDetails) {
  const paypalCreditPaymentSession = sdkInstance.createPayPalCreditOneTimePaymentSession(paymentSessionOptions);
  const { countryCode } = paypalCreditPaymentMethodDetails;
  const paypalCreditButton = document.querySelector("paypal-credit-button");
  paypalCreditButton.countryCode = countryCode;
  paypalCreditButton.removeAttribute("hidden");
  paypalCreditButton.addEventListener("click", async () => {
    try {
      await paypalCreditPaymentSession.start({ presentationMode: "auto" }, createOrder());
    } catch (error) {
      console.error("PayPal Credit payment start error:", error);
    }
  });
}

// Example: fetch client token from backend
async function getBrowserSafeClientToken() {
  const res = await fetch('/paypal-api/client-token');
  if (!res.ok) throw new Error('Failed to get client token');
  const { clientToken } = await res.json();
  return clientToken;
}

// Example: create order on backend
async function createOrder() {
  const cart = getCart();
  const response = await fetch("/paypal-api/checkout/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart }),
  });
  const { id } = await response.json();
  return { orderId: id };
}

// Example: capture order on backend
async function captureOrder({ orderId }) {
  const response = await fetch(`/paypal-api/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
}

// Wait for PayPal SDK to load
window.onPayPalWebSdkLoaded = onPayPalWebSdkLoaded;
