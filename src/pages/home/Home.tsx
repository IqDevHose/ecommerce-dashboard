import { CreditCard, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import BarChart from "@/components/BarChart";
import SalesCard from "@/components/SalesCard";
import Card, { CardContent } from "@/components/card";
import PageTitle from "@/components/PageTitle";
import axiosInstance from "@/utils/AxiosInstance";
import { RecentSale } from "@/utils/type";

// API functions
const fetchOrderStats = () => axiosInstance.get('/statics/order-stats').then(res => res.data);
const fetchRevenueStats = () => axiosInstance.get('/statics/revenue-stats').then(res => res.data);
const fetchSalesStats = () => axiosInstance.get('/statics/sales-stats').then(res => res.data);
const fetchRecentSales = ()=> axiosInstance.get('/statics/recent-sales').then(res => res.data);

export default function Home() {
  const { data: orderStats } = useQuery({
    queryKey: ['orderStats'],
    queryFn: fetchOrderStats,
  });

  const { data: revenueStats } = useQuery({
    queryKey: ['revenueStats'],
    queryFn: fetchRevenueStats,
  });

  const { data: salesStats } = useQuery({
    queryKey: ['salesStats'],
    queryFn: fetchSalesStats,
  });

  const { data: recentSales,isPending } = useQuery({
    queryKey: ['recentSales'],
    queryFn: fetchRecentSales,
  });

  const cardData = [
    {
      label: "Total Revenue",
      amount: revenueStats ? `$${revenueStats.totalRevenue.toFixed(2)}` : "Loading...",
      description: "From shipped and delivered orders",
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      amount: orderStats ? orderStats.totalOrders.toString() : "Loading...",
      description: `${orderStats?.pendingOrders || 0} pending`,
      icon: Users,
    },
    {
      label: "Total Sales",
      amount: salesStats ? salesStats.totalSales.toString() : "Loading...",
      description: "Items sold",
      icon: CreditCard,
    },
   
  ];

  return (
    <div className="flex p-10 flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((data, index) => (
          <Card
            key={index}
            amount={data.amount}
            description={data.description}
            icon={data.icon}
            label={data.label}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Sales</p>
          </section>
          {recentSales && recentSales.length > 0 ? (
            recentSales.map((data:RecentSale) => (
              <SalesCard
                key={data.id}
                image={data.image}
                email={data.email}
                name={data.name}
                salesAmount={`+$${data.salesAmount}`}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 w-full h-full ">No recent data</p>
          )}
        </CardContent>
      </section>
    </div>
  );
}
