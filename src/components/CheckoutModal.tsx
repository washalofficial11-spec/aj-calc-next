import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, CheckCircle, Upload, X } from 'lucide-react';
import { Product } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
    paymentMethodId: ''
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();

  // Fetch payment methods
  const { data: paymentMethods, isLoading: loadingPaymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_enabled', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  const checkoutItems = product ? [{ ...product, quantity: 1 }] : items;
  const totalAmount = product 
    ? parseFloat(product.price.replace(/,/g, ''))
    : getTotalPrice();

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Upload payment screenshot if provided
      let paymentScreenshotUrl = null;
      if (paymentScreenshot) {
        const fileExt = paymentScreenshot.name.split('.').pop();
        const fileName = `${orderNumber}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('payment-screenshots')
          .upload(filePath, paymentScreenshot);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(filePath);

        paymentScreenshotUrl = publicUrl;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode || null,
          notes: formData.notes || null,
          payment_method_id: formData.paymentMethodId,
          payment_screenshot_url: paymentScreenshotUrl,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = checkoutItems.map(item => ({
        order_id: order.id,
        product_name: item.name,
        product_image: item.image,
        quantity: product ? 1 : item.quantity,
        price: parseFloat(item.price.replace(/,/g, ''))
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully!",
        description: "We'll contact you shortly to confirm your order.",
      });

      if (!product) {
        clearCart();
      }

      onClose();
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: '',
        paymentMethodId: ''
      });
      setPaymentScreenshot(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paymentMethodId) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    const selectedMethod = paymentMethods?.find(m => m.id === formData.paymentMethodId);
    if (selectedMethod?.type === 'advance_payment' && !paymentScreenshot) {
      toast({
        title: "Payment Screenshot Required",
        description: "Please upload your payment screenshot for advance payment",
        variant: "destructive"
      });
      return;
    }

    createOrderMutation.mutate();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const selectedPaymentMethod = paymentMethods?.find(m => m.id === formData.paymentMethodId);
  const isAdvancePayment = selectedPaymentMethod?.type === 'advance_payment';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
            <div className="space-y-2">
              {checkoutItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} {!product && `x ${item.quantity}`}</span>
                  <span className="font-medium">
                    PKR {product ? item.price : (parseFloat(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-orange-600">
                  PKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Street address, apartment, suite, etc."
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your city"
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions for your order"
                rows={2}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payment Method</h3>
            
            {loadingPaymentMethods ? (
              <div className="text-muted-foreground">Loading payment methods...</div>
            ) : (
              <RadioGroup
                value={formData.paymentMethodId}
                onValueChange={(value) => setFormData({ ...formData, paymentMethodId: value })}
              >
                {paymentMethods?.map((method) => (
                  <div key={method.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer font-medium">
                        {method.name}
                      </Label>
                    </div>
                    
                    {formData.paymentMethodId === method.id && method.type === 'advance_payment' && (
                      <div className="ml-6 space-y-3 pt-2 border-t">
                        {method.account_number && (
                          <div className="bg-muted p-3 rounded">
                            <p className="text-sm font-medium">Account Number:</p>
                            <p className="text-sm text-muted-foreground font-mono">{method.account_number}</p>
                          </div>
                        )}
                        
                        {method.qr_code_url && (
                          <div className="bg-muted p-3 rounded">
                            <p className="text-sm font-medium mb-2">Scan QR Code to Pay:</p>
                            <img 
                              src={method.qr_code_url} 
                              alt={`${method.name} QR Code`}
                              className="w-48 h-48 object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Payment Screenshot Upload for Advance Payment */}
          {isAdvancePayment && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted">
              <h3 className="font-semibold text-lg">Upload Payment Proof *</h3>
              <p className="text-sm text-muted-foreground">
                Please upload a screenshot of your payment confirmation
              </p>
              
              {paymentScreenshot ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-background border rounded">
                    <span className="text-sm truncate flex-1">{paymentScreenshot.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPaymentScreenshot(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <img 
                    src={URL.createObjectURL(paymentScreenshot)} 
                    alt="Payment screenshot preview"
                    className="max-w-full max-h-64 object-contain border rounded"
                  />
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    <span>Max file size: 5MB</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
