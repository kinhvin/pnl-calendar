import { SectionCards, ChartAreaInteractive, DataTable } from '../components/dashboard';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.email}</p>
      </div>
      <SectionCards />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartAreaInteractive />
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <DataTable />
        </div>
      </div>
    </>
  );
}
