import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProductGrid from "@/components/ProductGrid";
import HeroBanner from "@/components/HeroBanner";
import SeasonalBanner from "@/components/SeasonalBanner";
import CartSidebar from "@/components/CartSidebar";
import ProductDetailModal from "@/components/ProductDetailModal";
import CheckoutModal from "@/components/CheckoutModal";
import { Product } from "@/contexts/ProductContext";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const { user, isAdmin } = useAuth();

  const categories = [
    "All Products", "Cosmetics", "Clothes", "Kitchenware",
    "Electronics", "Home Decor", "Accessories", "Sports & Fitness", "Shoes"
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    setCheckoutProduct(product);
    setIsCheckoutModalOpen(true);
    setIsProductModalOpen(false);
  };

  const handleCartCheckout = () => {
    setCheckoutProduct(null);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">AN</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Al-Noor Collection</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
              {user ? (
                isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-orange-600 transition-colors">Admin</Link>
                )
              ) : (
                <Link to="/admin" className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors">
                  <LogIn className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <CartSidebar onCheckout={handleCartCheckout} />
            </nav>

            <div className="flex items-center space-x-3">
              <CartSidebar onCheckout={handleCartCheckout} />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4 space-y-2">
              <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Home</Link>
              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                <LogIn className="w-4 h-4" />
                Admin
              </Link>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto md:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-full border-2 border-orange-200 focus:border-orange-400"
            />
          </div>
        </div>
      </header>

      <HeroBanner />
      <SeasonalBanner />

      {/* Our Products Section */}
      <section id="products-section" className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              {selectedCategory === 'All Products' ? 'Our Products' : selectedCategory}
            </h2>
            <p className="text-gray-600 mb-8">
              Discover our carefully curated collection of premium products designed to brighten your everyday life.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                      : "border-orange-200 text-gray-700 hover:border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <ProductGrid
            searchQuery={searchTerm}
            selectedCategory={selectedCategory}
            onViewProduct={handleViewProduct}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-amber-200">© 2024 Al-Noor Collection. All rights reserved.</p>
        </div>
      </footer>

      <WhatsAppFloat />
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onBuyNow={handleBuyNow}
      />
      <CheckoutModal
        product={checkoutProduct}
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};

export default Index;
