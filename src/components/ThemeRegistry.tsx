'use client';
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#db3b2b',
    },
    background: {
      default: '#f6f7f9',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'var(--font-outfit), sans-serif' },
    h2: { fontFamily: 'var(--font-outfit), sans-serif' },
    h3: { fontFamily: 'var(--font-outfit), sans-serif' },
    h4: { fontFamily: 'var(--font-outfit), sans-serif' },
    h5: { fontFamily: 'var(--font-outfit), sans-serif' },
    h6: { fontFamily: 'var(--font-outfit), sans-serif' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
