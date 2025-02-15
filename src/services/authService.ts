interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const authService = {
  async login({ email, password }: LoginCredentials) {
    // Implementar chamada à API de login
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());
  },

  async register({ email, password, name }: RegisterCredentials) {
    // Implementar chamada à API de registro
    return fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    }).then(res => res.json());
  },

  logout() {
    // Implementar logout
    localStorage.removeItem('token');
  }
}; 