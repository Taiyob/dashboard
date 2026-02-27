/* eslint-disable @typescript-eslint/no-explicit-any */
import StatsCard from './StatsCard';

export function SectionCards({ dashboardStats }: any) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <StatsCard title="Total User" total={dashboardStats?.totalUsers} />
      <StatsCard title="Total Payment" total={dashboardStats?.totalPayments} />
      <StatsCard title="Total Product" total={dashboardStats?.totalProducts} />
    </div>
  );
}
