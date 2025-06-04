
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderConfirmation = () => {
  const location = useLocation();
  const { state: adminState } = useAdmin();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/shop">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Details</span>
                <span className="text-sm font-normal text-gray-600">#{orderId}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-sm text-gray-600">Name: {orderData.customerName}</p>
                  <p className="text-sm text-gray-600">Phone: {orderData.customerPhone}</p>
                  <p className="text-sm text-gray-600">Address: {orderData.customerAddress}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <p className="text-sm text-gray-600">Method: {orderData.paymentMethod === 'momo' ? 'Mobile Money' : 'Paystack'}</p>
                  {orderData.network && (
                    <p className="text-sm text-gray-600">
                      Network: {orderData.network.toUpperCase()}
                    </p>
                  )}
                  <p className="text-sm text-green-600 font-semibold">Status: Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ordered Items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ordered Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.items.map((item: any, index: number) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.size && (
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                      )}
                    </div>
                    <span className="font-semibold">
                      {adminState.currency} {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">{adminState.currency} {orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Estimated Delivery:</strong> 2-3 business days
                </p>
                <p className="text-sm text-blue-800">
                  Your order will be delivered to: {orderData.customerAddress}
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  You will receive SMS updates about your delivery status.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" size="lg" className="flex-1">
              <Download className="mr-2" size={20} />
              Download Receipt
            </Button>
            <Link to="/shop" className="flex-1">
              <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600">
                Continue Shopping
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Need help with your order?
            </p>
            <Link to="/contact">
              <Button variant="link" className="text-orange-500">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
