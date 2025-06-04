import React, { useState } from 'react';
import { 
  LogOut, 
  Package, 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  Eye,
  EyeOff,
  Settings,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin, type ProductInsert, type ProductUpdate } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { state, login, logout, addProduct, updateProduct, deleteProduct, markOrderFulfilled, updateCurrency, handleImageUpload } = useAdmin();
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState<Partial<ProductInsert>>({
    name: '',
    price: 0,
    image_url: '',
    description: '',
    category: '',
    featured: false
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(loginPassword)) {
      toast.success('Login successful!');
      setLoginPassword('');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        toast.info('Uploading image...');
        const imageUrl = await handleImageUpload(file);
        
        if (isEdit && editingProduct) {
          setEditingProduct({ ...editingProduct, image_url: imageUrl });
          setEditImagePreview(imageUrl);
        } else {
          setNewProduct({ ...newProduct, image_url: imageUrl });
          setImagePreview(imageUrl);
        }
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image');
        console.error('Image upload error:', error);
      }
      setIsUploadingImage(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image_url || !newProduct.description || !newProduct.category) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addProduct(newProduct as ProductInsert);

      setNewProduct({
        name: '',
        price: 0,
        image_url: '',
        description: '',
        category: '',
        featured: false
      });
      setImagePreview('');

      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Add product error:', error);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updateData: ProductUpdate = {
        name: editingProduct.name,
        price: editingProduct.price,
        image_url: editingProduct.image_url,
        description: editingProduct.description,
        category: editingProduct.category,
        featured: editingProduct.featured
      };

      await updateProduct(editingProduct.id, updateData);

      setEditingProduct(null);
      setEditImagePreview('');
      toast.success('Product updated successfully!');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Update product error:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
        console.error('Delete product error:', error);
      }
    }
  };

  const handleMarkFulfilled = (orderId: string) => {
    markOrderFulfilled(orderId);
    toast.success('Order marked as fulfilled!');
  };

  const handleCurrencyChange = (currency: string) => {
    updateCurrency(currency);
    toast.success(`Currency updated to ${currency}`);
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                Login
              </Button>
              <p className="text-xs text-gray-600 text-center">
                Demo password: admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <Select value={state.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={logout} variant="outline">
              <LogOut className="mr-2" size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{state.products.length}</p>
                </div>
                <Package className="text-orange-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{state.orders.length}</p>
                </div>
                <ShoppingCart className="text-orange-500" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold">
                    {state.orders.filter(order => order.status === 'pending').length}
                  </p>
                </div>
                <Badge className="bg-yellow-500">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Orders</p>
                  <p className="text-2xl font-bold">
                    {state.orders.filter(order => order.isPaid).length}
                  </p>
                </div>
                <Badge className="bg-green-500">Paid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Products Management */}
          <Card className="animate-slide-in-right">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200">
                    <Plus className="mr-2" size={16} />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] sm:w-full animate-scale-in">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                    <form onSubmit={handleAddProduct} className="space-y-4 pb-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={newProduct.name || ''}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            required
                            className="transition-all duration-200 focus:scale-105"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price ({state.currency})</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newProduct.price || ''}
                            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                            required
                            className="transition-all duration-200 focus:scale-105"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="image">Product Image</Label>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image')?.click()}
                              disabled={isUploadingImage}
                              className="hover:scale-105 transition-all duration-200"
                            >
                              <Upload className="mr-2" size={16} />
                              {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                            </Button>
                            <span className="text-sm text-gray-500">or</span>
                            <Input
                              placeholder="Enter image URL"
                              value={newProduct.image_url || ''}
                              onChange={(e) => {
                                setNewProduct({...newProduct, image_url: e.target.value});
                                setImagePreview(e.target.value);
                              }}
                              className="flex-1 transition-all duration-200 focus:scale-105"
                            />
                          </div>
                          {imagePreview && (
                            <div className="border rounded-lg p-2 animate-fade-in">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-32 object-cover rounded transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category || ''}
                          onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                        >
                          <SelectTrigger className="transition-all duration-200 hover:scale-105">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="🧥 Clothing">🧥 Clothing</SelectItem>
                            <SelectItem value="👠 Footwear">👠 Footwear</SelectItem>
                            <SelectItem value="👜 Accessories">👜 Accessories</SelectItem>
                            <SelectItem value="👗 Occasions">👗 Occasions</SelectItem>
                            
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description || ''}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          rows={3}
                          required
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newProduct.featured || false}
                          onCheckedChange={(checked) => setNewProduct({...newProduct, featured: checked})}
                        />
                        <Label>Featured Product</Label>
                      </div>
                      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200">
                        Add Product
                      </Button>
                    </form>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.loading ? (
                  <p className="text-center text-gray-500 py-8">Loading products...</p>
                ) : state.products.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No products found. Add your first product!</p>
                ) : (
                  state.products.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-102 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image_url || ''} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded transition-transform duration-300 hover:scale-110"
                        />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-orange-500 font-semibold">{state.currency} {product.price}</p>
                          {product.featured && <Badge className="text-xs animate-pulse">Featured</Badge>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(product);
                                setEditImagePreview(product.image_url || '');
                              }}
                              className="hover:scale-110 transition-transform duration-200"
                            >
                              <Edit size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] sm:w-full animate-scale-in">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            {editingProduct && (
                              <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
                                <form onSubmit={handleUpdateProduct} className="space-y-4 pb-4">
                                  {/* Similar structure to add form but with edit functionality */}
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-name">Product Name</Label>
                                      <Input
                                        id="edit-name"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                        required
                                        className="transition-all duration-200 focus:scale-105"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-price">Price ({state.currency})</Label>
                                      <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                        required
                                        className="transition-all duration-200 focus:scale-105"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-image">Product Image</Label>
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-2">
                                        <Input
                                          id="edit-image-file"
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleImageChange(e, true)}
                                          className="hidden"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => document.getElementById('edit-image-file')?.click()}
                                          disabled={isUploadingImage}
                                          className="hover:scale-105 transition-all duration-200"
                                        >
                                          <Upload className="mr-2" size={16} />
                                          {isUploadingImage ? 'Uploading...' : 'Upload New Image'}
                                        </Button>
                                        <span className="text-sm text-gray-500">or</span>
                                        <Input
                                          placeholder="Enter image URL"
                                          value={editingProduct.image_url}
                                          onChange={(e) => {
                                            setEditingProduct({...editingProduct, image_url: e.target.value});
                                            setEditImagePreview(e.target.value);
                                          }}
                                          className="flex-1 transition-all duration-200 focus:scale-105"
                                        />
                                      </div>
                                      {editImagePreview && (
                                        <div className="border rounded-lg p-2 animate-fade-in">
                                          <img 
                                            src={editImagePreview} 
                                            alt="Preview" 
                                            className="w-full h-32 object-cover rounded transition-transform duration-300 hover:scale-105"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select
                                      value={editingProduct.category}
                                      onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                                    >
                                      <SelectTrigger className="transition-all duration-200 hover:scale-105">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Furniture">Furniture</SelectItem>
                                        <SelectItem value="Lighting">Lighting</SelectItem>
                                        <SelectItem value="Decor">Decor</SelectItem>
                                        <SelectItem value="Accessories">Accessories</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={editingProduct.description}
                                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                      rows={3}
                                      required
                                      className="transition-all duration-200 focus:scale-105"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={editingProduct.featured}
                                      onCheckedChange={(checked) => setEditingProduct({...editingProduct, featured: checked})}
                                    />
                                    <Label>Featured Product</Label>
                                  </div>
                                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-200">
                                    Update Product
                                  </Button>
                                </form>
                              </ScrollArea>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-600 hover:scale-110 transition-all duration-200"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders Management */}
          <Card className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 animate-fade-in">No orders yet</p>
                ) : (
                  state.orders.map((order, index) => (
                    <div key={order.id} className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-102 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerPhone}</p>
                          {order.customerEmail && (
                            <p className="text-sm text-gray-600">{order.customerEmail}</p>
                          )}
                          <p className="text-sm text-gray-600">{order.customerAddress}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={order.status === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}>
                            {order.status}
                          </Badge>
                          {order.isPaid && <Badge className="bg-blue-500 animate-pulse">Paid</Badge>}
                        </div>
                      </div>
                      <div className="text-sm space-y-1 mb-3">
                        {order.items.map((item, index) => (
                          <p key={index} className="text-gray-600">
                            {item.quantity}x {item.name} - {state.currency} {(item.price * item.quantity).toFixed(2)}
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-orange-500">
                            Total: {state.currency} {order.total.toFixed(2)}
                          </span>
                          {order.paymentReference && (
                            <p className="text-xs text-gray-500">Ref: {order.paymentReference}</p>
                          )}
                        </div>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkFulfilled(order.id)}
                            className="bg-green-500 hover:bg-green-600 hover:scale-105 transition-all duration-200"
                          >
                            <Check className="mr-1" size={14} />
                            Mark Fulfilled
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
