import React from "react";
import { Line, LineChart as LineGraph, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/AxiosInstance";

interface MonthlyRevenue {
  month: string;
  totalRevenueInThisMonth: number;
}

const fetchMonthlyRevenue = () => axiosInstance.get<MonthlyRevenue[]>('/statics/monthly-revenue').then(res => res.data);

const LineChart: React.FC = () => {
  const { data: monthlyRevenue, isLoading, isError } = useQuery({
    queryKey: ['monthlyRevenue'],
    queryFn: fetchMonthlyRevenue,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineGraph data={monthlyRevenue}>
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
          cursor={{ stroke: 'rgba(136, 132, 216, 0.3)', strokeWidth: 2 }}
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
        <Line type="monotone" dataKey="totalRevenueInThisMonth" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineGraph>
    </ResponsiveContainer>
  );
};

export default LineChart;
