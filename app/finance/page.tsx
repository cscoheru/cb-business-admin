'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminApiClient, FinanceData } from '@/lib/api';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Calendar, Download, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FinancePage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    loadFinanceData();
  }, [period]);

  async function loadFinanceData() {
    setLoading(true);
    try {
      const financeData = await adminApiClient.getFinanceData(period);
      setData(financeData);
    } catch (error) {
      console.error('Failed to load finance data:', error);
    } finally {
      setLoading(false);
    }
  }

  const maxRevenue = data?.monthlyRevenue.reduce((max, item) => Math.max(max, item.revenue), 0) || 0;
  const maxSubscriptions = data?.subscriptionTrend.reduce((max, item) => Math.max(max, item.count), 0) || 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">财务报表</h1>
          <p className="text-muted-foreground mt-1">查看平台收入和财务数据</p>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="365d">最近一年</option>
          </select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            导出报表
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              +{data?.revenueGrowth}%
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-1">¥{data?.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">总收入</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              +{data?.subscriptionGrowth}%
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{data?.activeSubscriptions}</div>
          <div className="text-sm text-muted-foreground">活跃订阅</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="secondary">ARPU</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">¥{data && Math.round(data.totalRevenue / data.activeSubscriptions)}</div>
          <div className="text-sm text-muted-foreground">每用户平均收入</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="secondary">MRR</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">¥{data?.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">月度经常性收入</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">月度收入趋势</h3>
          <div className="space-y-4">
            {data?.monthlyRevenue.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-medium">¥{item.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subscription Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">订阅增长趋势</h3>
          <div className="space-y-4">
            {data?.subscriptionTrend.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-medium">{item.count} 个订阅</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${(item.count / maxSubscriptions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">支付方式分布</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {data?.paymentMethods.map((method) => (
            <Card key={method.method} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">{method.method}</div>
                  <div className="text-2xl font-bold mt-1">{method.count} 笔</div>
                </div>
                <Badge variant="secondary">{method.percentage}%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${method.percentage}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">最近交易</h3>
          <Button size="sm" variant="outline">
            查看全部
          </Button>
        </div>
        <div className="space-y-4">
          {[
            { id: 'TXN001', user: 'user@example.com', amount: 299, status: 'success', time: '2小时前' },
            { id: 'TXN002', user: 'company@example.com', amount: 2999, status: 'success', time: '5小时前' },
            { id: 'TXN003', user: 'new@example.com', amount: 299, status: 'pending', time: '1天前' },
            { id: 'TXN004', user: 'old@example.com', amount: 299, status: 'failed', time: '2天前' },
          ].map((txn) => (
            <div key={txn.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{txn.user}</div>
                  <div className="text-sm text-muted-foreground">{txn.id} · {txn.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">¥{txn.amount}</div>
                  <Badge
                    variant={
                      txn.status === 'success' ? 'default' :
                      txn.status === 'pending' ? 'secondary' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {txn.status === 'success' ? '成功' : txn.status === 'pending' ? '处理中' : '失败'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
