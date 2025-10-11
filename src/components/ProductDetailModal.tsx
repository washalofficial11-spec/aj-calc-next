import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { Product } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onBuyNow
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    toast({
      title: "Added to Wishlist!",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.badge && (
              <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  ({product.rating}/5)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-orange-600">
                PKR {product.price}
              </span>
              {product.original_price && (
                <span className="text-lg text-gray-400 line-through">
                  PKR {product.original_price}
                </span>
              )}
            </div>

            {/* Category */}
            <div>
              <span className="text-sm font-semibold text-gray-600">Category: </span>
              <Badge variant="outline" className="ml-2">
                {product.category}
              </Badge>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600">Stock:</span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => onBuyNow(product)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="w-full"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={handleWishlist}
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
