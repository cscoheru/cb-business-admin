'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApiClient, User } from '@/lib/api';
import { Search, Download, User as UserIcon, Mail, Calendar, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, [statusFilter, planFilter]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await adminApiClient.getUsers({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        plan_tier: planFilter !== 'all' ? planFilter : undefined,
        search: searchQuery || undefined,
      });
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: User['status']) => {
    const config = {
      active: { label: '活跃', variant: 'default' as const },
      suspended: { label: '已暂停', variant: 'secondary' as const },
      cancelled: { label: '已取消', variant: 'outline' as const },
    };
    const { label, variant } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getSubscriptionBadge = (subscription: User['subscription']) => {
    const config = {
      free: { label: '免费版', variant: 'outline' as const },
      pro: { label: '专业版', variant: 'default' as const },
      enterprise: { label: '企业版', variant: 'secondary' as const },
    };
    const { label, variant } = config[subscription];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getApiUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">用户管理</h1>
          <p className="text-muted-foreground mt-1">管理平台用户和权限</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          导出数据
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">2,845</div>
              <div className="text-sm text-muted-foreground">总用户数</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-muted-foreground">活跃用户</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">142</div>
              <div className="text-sm text-muted-foreground">付费用户</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">+18.5%</div>
              <div className="text-sm text-muted-foreground">月增长率</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索用户名、邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="suspended">已暂停</option>
            <option value="cancelled">已取消</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">全部套餐</option>
            <option value="free">免费版</option>
            <option value="pro">专业版</option>
            <option value="enterprise">企业版</option>
          </select>
          <Button onClick={loadUsers}>筛选</Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>订阅</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>API 使用量</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead>最后活跃</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  没有找到匹配的用户
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className={getApiUsageColor(user.apiUsage.used, user.apiUsage.limit)}>
                      {user.apiUsage.used.toLocaleString()} / {user.apiUsage.limit.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastActiveAt}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      详情
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
          显示 1 - {users.length} 条，共 {users.length} 条
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
