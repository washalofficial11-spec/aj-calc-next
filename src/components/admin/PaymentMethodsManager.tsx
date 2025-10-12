import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentMethodsManager: React.FC = () => {
  const { toast } = useToast();
  
  const [paymentMethods, setPaymentMethods] = useState({
    cod: {
      enabled: true,
      name: 'Cash on Delivery'
    },
    bankTransfer: {
      enabled: true,
      name: 'Bank Transfer',
      accountName: 'Al-Noor Collection',
      accountNumber: '1234567890',
      bankName: 'Allied Bank',
      iban: 'PK12ABCD0000001234567890'
    },
    easypaisa: {
      enabled: true,
      name: 'Easypaisa',
      accountNumber: '0300-1234567'
    },
    jazzcash: {
      enabled: true,
      name: 'JazzCash',
      accountNumber: '0301-9876543'
    }
  });

  const handleToggle = (method: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        enabled: !prev[method as keyof typeof prev].enabled
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Payment methods have been updated successfully",
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage available payment methods for customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cash on Delivery */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Cash on Delivery</h3>
              <p className="text-sm text-gray-500">Accept cash payments upon delivery</p>
            </div>
            <Switch
              checked={paymentMethods.cod.enabled}
              onCheckedChange={() => handleToggle('cod')}
            />
          </div>

          {/* Bank Transfer */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Bank Transfer</h3>
                <p className="text-sm text-gray-500">Direct bank account transfer</p>
              </div>
              <Switch
                checked={paymentMethods.bankTransfer.enabled}
                onCheckedChange={() => handleToggle('bankTransfer')}
              />
            </div>
            
            {paymentMethods.bankTransfer.enabled && (
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    defaultValue={paymentMethods.bankTransfer.accountName}
                    placeholder="Account holder name"
                  />
                </div>
                <div>
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    defaultValue={paymentMethods.bankTransfer.bankName}
                    placeholder="Bank name"
                  />
                </div>
                <div>
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    defaultValue={paymentMethods.bankTransfer.accountNumber}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    defaultValue={paymentMethods.bankTransfer.iban}
                    placeholder="IBAN number"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Easypaisa */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Easypaisa</h3>
                <p className="text-sm text-gray-500">Mobile wallet payment</p>
              </div>
              <Switch
                checked={paymentMethods.easypaisa.enabled}
                onCheckedChange={() => handleToggle('easypaisa')}
              />
            </div>
            
            {paymentMethods.easypaisa.enabled && (
              <div className="pt-4 border-t">
                <Label htmlFor="easypaisa-number">Easypaisa Account Number</Label>
                <Input
                  id="easypaisa-number"
                  defaultValue={paymentMethods.easypaisa.accountNumber}
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            )}
          </div>

          {/* JazzCash */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">JazzCash</h3>
                <p className="text-sm text-gray-500">Mobile wallet payment</p>
              </div>
              <Switch
                checked={paymentMethods.jazzcash.enabled}
                onCheckedChange={() => handleToggle('jazzcash')}
              />
            </div>
            
            {paymentMethods.jazzcash.enabled && (
              <div className="pt-4 border-t">
                <Label htmlFor="jazzcash-number">JazzCash Account Number</Label>
                <Input
                  id="jazzcash-number"
                  defaultValue={paymentMethods.jazzcash.accountNumber}
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            )}
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Save Payment Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsManager;
