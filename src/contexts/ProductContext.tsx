import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  original_price?: string;
  image: string;
  badge?: string;
  rating?: number;
  stock?: number;
  buy_now_link?: string;
  buy_now_text?: string;
  sku?: string;
  color?: string;
  size?: string;
  delivery_charges?: number;
  video_url?: string;
  social_media_link?: string;
  description?: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Premium Face Cream",
    category: "Cosmetics",
    price: "2,500",
    original_price: "3,500",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    badge: "Best Seller",
    rating: 4.8,
    stock: 50,
    description: "Luxurious moisturizing face cream for radiant skin"
  },
  {
    id: 2,
    name: "Designer Kurta",
    category: "Clothes",
    price: "4,500",
    original_price: "6,000",
    image: "https://images.unsplash.com/photo-1583391733981-b48d80a28438?w=400&h=400&fit=crop",
    badge: "New",
    rating: 4.5,
    stock: 30,
    description: "Elegant designer kurta with premium fabric"
  },
  {
    id: 3,
    name: "Stainless Steel Cookware Set",
    category: "Kitchenware",
    price: "8,999",
    original_price: "12,000",
    image: "https://images.unsplash.com/photo-1584990347449-85f72e43a2ed?w=400&h=400&fit=crop",
    badge: "Sale",
    rating: 4.7,
    stock: 20,
    description: "Complete 12-piece cookware set for your kitchen"
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: "3,999",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    rating: 4.6,
    stock: 100,
    description: "High-quality wireless earbuds with noise cancellation"
  },
  {
    id: 5,
    name: "Decorative Wall Art",
    category: "Home Decor",
    price: "2,200",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop",
    badge: "Featured",
    rating: 4.4,
    stock: 15,
    description: "Beautiful wall art to enhance your living space"
  },
  {
    id: 6,
    name: "Leather Handbag",
    category: "Accessories",
    price: "5,500",
    original_price: "7,500",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    rating: 4.9,
    stock: 25,
    description: "Premium leather handbag with multiple compartments"
  }
];

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading] = useState(false);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
