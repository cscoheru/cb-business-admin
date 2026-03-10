import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AdminHomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">管理后台</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">用户管理</h2>
          <p className="text-muted-foreground mb-4">查看和管理平台用户</p>
          <Link href="/users">
            <Button>管理用户</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">订阅管理</h2>
          <p className="text-muted-foreground mb-4">查看订阅和支付记录</p>
          <Link href="/subscriptions">
            <Button>管理订阅</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">财务报表</h2>
          <p className="text-muted-foreground mb-4">查看收入和财务数据</p>
          <Link href="/finance">
            <Button>查看报表</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">数据分析</h2>
          <p className="text-muted-foreground mb-4">查看平台数据统计</p>
          <Link href="/analytics">
            <Button>查看数据</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
