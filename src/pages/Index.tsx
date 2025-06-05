
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones, CheckCircle, DollarSign, Clock, Award, Quote, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const { state } = useAdmin();
  const featuredProducts = state.products.filter(product => product.featured).slice(0, 3);

  const heroImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80'
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const testimonialPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const testimonials = [
    {
      id: 1,
      name: "Sarah Asante",
      initials: "SA",
      text: "Amazing products and lightning-fast delivery! I ordered on Monday and received my items on Tuesday. The quality exceeded my expectations.",
      rating: 5,
      color: "orange"
    },
    {
      id: 2,
      name: "Kwame Adjei",
      initials: "KA",
      text: "Excellent customer service and great prices! The WhatsApp support is super helpful and they respond instantly. Highly recommended!",
      rating: 5,
      color: "blue"
    },
    {
      id: 3,
      name: "Ama Osei",
      initials: "AO",
      text: "I've been shopping here for months and I'm always impressed. The mobile money payment is so convenient and secure. Love this store!",
      rating: 5,
      color: "green"
    },

    {
      id: 4,
      name: "Maa Ansah",
      initials: "MA",
      text: "I've been shopping here for months and I'm always impressed. The mobile money payment is so convenient and secure. Love this store!",
      rating: 5,
      color: "green"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <Carousel
            plugins={[plugin.current]}
            className="w-full h-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="h-full">
              {heroImages.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative h-full">
                    <img
                      src={image}
                      alt={`Hero slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          
          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
                Welcome to Yvette Luxe
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in">
                Discover amazing products curated just for you
              </p>
              <Link to="/shop">
                <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 animate-fade-in">
                  Shop Now
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4 animate-slide-in-down">Featured Products</h2>
              <p className="text-gray-600 animate-slide-in-up">Handpicked items just for you</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-500 hover:scale-105 card-hover animate-scale-in" style={{animationDelay: `${index * 0.2}s`}}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image_url || '/placeholder.svg'} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse-slow group-hover:animate-bounce">
                        Featured
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-orange-500 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-125" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-500 animate-glow">
                          {state.currency} {product.price}
                        </span>
                        <Link to={`/product/${product.id}`}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 btn-hover-lift transition-all duration-300 hover:scale-110">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8 animate-bounce-in">
              <Link to="/shop">
                <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-50 btn-hover-lift transition-all duration-300 hover:scale-105 animate-glow">
                  View All Products
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        
        <div className=""></div>{/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group animate-fade-in stagger-1">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110 animate-float">
                  <Truck className="text-orange-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors duration-300">Free Delivery</h3>
                <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">Free shipping on orders over Ghs500</p>
              </div>
              <div className="text-center group animate-fade-in stagger-2">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110 animate-float" style={{animationDelay: '1s'}}>
                  <Shield className="text-orange-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors duration-300">Secure Payment</h3>
                <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">100% secure mobile money payments</p>
              </div>
              <div className="text-center group animate-fade-in stagger-3">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110 animate-float" style={{animationDelay: '2s'}}>
                  <Headphones className="text-orange-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors duration-300">24/7 Support</h3>
                <p className="text-gray-600 transition-all duration-300 group-hover:text-gray-800">Always here to help you</p>
              </div>
            </div>
          </div>
        </section>

        

        {/* Why Shop With Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Why Shop With Us?</h2>
              <p className="text-gray-600">We're committed to providing you with the best shopping experience</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center group animate-fade-in stagger-1">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 animate-float">
                  <DollarSign className="text-blue-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-500 transition-colors duration-300">Affordable Prices</h3>
                <p className="text-gray-600 text-sm">Best prices guaranteed with regular discounts and special offers</p>
              </div>
              <div className="text-center group animate-fade-in stagger-2">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110 animate-float" style={{animationDelay: '1s'}}>
                  <Clock className="text-green-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-green-500 transition-colors duration-300">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Quick and reliable delivery to your doorstep within 24-48 hours</p>
              </div>
              <div className="text-center group animate-fade-in stagger-3">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110 animate-float" style={{animationDelay: '2s'}}>
                  <Award className="text-purple-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 transition-colors duration-300">Quality Products</h3>
                <p className="text-gray-600 text-sm">Carefully curated products that meet the highest quality standards</p>
              </div>
              <div className="text-center group animate-fade-in stagger-4">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-all duration-300 group-hover:scale-110 animate-float" style={{animationDelay: '3s'}}>
                  <CheckCircle className="text-red-500 transition-transform duration-300 group-hover:scale-110" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-red-500 transition-colors duration-300">Secure Payments</h3>
                <p className="text-gray-600 text-sm">Safe and secure payment processing with multiple payment options</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600">Don't just take our word for it - hear from our happy customers</p>
            </div>
            
            <Carousel
              plugins={[testimonialPlugin.current]}
              className="w-full max-w-5xl mx-auto"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center mb-4">
                          <Quote className="text-orange-500 mr-2" size={20} />
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 italic flex-grow">
                          "{testimonial.text}"
                        </p>
                        <div className="flex items-center mt-auto">
                          <div className={`w-10 h-10 bg-${testimonial.color}-100 rounded-full flex items-center justify-center mr-3`}>
                            <span className={`text-${testimonial.color}-500 font-semibold`}>{testimonial.initials}</span>
                          </div>
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">Verified Customer</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-500 text-white animate-slide-in-up">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 animate-bounce-in">Ready to Start Shopping?</h2>
            <p className="text-lg mb-8 opacity-90 animate-fade-in-slow">
              Join thousands of happy customers who love our products
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 btn-hover-lift transition-all duration-300 hover:scale-110 animate-wiggle">
                Browse Products
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </Button>
            </Link>
          </div>
        </section>

        
      </div>
    </Layout>
  );
};

export default Index;
