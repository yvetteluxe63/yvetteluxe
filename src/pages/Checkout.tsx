import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PAYSTACK_CONFIG } from '@/config/paystack';

const Checkout = () => {
  const navigate = useNavigate();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { addOrder, state: adminState } = useAdmin();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'momo',
    network: '',
    momoNumber: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const payWithPaystack = () => {
    try {
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: PAYSTACK_CONFIG.PUBLIC_KEY,
        amount: cartState.total * 100, // Convert to kobo/pesewas
        email: formData.email,
        currency: adminState.currency || PAYSTACK_CONFIG.CURRENCY,
        onSuccess: (transaction) => {
          console.log('Payment successful:', transaction);
          handleSuccessfulPayment(transaction.reference, 'paystack');
        },
        onCancel: () => {
          console.log('Payment cancelled by user');
          toast.error('Payment was cancelled');
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('Paystack initialization error:', error);
      toast.error('Payment setup failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleMomoPayment = () => {
    console.log('Processing mobile money payment...');
    // Simulate mobile money processing
    setTimeout(() => {
      handleSuccessfulPayment('momo_' + Date.now(), 'momo');
    }, 2000);
  };

  const handleSuccessfulPayment = async (reference: string, method: string) => {
    console.log('Processing successful payment:', { reference, method });
    
    // Create order data
    const orderData = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      customerAddress: formData.address,
      items: cartState.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      total: cartState.total,
      paymentMethod: method,
      network: formData.network,
      momoNumber: formData.momoNumber,
      paymentReference: reference,
      isPaid: true
    };

    addOrder(orderData);
    
    try {
      // Send confirmation email to customer
      await sendCustomerConfirmationEmail(orderData);
      
      // Send notification email to admin
      await sendAdminNotificationEmail(orderData);
      
      toast.success('Order confirmed! Check your email for confirmation details.');
    } catch (error) {
      console.log('Email sending failed:', error);
      toast.success('Order confirmed! (Email notification may be delayed)');
    }
    
    // Clear cart
    cartDispatch({ type: 'CLEAR_CART' });
    
    // Redirect to confirmation
    navigate('/order-confirmation', { state: { orderData } });
    
    setIsProcessing(false);
  };

  const sendCustomerConfirmationEmail = async (orderData: any) => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const currency = adminState.currency || 'GHS';
    
    // Create detailed order summary
    const itemsDetails = orderData.items.map((item: any) => {
      let itemLine = `${item.quantity}x ${item.name}`;
      if (item.size) itemLine += ` (Size: ${item.size})`;
      if (item.color) itemLine += ` (Color: ${item.color})`;
      itemLine += ` - ${currency} ${(item.price * item.quantity).toFixed(2)}`;
      return itemLine;
    }).join('\n');

    const emailBody = `
Dear ${orderData.customerName},

Thank you for your order! Your payment has been successfully processed.

ORDER DETAILS
Order ID: ${orderId}
Payment Status: SUCCESSFUL
Payment Reference: ${orderData.paymentReference}

CUSTOMER INFORMATION
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.customerPhone}
Delivery Address: ${orderData.customerAddress}

ITEMS ORDERED
${itemsDetails}

PAYMENT INFORMATION
Payment Method: ${orderData.paymentMethod === 'momo' ? 'Mobile Money' : 'Paystack'}
${orderData.network ? `Network: ${orderData.network.toUpperCase()}` : ''}
Total Amount: ${currency} ${orderData.total.toFixed(2)}

DELIVERY INFORMATION
Estimated Delivery: 2-3 business days
Delivery Address: ${orderData.customerAddress}

You will receive SMS updates about your delivery status.

Thank you for shopping with us!

Best regards,
Your Store Team
    `.trim();

    const formData = new FormData();
    // 📧 REPLACE 'your-customer-email@example.com' WITH YOUR ACTUAL EMAIL
    formData.append('_to', orderData.customerEmail);
    formData.append('_subject', `Order Confirmation - ${orderId}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('message', emailBody);
    formData.append('order_id', orderId);
    formData.append('customer_name', orderData.customerName);
    formData.append('total_amount', `${currency} ${orderData.total.toFixed(2)}`);
    formData.append('payment_status', 'SUCCESSFUL');

    // 📧 REPLACE 'your-customer-email@example.com' WITH YOUR ACTUAL EMAIL
    await fetch('https://formsubmit.co/ajax/yvetteluxe63@gmail.com', {
      method: 'POST',
      body: formData
    });
  };

  const sendAdminNotificationEmail = async (orderData: any) => {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const currency = adminState.currency || 'GHS';
    
    const itemsText = orderData.items.map((item: any) => {
      let itemDetails = `${item.quantity}x ${item.name}`;
      if (item.size) itemDetails += ` (Size: ${item.size})`;
      if (item.color) itemDetails += ` (Color: ${item.color})`;
      itemDetails += ` - ${currency} ${(item.price * item.quantity).toFixed(2)}`;
      return itemDetails;
    }).join('\n');

    const adminFormData = new FormData();
    adminFormData.append('_subject', `New Order Received - ${orderId}`);
    adminFormData.append('_captcha', 'false');
    adminFormData.append('_template', 'table');
    adminFormData.append('order_id', orderId);
    adminFormData.append('customer_name', orderData.customerName);
    adminFormData.append('customer_phone', orderData.customerPhone);
    adminFormData.append('customer_email', orderData.customerEmail);
    adminFormData.append('customer_address', orderData.customerAddress);
    adminFormData.append('total_amount', `${currency} ${orderData.total.toFixed(2)}`);
    adminFormData.append('payment_method', orderData.paymentMethod);
    adminFormData.append('payment_reference', orderData.paymentReference);
    adminFormData.append('payment_status', 'PAID');
    adminFormData.append('order_items', itemsText);
    
    if (orderData.network) {
      adminFormData.append('network', orderData.network);
    }
    if (orderData.momoNumber) {
      adminFormData.append('momo_number', orderData.momoNumber);
    }

    // 📧 REPLACE 'your-admin-email@example.com' WITH YOUR ACTUAL ADMIN EMAIL
    await fetch('https://formsubmit.co/ajax/yvetteluxe63@gmail.com', {
      method: 'POST',
      body: adminFormData
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'momo' && (!formData.network || !formData.momoNumber)) {
      toast.error('Please provide mobile money details');
      return;
    }

    // Validate Paystack key for Paystack payments
    if (formData.paymentMethod === 'paystack') {
      if (!PAYSTACK_CONFIG.PUBLIC_KEY || PAYSTACK_CONFIG.PUBLIC_KEY === 'pk_live_ea993090b4c19248ae169d2034eee32a840b412c') {
        toast.error('Paystack public key not configured. Please contact admin.');
        return;
      }
    }

    setIsProcessing(true);

    if (formData.paymentMethod === 'paystack') {
      payWithPaystack();
    } else {
      handleMomoPayment();
    }
  };

  if (cartState.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g., +233 24 123 4567"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Order confirmation will be sent to this email
                  </p>
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your delivery address"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone size={20} />
                      <span>Mobile Money (Simulation)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="paystack" id="paystack" />
                    <Label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard size={20} />
                      <span>Card / Mobile Money (Paystack)</span>
                    </Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === 'momo' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="network">Mobile Network *</Label>
                      <Select
                        value={formData.network}
                        onValueChange={(value) => handleInputChange('network', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                          <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                          <SelectItem value="airteltigo">AirtelTigo Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="momoNumber">Mobile Money Number *</Label>
                      <Input
                        id="momoNumber"
                        type="tel"
                        value={formData.momoNumber}
                        onChange={(e) => handleInputChange('momoNumber', e.target.value)}
                        placeholder="Enter your mobile money number"
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'paystack' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      You'll be redirected to Paystack to complete your payment securely using your card or mobile money.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartState.items.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image_url}  
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        {item.size && (
                          <p className="text-gray-600 text-xs">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-gray-600 text-xs">Color: {item.color}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold">
                      {adminState.currency || 'GHS'} {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{adminState.currency || 'GHS'} {cartState.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-orange-500">{adminState.currency || 'GHS'} {cartState.total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  onClick={payWithPaystack}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Payment...' : 'Place Order'}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By placing this order, you agree to our terms and conditions.
                  Order confirmation will be sent to your email.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
