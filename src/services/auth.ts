const API_URL = 'http://localhost:8081/api/auth';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    nickname: string;
    profileImage: string | null;
    createdAt: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  profileImage: string | null;
  createdAt: string;
}

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '회원가입에 실패했습니다');
    }

    const authResult: AuthResponse = result;
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    return authResult;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '로그인에 실패했습니다');
    }

    const authResult: AuthResponse = result;
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    return authResult;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: getHeaders(),
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/me`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다');
    }

    return response.json();
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('사용자 목록을 가져오는데 실패했습니다');
    }

    return response.json();
  },

  async checkUserExists(username: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/exists?username=${encodeURIComponent(username)}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.exists;
  },
};
