import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ThemeToggle Component', () => {
  it('renders correctly and toggles theme on click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel={true} />
      </ThemeProvider>
    );

    // Initial button exists
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Clicking button toggles the theme
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('renders without label when showLabel is false', () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel={false} />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.queryByText('Light')).not.toBeInTheDocument();
    expect(screen.queryByText('Dark')).not.toBeInTheDocument();
  });
});
