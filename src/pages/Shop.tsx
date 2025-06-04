
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAdmin } from '@/context/AdminContext';
import { useWishlist } from '@/context/WishlistContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Shop = () => {
  const { state, fetchProducts } = useAdmin();
  const { dispatch: wishlistDispatch, isInWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const allCategories = state.products.map(product => product.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [state.products]);

  const filteredProducts = useMemo(() => {
    let filtered = state.products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [state.products, searchQuery, selectedCategory, sortBy]);

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
      toast.success(`Removed ${product.name} from wishlist`);
    } else {
      wishlistDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          category: product.category
        }
      });
      toast.success(`Added ${product.name} to wishlist!`);
    }
  };

  if (state.loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6">Shop</h1>
          
          {/* Search and Filters */}
          <div className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-lg transition-all duration-300 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                        Featured
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 hover-scale group"
                    >
                      <Heart 
                        size={16} 
                        className={`transition-colors ${
                          isInWishlist(product.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-semibold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">(4.8)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-500">
                        {state.currency} {product.price}
                      </span>
                      <Link to={`/product/${product.id}`}>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 hover-scale">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
