import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex h-screen bg-pri-bg overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-marine-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-ocean-blue/20 rounded-full blur-[150px] pointer-events-none" />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
