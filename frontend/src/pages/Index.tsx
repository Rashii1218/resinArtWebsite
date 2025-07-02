
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <FeaturedProducts />
        <CategorySection />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
