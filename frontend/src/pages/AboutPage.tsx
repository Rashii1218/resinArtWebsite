
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2">Our Story</h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl">
            Welcome to Resin Artisan, where creativity meets craftsmanship in our unique handmade resin products.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Handmade with Love</h2>
              <p className="mb-4 text-muted-foreground">
                Every piece in our collection is carefully handcrafted in our small studio. We take pride in creating unique, high-quality resin art that brings beauty and joy to your everyday life.
              </p>
              <p className="mb-4 text-muted-foreground">
                Our journey began in 2018 when our founder discovered the versatility and beauty of resin as an artistic medium. What started as a hobby quickly grew into a passion for creating functional art that can be cherished for years to come.
              </p>
              <p className="text-muted-foreground">
                We source the highest quality materials and use eco-friendly practices whenever possible, ensuring that our creations are not only beautiful but also responsibly made.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04" 
                alt="Artisan at work" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-accent p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To create beautiful, functional art that brings a touch of handmade creativity to everyday life while supporting sustainable practices.
              </p>
            </div>
            <div className="bg-accent p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Our Values</h3>
              <p className="text-muted-foreground">
                Quality craftsmanship, environmental responsibility, and artistic innovation guide everything we create.
              </p>
            </div>
            <div className="bg-accent p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Our Promise</h3>
              <p className="text-muted-foreground">
                Every item you purchase is made with attention to detail and care, ensuring you receive a unique piece of art.
              </p>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold mb-4">Meet the Artist</h2>
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
                alt="Artisan portrait" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold">Sarah Johnson</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              With a background in fine arts and a passion for creating functional artwork, Sarah has been creating resin pieces for over 5 years. Each creation is infused with her unique artistic vision and meticulous attention to detail.
            </p>
          </div>
          
          <div className="bg-muted p-12 text-center rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to add some handcrafted beauty to your life?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Browse our collection of unique resin art pieces and find something that speaks to you.
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">Shop Our Collection</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
