import React from "react";
import { Bar, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart as BarGraph, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/AxiosInstance";

interface MonthlyRevenue {
  month: string;
  totalRevenueInThisMonth: number;
}

const fetchMonthlyRevenue = () => axiosInstance.get<MonthlyRevenue[]>('/statics/monthly-revenue').then(res => res.data);

const BarChart: React.FC = () => {
  const { data: monthlyRevenue, isLoading, isError } = useQuery({
    queryKey: ['monthlyRevenue'],
    queryFn: fetchMonthlyRevenue,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarGraph data={monthlyRevenue}>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow">
                  <p className="font-bold">{payload[0].payload.month}</p>
                  <p>Revenue: ${payload[0].value}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="totalRevenueInThisMonth" radius={[4, 4, 0, 0]} fill="#8884d8" />
      </BarGraph>
    </ResponsiveContainer>
  );
};

export default BarChart;
