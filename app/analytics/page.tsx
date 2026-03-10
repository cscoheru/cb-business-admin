'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminApiClient, AnalyticsData } from '@/lib/api';
import { TrendingUp, Users, Activity, Zap, Globe, ShoppingBag, Calendar, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const analyticsData = await adminApiClient.getAnalyticsData();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

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
          <h1 className="text-3xl font-bold">数据分析</h1>
          <p className="text-muted-foreground mt-1">查看平台运营数据和用户行为</p>
        </div>
        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2">
            <option>最近7天</option>
            <option selected>最近30天</option>
            <option>最近90天</option>
          </select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="outline" className="gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              +{data?.userGrowth}%
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{data?.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">总用户数</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <Badge variant="secondary">MAU</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{data?.activeUsers.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">活跃用户</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="outline" className="gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              +{data?.apiCallsGrowth}%
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{data?.averageApiCalls}</div>
          <div className="text-sm text-muted-foreground">平均API调用/用户</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="secondary">留存率</Badge>
          </div>
          <div className="text-3xl font-bold mb-1">68.5%</div>
          <div className="text-sm text-muted-foreground">30天留存率</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Top Markets */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">热门市场</h3>
          <div className="space-y-4">
            {data?.topMarkets.map((market, index) => (
              <div key={market.market} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{market.market}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{market.users.toLocaleString()} 用户</span>
                      <Badge variant="outline" className="text-green-600">
                        +{market.growth}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(market.users / (data?.topMarkets[0]?.users || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Categories */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">热门品类</h3>
          <div className="space-y-4">
            {data?.topCategories.map((category, index) => (
              <div key={category.category} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center font-semibold text-purple-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.views.toLocaleString()} 浏览</span>
                      <Badge variant="outline" className="text-green-600">
                        +{category.growth}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${(category.views / (data?.topCategories[0]?.views || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Growth Trend */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">用户增长趋势</h3>
        <div className="grid md:grid-cols-6 gap-4">
          {[
            { month: '10月', users: 1245, new: 145 },
            { month: '11月', users: 1567, new: 322 },
            { month: '12月', users: 1989, new: 422 },
            { month: '1月', users: 2345, new: 356 },
            { month: '2月', users: 2567, new: 222 },
            { month: '3月', users: 2845, new: 278 },
          ].map((item) => (
            <Card key={item.month} className="p-4">
              <div className="text-sm text-muted-foreground mb-2">{item.month}</div>
              <div className="text-2xl font-bold mb-1">{item.users.toLocaleString()}</div>
              <div className="text-xs text-green-600">+{item.new} 新增</div>
            </Card>
          ))}
        </div>
      </Card>

      {/* API Usage Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API调用统计</h3>
          <div className="space-y-4">
            {[
              { endpoint: '/api/v1/opportunities', calls: 45678, success: 99.8 },
              { endpoint: '/api/v1/risks', calls: 34521, success: 99.5 },
              { endpoint: '/api/v1/policies', calls: 23456, success: 99.9 },
              { endpoint: '/api/v1/market', calls: 18765, success: 99.2 },
            ].map((stat) => (
              <div key={stat.endpoint} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-mono text-sm">{stat.endpoint}</div>
                  <div className="text-xs text-muted-foreground">{stat.calls.toLocaleString()} 次调用</div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {stat.success}% 成功
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">用户活跃时段</h3>
          <div className="grid grid-cols-7 gap-2">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => (
              <div key={day} className="text-center">
                <div className="text-xs text-muted-foreground mb-2">{day}</div>
                <div
                  className="bg-primary/20 rounded h-20 flex items-end justify-center pb-2"
                  style={{
                    height: `${Math.random() * 60 + 20}px`,
                  }}
                >
                  <span className="text-xs font-medium">{Math.floor(Math.random() * 30 + 10)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            用户最活跃时段：工作日 9:00 - 18:00
          </div>
        </Card>
      </div>
    </div>
  );
}
