const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
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

export const adminApiClient = {
  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error('API request failed');
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
    if (!response.ok) throw new Error('API request failed');
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
    if (!response.ok) throw new Error('API request failed');
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
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  // Mock data methods (will be replaced with real API calls)
  async getUsers(filters: { status?: string; plan?: string; search?: string } = {}): Promise<{ users: User[]; total: number }> {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'user@example.com',
        name: '张三',
        subscription: 'pro',
        status: 'active',
        createdAt: '2025-01-15',
        lastActiveAt: '2025-03-10',
        apiUsage: { limit: 10000, used: 3456 },
      },
      {
        id: '2',
        email: 'company@example.com',
        name: '李四',
        subscription: 'enterprise',
        status: 'active',
        createdAt: '2025-02-01',
        lastActiveAt: '2025-03-09',
        apiUsage: { limit: 100000, used: 45678 },
      },
      {
        id: '3',
        email: 'free@example.com',
        name: '王五',
        subscription: 'free',
        status: 'active',
        createdAt: '2025-03-01',
        lastActiveAt: '2025-03-10',
        apiUsage: { limit: 100, used: 45 },
      },
      {
        id: '4',
        email: 'suspended@example.com',
        name: '赵六',
        subscription: 'pro',
        status: 'suspended',
        createdAt: '2024-12-01',
        lastActiveAt: '2025-02-15',
        apiUsage: { limit: 10000, used: 8900 },
      },
    ];
    return { users: mockUsers, total: mockUsers.length };
  },

  async getSubscriptions(filters: { status?: string; plan?: string } = {}): Promise<{
    subscriptions: Subscription[];
    stats: {
      total: number;
      active: number;
      pro: number;
      enterprise: number;
      revenue: number;
    };
  }> {
    const mockSubscriptions: Subscription[] = [
      {
        id: 'sub_1',
        userId: '1',
        userEmail: 'user@example.com',
        plan: 'pro',
        status: 'active',
        amount: 299,
        currency: 'CNY',
        period: 'monthly',
        startDate: '2025-01-15',
        nextBillingDate: '2025-04-15',
      },
      {
        id: 'sub_2',
        userId: '2',
        userEmail: 'company@example.com',
        plan: 'enterprise',
        status: 'active',
        amount: 2999,
        currency: 'CNY',
        period: 'yearly',
        startDate: '2025-02-01',
        nextBillingDate: '2026-02-01',
      },
      {
        id: 'sub_3',
        userId: '4',
        userEmail: 'suspended@example.com',
        plan: 'pro',
        status: 'past_due',
        amount: 299,
        currency: 'CNY',
        period: 'monthly',
        startDate: '2024-12-01',
        nextBillingDate: '2025-03-01',
      },
    ];
    return {
      subscriptions: mockSubscriptions,
      stats: { total: 156, active: 142, pro: 98, enterprise: 44, revenue: 89500 },
    };
  },

  async getFinanceData(period: string = '30d'): Promise<FinanceData> {
    return {
      monthlyRevenue: [
        { month: '10月', revenue: 45000 },
        { month: '11月', revenue: 52000 },
        { month: '12月', revenue: 68000 },
        { month: '1月', revenue: 71000 },
        { month: '2月', revenue: 89000 },
        { month: '3月', revenue: 89500 },
      ],
      subscriptionTrend: [
        { month: '10月', count: 45 },
        { month: '11月', count: 62 },
        { month: '12月', count: 89 },
        { month: '1月', count: 112 },
        { month: '2月', count: 134 },
        { month: '3月', count: 142 },
      ],
      paymentMethods: [
        { method: '支付宝', count: 68, percentage: 48 },
        { method: '微信支付', count: 56, percentage: 40 },
        { method: '信用卡', count: 18, percentage: 12 },
      ],
      totalRevenue: 89500,
      revenueGrowth: 12.5,
      activeSubscriptions: 142,
      subscriptionGrowth: 8.3,
    };
  },

  async getAnalyticsData(): Promise<AnalyticsData> {
    return {
      totalUsers: 2845,
      userGrowth: 18.5,
      activeUsers: 1234,
      averageApiCalls: 234,
      apiCallsGrowth: 25.3,
      topMarkets: [
        { market: '东南亚', users: 892, growth: 22.5 },
        { market: '欧盟', users: 567, growth: 15.8 },
        { market: '拉美', users: 445, growth: 32.1 },
        { market: '中东', users: 234, growth: 18.2 },
      ],
      topCategories: [
        { category: '电子产品', views: 12450, growth: 28.5 },
        { category: '美妆个护', views: 8934, growth: 19.2 },
        { category: '家居用品', views: 6789, growth: 15.6 },
        { category: '户外用品', views: 5432, growth: 22.8 },
      ],
    };
  },
};
