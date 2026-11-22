import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { Tokencontext } from '../../context/ChatContext';

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to /joinRoom when no token is present', () => {
    render(
      <Tokencontext.Provider value={{ token: null, setToken: () => {} }}>
        <MemoryRouter initialEntries={['/home']}>
          <Routes>
            <Route path="/joinRoom" element={<div>Sign In Screen</div>} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <div>Secret Chat Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Tokencontext.Provider>
    );

    // Should redirect and show the Sign In Screen
    expect(screen.getByText('Sign In Screen')).toBeInTheDocument();
    // Secret Dashboard must NOT be rendered
    expect(screen.queryByText('Secret Chat Dashboard')).not.toBeInTheDocument();
  });

  it('renders protected children when token exists in context', () => {
    render(
      <Tokencontext.Provider value={{ token: 'mock-valid-token-123', setToken: () => {} }}>
        <MemoryRouter initialEntries={['/home']}>
          <Routes>
            <Route path="/joinRoom" element={<div>Sign In Screen</div>} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <div>Secret Chat Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Tokencontext.Provider>
    );

    // Secret Dashboard MUST be rendered
    expect(screen.getByText('Secret Chat Dashboard')).toBeInTheDocument();
    // Sign In Screen must NOT be rendered
    expect(screen.queryByText('Sign In Screen')).not.toBeInTheDocument();
  });

  it('renders protected children when token is in localStorage', () => {
    localStorage.setItem('token', 'stored-token-abc');

    render(
      <Tokencontext.Provider value={{ token: null, setToken: () => {} }}>
        <MemoryRouter initialEntries={['/home']}>
          <Routes>
            <Route path="/joinRoom" element={<div>Sign In Screen</div>} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <div>Secret Chat Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Tokencontext.Provider>
    );

    // Secret Dashboard MUST be rendered
    expect(screen.getByText('Secret Chat Dashboard')).toBeInTheDocument();
  });
});
