import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginForm from '../LoginForm';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock da resposta da API
const mockLoginResponse = {
  user: {
    id: 1,
    name: "admin",
    email: "admin@admin.com",
    email_verified_at: null,
    remember_token: null,
    created_at: "2025-02-18T21:25:53.000000Z",
    updated_at: "2025-02-18T21:25:53.000000Z",
    role: "admin"
  },
  token: "1|KXmLn8nzX5mx9Kp5u2OpT2NwwVMX04Ak5zxWcF7o869df2cb"
};

describe('LoginForm', () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
    // Limpa o localStorage
    window.localStorage.clear();
  });

  it('deve realizar login com sucesso e redirecionar para dashboard', async () => {
    // Mock do fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLoginResponse),
      })
    ) as jest.Mock;

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    // Preenche os campos do formulário
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByText(/entrar/i);

    fireEvent.change(emailInput, { target: { value: 'admin@admin.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin1234' } });
    fireEvent.click(submitButton);

    // Verifica se a chamada à API foi feita corretamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@admin.com',
          password: 'admin1234',
        }),
      });
    });

    // Verifica se os dados foram salvos no localStorage
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockLoginResponse.token);
    });

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockLoginResponse.user));
    });

    // Verifica se houve redirecionamento para o dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve mostrar erro quando as credenciais são inválidas', async () => {
    // Mock do fetch com erro
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Credenciais inválidas' }),
      })
    ) as jest.Mock;

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    // Preenche os campos do formulário
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByText(/entrar/i);

    fireEvent.change(emailInput, { target: { value: 'admin@admin.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } });
    fireEvent.click(submitButton);

    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });
  });
}); 