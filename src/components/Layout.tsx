
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { state } = useCart();
  const { state: authState, signOut } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/shop', label: 'Shop', icon: Search },
    { path: '/cart', label: 'Cart', icon: ShoppingCart },
    { path: '/contact', label: 'Contact', icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const UserProfile = () => {
    if (!authState.user) {
      return (
        <Link to="/auth">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
      );
    }

    const initials = authState.profile?.full_name 
      ? authState.profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : authState.user.email?.[0].toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authState.profile?.avatar_url || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">
              {authState.profile?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {authState.user.email}
            </p>
          </div>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 text-xs transition-colors ${
                isActive 
                  ? 'text-orange-500' 
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.path === '/cart' && state.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.length}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const DesktopNav = () => (
    <header className="hidden md:block bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-500">
            Yvette Luxe.
          </Link>
          <nav className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-colors relative ${
                      isActive 
                        ? 'text-orange-500' 
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                  >
                    {item.label}
                    {item.path === '/cart' && state.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {state.items.length}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <UserProfile />
          </nav>
        </div>
      </div>
    </header>
  );

  const MobileHeader = () => (
    <header className="md:hidden bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-500">
          Yvette Luxe.
        </Link>
        <div className="flex items-center space-x-2">
          <UserProfile />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-orange-500"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopNav />
      <MobileHeader />
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
