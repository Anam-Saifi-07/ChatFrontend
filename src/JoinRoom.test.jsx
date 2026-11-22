import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import JoinRoom from './JoinRoom';
import { UserContextProvider, TokenProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

describe('JoinRoom (Login) Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderJoinRoom = () => {
    return render(
      <ThemeProvider>
        <TokenProvider>
          <UserContextProvider>
            <MemoryRouter>
              <JoinRoom />
            </MemoryRouter>
          </UserContextProvider>
        </TokenProvider>
      </ThemeProvider>
    );
  };

  it('renders all login inputs and actions', () => {
    renderJoinRoom();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('allows typing into username, email, and password fields', () => {
    renderJoinRoom();

    const usernameInput = screen.getByPlaceholderText('e.g. John Doe');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(usernameInput, { target: { value: 'Alex' } });
    fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    expect(usernameInput.value).toBe('Alex');
    expect(emailInput.value).toBe('alex@example.com');
    expect(passwordInput.value).toBe('secret123');
  });
});
