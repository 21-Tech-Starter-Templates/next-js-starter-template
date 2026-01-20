import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function OverviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Revenue
              </p>
              <p className="text-2xl font-bold">$45,231.89</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            +20.1% from last month
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Subscriptions
              </p>
              <p className="text-2xl font-bold">+2350</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            +180.1% from last month
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Sales</p>
              <p className="text-2xl font-bold">+12,234</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">+19% from last month</p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between space-y-0">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Active Now
              </p>
              <p className="text-2xl font-bold">+573</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">+201 since last hour</p>
        </div>
      </div>
    </div>
  );
}
