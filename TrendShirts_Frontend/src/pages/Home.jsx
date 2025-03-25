import React from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { NewArrivals } from '../components/home/NewArrivals';
import { BrandStory } from '../components/home/BrandStory';
import { InstagramFeed } from '../components/home/InstagramFeed';
import { Newsletter } from '../components/home/Newsletter';

export const Home = () => {
  return (
    <main>
      <Hero />
      <NewArrivals />
      <FeaturedProducts />
      <BrandStory />
      <InstagramFeed />
      <Newsletter />
    </main>
  );
};