import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface AuthTokens {
  access: string;
  refresh: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
  };
}

class AuthService {
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Check for existing tokens on initialization
    this.initializeAuth();
  }

  private initializeAuth() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (accessToken && refreshToken) {
      this.setupRefreshTimer();
      this.syncTabsAuth();
    }
  }

  private syncTabsAuth() {
    // Listen for storage events to sync auth across tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'auth_sync') {
          const data = e.newValue ? JSON.parse(e.newValue) : null;
          if (data) {
            if (data.type === 'login') {
              this.setTokens(data.tokens);
            } else if (data.type === 'logout') {
              this.clearTokens();
            }
          }
        }
      });
    }
  }

  private broadcastAuthChange(type: 'login' | 'logout', tokens?: AuthTokens) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_sync', JSON.stringify({
        type,
        tokens,
        timestamp: Date.now()
      }));
      // Clean up after broadcast
      setTimeout(() => localStorage.removeItem('auth_sync'), 100);
    }
  }

  async login(username: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/token/`, {
        username,
        password
      });

      const tokens: AuthTokens = {
        access: response.data.access,
        refresh: response.data.refresh
      };

      this.setTokens(tokens, rememberMe);
      this.setupRefreshTimer();
      this.broadcastAuthChange('login', tokens);

      // Get user details
      const userResponse = await this.getCurrentUser(tokens.access);
      
      return {
        ...tokens,
        user: userResponse
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    this.clearTokens();
    this.clearRefreshTimer();
    this.broadcastAuthChange('logout');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await axios.post(`${API_URL}/token/refresh/`, {
        refresh: refreshToken
      });

      const newAccessToken = response.data.access;
      this.setAccessToken(newAccessToken);
      this.setupRefreshTimer();
      
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return null;
    }
  }

  private setupRefreshTimer() {
    this.clearRefreshTimer();
    
    // Refresh token 5 minutes before expiry (55 minutes for 60-minute tokens)
    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken();
    }, 55 * 60 * 1000);
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private setTokens(tokens: AuthTokens, persistent: boolean = true) {
    const options = persistent ? { expires: 7 } : undefined; // 7 days for remember me
    
    // Store in cookies for HTTP-only security
    Cookies.set('access_token', tokens.access, options);
    Cookies.set('refresh_token', tokens.refresh, options);
    
    // Also store in localStorage for multi-tab sync
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  }

  private setAccessToken(token: string) {
    const expires = Cookies.get('refresh_token') ? 7 : undefined;
    Cookies.set('access_token', token, { expires });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  private clearTokens() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  getAccessToken(): string | null {
    return Cookies.get('access_token') || 
           (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  }

  getRefreshToken(): string | null {
    return Cookies.get('refresh_token') || 
           (typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async getCurrentUser(token?: string): Promise<any> {
    const accessToken = token || this.getAccessToken();
    
    if (!accessToken) {
      return null;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/user/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Setup axios interceptor for automatic token inclusion
  setupAxiosInterceptor() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const newToken = await this.refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();
export default authService;