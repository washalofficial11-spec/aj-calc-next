import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { Product } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

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
    paymentMethod: 'cash_on_delivery'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();

  const checkoutItems = product ? [{ ...product, quantity: 1 }] : items;
  const totalAmount = product 
    ? parseFloat(product.price.replace(/,/g, ''))
    : getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Order Placed Successfully!",
      description: "We'll contact you shortly to confirm your order.",
    });

    if (!product) {
      clearCart();
    }

    setIsSubmitting(false);
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      notes: '',
      paymentMethod: 'cash_on_delivery'
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="cash_on_delivery" id="cod" />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  Cash on Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="bank_transfer" id="bank" />
                <Label htmlFor="bank" className="flex-1 cursor-pointer">
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>

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
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
