import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../pages/frontend/Header';
import Footer from '../../pages/frontend/Footer';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;