import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts, Product } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory?: string;
  onViewProduct?: (product: Product) => void;
}

const ProductGrid = ({ searchQuery, selectedCategory = 'All Products', onViewProduct }: ProductGridProps) => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [visibleProducts, setVisibleProducts] = useState(6);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory && selectedCategory !== 'All Products') {
      filtered = filtered.filter(product =>
        product.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const loadMore = () => {
    setVisibleProducts(prev => prev + 6);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              {product.badge && (
                <Badge className="absolute top-2 left-2 bg-primary">{product.badge}</Badge>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onViewProduct?.(product)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-primary">Rs. {product.price}</span>
                {product.original_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    Rs. {product.original_price}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.stock} in stock)</span>
                </div>
              )}
              <Button 
                className="w-full" 
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleProducts < filteredProducts.length && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
