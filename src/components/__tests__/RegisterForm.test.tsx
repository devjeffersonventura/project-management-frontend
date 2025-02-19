/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../RegisterForm';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock da resposta da API
const mockRegisterResponse = {
  name: "Alexandre Pires",
  email: "alepds@admin.com",
  role: "user",
  updated_at: "2025-02-18T01:59:32.000000Z",
  created_at: "2025-02-18T01:59:32.000000Z",
  id: 2
};

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar usuário com sucesso e redirecionar para login', async () => {
    // Mock do fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRegisterResponse),
      })
    ) as jest.Mock;

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    // Preenche os campos do formulário
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    const submitButton = screen.getByText(/registrar/i);

    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
      throw new Error('Campos não encontrados');
    }

    fireEvent.change(nameInput, { target: { value: 'Alexandre Pires' } });
    fireEvent.change(emailInput, { target: { value: 'alepds@admin.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin1234' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'admin1234' } });
    fireEvent.click(submitButton);

    // Verifica se a chamada à API foi feita corretamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Alexandre Pires',
          email: 'alepds@admin.com',
          password: 'admin1234',
        }),
      });
    });

    // Verifica se houve redirecionamento para o login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('deve mostrar erro quando as senhas não coincidem', async () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
    
    // Preenche os campos com senhas diferentes
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
    const submitButton = screen.getByText(/registrar/i);

    fireEvent.change(nameInput, { target: { value: 'Alexandre Pires' } });
    fireEvent.change(emailInput, { target: { value: 'alepds@admin.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin1234' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'admin12345' } });
    fireEvent.click(submitButton);

    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    });
  });
}); 