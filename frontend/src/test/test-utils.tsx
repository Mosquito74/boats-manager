import type {ReactNode} from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { render, type RenderOptions } from '@testing-library/react';
import darkTheme from '../theme';

interface ProvidersProps { children: ReactNode }

function Providers({ children }: ProvidersProps) {
  return (
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
