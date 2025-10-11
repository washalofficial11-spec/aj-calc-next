import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  BarChart3,
  Package,
  Upload,
  ShoppingBag,
  LogOut,
  Shield,
  TrendingUp,
  DollarSign,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProducts, Product } from '@/contexts/ProductContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminPassword') === 'admin123'
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    original_price: '',
    image: '',
    badge: '',
    rating: 0,
    stock: 0,
    description: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const handleLogin = () => {
    if (passwordInput === 'admin123') {
      localStorage.setItem('adminPassword', 'admin123');
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to Admin Panel",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleProductFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = () => {
    addProduct({
      ...productForm,
      rating: Number(productForm.rating),
      stock: Number(productForm.stock)
    });
    toast({
      title: "Product Added",
      description: `${productForm.name} has been added successfully.`,
    });
    resetForm();
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        rating: Number(productForm.rating),
        stock: Number(productForm.stock)
      });
      toast({
        title: "Product Updated",
        description: `${productForm.name} has been updated successfully.`,
      });
      resetForm();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.original_price || '',
      image: product.image,
      badge: product.badge || '',
      rating: product.rating || 0,
      stock: product.stock || 0,
      description: product.description || ''
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    toast({
      title: "Product Deleted",
      description: "Product has been removed successfully.",
    });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: '',
      price: '',
      original_price: '',
      image: '',
      badge: '',
      rating: 0,
      stock: 0,
      description: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-orange-600" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <p className="text-xs text-center text-gray-500">
              Demo password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + parseFloat(p.price.replace(/,/g, '')) * (p.stock || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">AN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Al-Noor Collection</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                View Store
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-gray-500">Active products</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalStock}</div>
                  <p className="text-xs text-gray-500">Items in stock</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">PKR {totalValue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">Inventory value</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductFormChange}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={productForm.category}
                      onChange={handleProductFormChange}
                      placeholder="e.g., Cosmetics, Clothes"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (PKR)</Label>
                    <Input
                      id="price"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      placeholder="2,500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_price">Original Price (Optional)</Label>
                    <Input
                      id="original_price"
                      name="original_price"
                      value={productForm.original_price}
                      onChange={handleProductFormChange}
                      placeholder="3,500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={productForm.image}
                    onChange={handleProductFormChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="badge">Badge (Optional)</Label>
                    <Input
                      id="badge"
                      name="badge"
                      value={productForm.badge}
                      onChange={handleProductFormChange}
                      placeholder="New, Sale, Featured"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={productForm.rating}
                      onChange={handleProductFormChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={handleProductFormChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  {editingProduct && (
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>PKR {product.price}</TableCell>
                        <TableCell>{product.stock || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  No orders yet. Orders will appear here when customers place them.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
