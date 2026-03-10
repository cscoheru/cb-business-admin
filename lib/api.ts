const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============ Types ============
export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: string;
  lastActiveAt: string;
  apiUsage: {
    limit: number;
    used: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  plan: 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  amount: number;
  currency: string;
  period: 'monthly' | 'yearly';
  startDate: string;
  nextBillingDate: string;
}

export interface FinanceData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  subscriptionTrend: Array<{ month: string; count: number }>;
  paymentMethods: Array<{ method: string; count: number; percentage: number }>;
  totalRevenue: number;
  revenueGrowth: number;
  activeSubscriptions: number;
  subscriptionGrowth: number;
}

export interface AnalyticsData {
  totalUsers: number;
  userGrowth: number;
  activeUsers: number;
  averageApiCalls: number;
  apiCallsGrowth: number;
  topMarkets: Array<{ market: string; users: number; growth: number }>;
  topCategories: Array<{ category: string; views: number; growth: number }>;
}

// ============ API Client ============
export const adminApiClient = {
  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(error.detail || 'API request failed');
    }
    return response.json();
  },

  async post(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(error.detail || 'API request failed');
    }
    return response.json();
  },

  async put(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(error.detail || 'API request failed');
    }
    return response.json();
  },

  async delete(endpoint: string, token?: string) {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'API request failed' }));
      throw new Error(error.detail || 'API request failed');
    }
    return response.json();
  },

  // ============ Token Management ============
  getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  },

  setAdminToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('admin_token', token);
  },

  removeAdminToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('admin_token');
  },

  // ============ Auth API ============
  async login(email: string, password: string): Promise<{ access_token: string; user: any }> {
    const response = await this.post('/api/v1/auth/login', { email, password });
    if (response.access_token) {
      this.setAdminToken(response.access_token);
    }
    return response;
  },

  async logout(): void {
    this.removeAdminToken();
  },

  // ============ Admin Data API ============
  async getUsers(filters: { status?: string; plan_tier?: string; search?: string } = {}): Promise<{ users: User[]; total: number }> {
    const token = this.getAdminToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await this.post('/api/v1/admin/users', filters, token);
    return response;
  },

  async getSubscriptions(filters: { status?: string; plan_tier?: string } = {}): Promise<{
    subscriptions: Subscription[];
    stats: {
      total: number;
      active: number;
      pro: number;
      enterprise: number;
      revenue: number;
    };
  }> {
    const token = this.getAdminToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await this.post('/api/v1/admin/subscriptions', filters, token);
    return response;
  },

  async getFinanceData(period: string = '30d'): Promise<FinanceData> {
    const token = this.getAdminToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await this.get(`/api/v1/admin/finance?period=${period}`, token);
    return response;
  },

  async getAnalyticsData(): Promise<AnalyticsData> {
    const token = this.getAdminToken();
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await this.get('/api/v1/admin/analytics', token);
    return response;
  },
};
