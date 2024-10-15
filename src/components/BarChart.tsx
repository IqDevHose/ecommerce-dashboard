import React from "react";
import { Bar, ResponsiveContainer } from "recharts";
import { BarChart as BarGraph, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/AxiosInstance";

interface MonthlyRevenue {
  name: string;
  total: number;
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
          dataKey="name"
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
        <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#8884d8" />
      </BarGraph>
    </ResponsiveContainer>
  );
};

export default BarChart;
