// src/components/Layout.js (or Layout.tsx)
import React from 'react';
import { Toaster } from "./ui/toaster"; // Adjust the import path based on your structure

const Layout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
