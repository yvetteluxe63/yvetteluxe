
// Paystack Configuration
// Replace 'pk_test_your_paystack_public_key_here' with your actual Paystack public key
// For live transactions, use 'pk_live_xxx' format
// For testing, use 'pk_test_xxx' format

export const PAYSTACK_CONFIG = {
  // 🔑 PASTE YOUR PAYSTACK PUBLIC KEY HERE
  PUBLIC_KEY: 'pk_live_508e09d75f4457645d15fb6f8a3e6abf3400d565', // Replace with your actual key
  
  // Optional: Set your currency (should match your Paystack dashboard settings)
  CURRENCY: 'GHS', // or 'NGN', 'USD', etc.
  
  // Test mode flag - set to false for production
  TEST_MODE: true
};

// Helper function to validate Paystack key format
export const validatePaystackKey = (key: string): boolean => {
  return key.startsWith('pk_live_') || key.startsWith('pk_test_');
};
