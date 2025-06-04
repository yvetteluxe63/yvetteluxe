import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Wishlist = () => {
  const navigate = useNavigate();
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { state: adminState } = useAdmin();

  const handleRemoveFromWishlist = (id: string, name: string) => {
    removeFromWishlist(id);
    toast.success(`Removed ${name} from wishlist`);
  };

  const handleMoveToCart = (item: any) => {
    // Add to cart
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      quantity: 1
    });
    
    // Remove from wishlist
    removeFromWishlist(item.id);
    toast.success(`Moved ${item.name} to cart!`);
  };

  const handleClearWishlist = () => {
    wishlistState.items.forEach(item => removeFromWishlist(item.id));
    toast.success('Wishlist cleared');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-orange-500 hover:text-orange-600"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Heart size={32} className="mr-3 text-red-500 fill-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistState.items.length} item{wishlistState.items.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          
          {wishlistState.items.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearWishlist}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlistState.items.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Heart size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link to="/shop">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistState.items.map((item, index) => (
              <Card 
                key={item.id} 
                className="group hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group"
                    >
                      <Trash2 size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                    <h3 className="font-semibold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-500">
                        {adminState.currency} {item.price}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleMoveToCart(item)}
                      >
                        <ShoppingCart className="mr-2" size={16} />
                        Move to Cart
                      </Button>
                      
                      <Link to={`/product/${item.id}`} className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
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

export default Wishlist;
