'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApiClient, Subscription } from '@/lib/api';
import { CreditCard, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pro: 0,
    enterprise: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  useEffect(() => {
    loadSubscriptions();
  }, [statusFilter, planFilter]);

  async function loadSubscriptions() {
    setLoading(true);
    try {
      const data = await adminApiClient.getSubscriptions({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        plan_tier: planFilter !== 'all' ? planFilter : undefined,
      });
      setSubscriptions(data.subscriptions);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: Subscription['status']) => {
    const config = {
      active: { label: '活跃', variant: 'default' as const },
      past_due: { label: '逾期', variant: 'destructive' as const },
      cancelled: { label: '已取消', variant: 'outline' as const },
      trialing: { label: '试用中', variant: 'secondary' as const },
    };
    const { label, variant } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPlanBadge = (plan: Subscription['plan']) => {
    const config = {
      pro: { label: '专业版', color: 'bg-blue-500' },
      enterprise: { label: '企业版', color: 'bg-purple-500' },
    };
    const { label, color } = config[plan];
    return (
      <Badge variant="outline" className={`${color}/10 ${color.replace('bg-', 'text-')} border-${color}`}>
        {label}
      </Badge>
    );
  };

  const getPeriodLabel = (period: Subscription['period']) => {
    return period === 'monthly' ? '月付' : '年付';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">订阅管理</h1>
          <p className="text-muted-foreground mt-1">查看和管理所有订阅</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          导出报表
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">总订阅数</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-muted-foreground">活跃订阅</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.pro}</div>
              <div className="text-sm text-muted-foreground">专业版</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.enterprise}</div>
              <div className="text-sm text-muted-foreground">企业版</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">¥{stats.revenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">本月收入</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="past_due">逾期</option>
            <option value="cancelled">已取消</option>
            <option value="trialing">试用中</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">全部套餐</option>
            <option value="pro">专业版</option>
            <option value="enterprise">企业版</option>
          </select>
          <Button onClick={loadSubscriptions}>筛选</Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订阅ID</TableHead>
              <TableHead>用户邮箱</TableHead>
              <TableHead>套餐</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>周期</TableHead>
              <TableHead>开始日期</TableHead>
              <TableHead>下次续费</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  没有找到匹配的订阅
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-sm">{sub.id}</TableCell>
                  <TableCell>{sub.userEmail}</TableCell>
                  <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell className="font-medium">
                    ¥{sub.amount} <span className="text-muted-foreground text-xs">/ {sub.period === 'monthly' ? '月' : '年'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPeriodLabel(sub.period)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {sub.startDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {sub.nextBillingDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      管理
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          显示 1 - {subscriptions.length} 条，共 {subscriptions.length} 条
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled>
            上一页
          </Button>
          <Button size="sm" variant="outline">
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}
