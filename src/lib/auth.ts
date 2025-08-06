import { AuthUser, LoginRequest } from '@/types';

// Mock user data
const MOCK_USER: AuthUser = {
  id: 'user-001',
  email: 'test@contoso.com',
  firstName: 'テスト',
  lastName: 'ユーザー',
  phone: '090-1234-5678',
};

// Mock login credentials
const VALID_CREDENTIALS = {
  email: 'test@contoso.com',
  password: 'hogehoge',
};

interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function mockLogin(credentials: LoginRequest): Promise<LoginResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate credentials
  if (credentials.email !== VALID_CREDENTIALS.email) {
    return {
      success: false,
      error: 'メールアドレスが正しくありません',
    };
  }

  if (credentials.password !== VALID_CREDENTIALS.password) {
    return {
      success: false,
      error: 'パスワードが正しくありません',
    };
  }

  return {
    success: true,
    user: MOCK_USER,
  };
}

export function validateSession(user: AuthUser): boolean {
  // For this mock implementation, we'll always consider sessions valid
  // In a real application, you might check token expiration, etc.
  return user && user.id === MOCK_USER.id;
}

export function getValidCredentials() {
  return VALID_CREDENTIALS;
}