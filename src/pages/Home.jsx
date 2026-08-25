import React from 'react';
import Layout from "../components/layout/Layout";
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import OfferBanner from "../components/home/OfferBanner";
import NewsletterSection from "../components/home/NewsletterSection";

function Home() {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <OfferBanner />
      <NewsletterSection />
    </Layout>
  );
}

export default Home;