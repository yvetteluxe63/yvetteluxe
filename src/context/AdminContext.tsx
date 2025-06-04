
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  paymentMethod: string;
  momoNumber?: string;
  network?: string;
  paymentReference?: string;
  isPaid?: boolean;
  status: 'pending' | 'fulfilled';
  createdAt: string;
}

interface AdminState {
  products: Product[];
  orders: Order[];
  isAuthenticated: boolean;
  currency: string;
  loading: boolean;
}

interface AdminContextType {
  state: AdminState;
  login: (password: string) => boolean;
  logout: () => void;
  addProduct: (product: ProductInsert) => Promise<void>;
  updateProduct: (id: string, product: ProductUpdate) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  markOrderFulfilled: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateCurrency: (currency: string) => void;
  handleImageUpload: (file: File) => Promise<string>;
  fetchProducts: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    products: [],
    orders: [],
    isAuthenticated: false,
    currency: 'GHS',
    loading: false
  });

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedCurrency = localStorage.getItem('currency');
    
    setState(prev => ({
      ...prev,
      orders: savedOrders ? JSON.parse(savedOrders) : [],
      isAuthenticated: localStorage.getItem('adminAuth') === 'true',
      currency: savedCurrency || 'GHS'
    }));

    // Fetch products from Supabase on load
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem('currency', state.currency);
  }, [state.currency]);

  const fetchProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      setState(prev => ({ ...prev, products: data || [] }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading image to Supabase Storage...', { fileName, filePath });

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully, public URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      throw error;
    }
  };

  const login = (password: string): boolean => {
    if (password === 'admin123') {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false }));
    localStorage.removeItem('adminAuth');
  };

  const addProduct = async (product: ProductInsert) => {
    try {
      console.log('Adding product to Supabase:', product);
      
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Product added successfully:', data);
      // Refresh products after adding
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedProduct: ProductUpdate) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id);

      if (error) throw error;

      // Refresh products after updating
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh products after deleting
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const markOrderFulfilled = (id: string) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === id ? { ...order, status: 'fulfilled' } : order
      )
    }));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setState(prev => ({ ...prev, orders: [...prev.orders, newOrder] }));
  };

  const updateCurrency = (currency: string) => {
    setState(prev => ({ ...prev, currency }));
  };

  return (
    <AdminContext.Provider value={{
      state,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      markOrderFulfilled,
      addOrder,
      updateCurrency,
      handleImageUpload,
      fetchProducts
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
