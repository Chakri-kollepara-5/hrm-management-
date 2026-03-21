import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handlePayment = async (user, amount, sevaType) => {
  // In a real app, you would call your Cloud Function to create an order first
  // const response = await fetch('/api/create-order', { method: 'POST', body: JSON.stringify({ amount }) });
  // const order = await response.json();
  
  console.log(`Initializing Razorpay payment for ${user.displayName}: ₹${amount} for ${sevaType}`);
  
  // Mocking the Razorpay success for now since we don't have a backend order ID
  const options = {
    key: 'rzp_test_YOUR_KEY_HERE', // Placeholder
    amount: amount * 100,
    currency: 'INR',
    name: 'Gauranga Hub',
    description: `Donation for ${sevaType}`,
    image: 'https://cdn-icons-png.flaticon.com/512/3354/3354519.png',
    handler: async function (response) {
      // On success, save to Firestore
      try {
        await addDoc(collection(db, 'payments'), {
          userId: user.uid,
          userName: user.name || user.displayName,
          amount: amount,
          sevaType: sevaType,
          razorpayPaymentId: response.razorpay_payment_id,
          status: 'SUCCESS',
          createdAt: serverTimestamp()
        });
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
      } catch (error) {
        console.error("Payment logging error:", error);
      }
    },
    prefill: {
      name: user.displayName,
      email: user.email,
    },
    theme: {
      color: '#FF9933',
    },
  };

  // Simulate Razorpay trigger if key is valid, or just mock success in DEV
  alert(`[MOCK] Redirecting to Razorpay for ₹${amount}...`);
  // For demonstration, we'll auto-trigger success in this mock
  setTimeout(async () => {
    await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        userName: user?.name || user?.displayName || 'Devotee',
        amount: amount,
        sevaType: sevaType,
        status: 'SUCCESS',
        createdAt: serverTimestamp()
    });
    alert("Donation successful! Thank you for your seva.");
  }, 1000);
};
