'use client';
import React, { createContext, useContext } from 'react';

const DashboardContext = createContext<{ isCollapsed: boolean }>({ isCollapsed: false });

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children, isCollapsed }: { children: React.ReactNode, isCollapsed: boolean }) => (
  <DashboardContext.Provider value={{ isCollapsed }}>
    {children}
  </DashboardContext.Provider>
);
