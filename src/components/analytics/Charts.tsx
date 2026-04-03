"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils/formatters";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({ title, children, action }: ChartCardProps) {
  return (
    <Card className="border-gray-200/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Color palette for charts
const CHART_COLORS = {
  primary: "#0066FF",
  secondary: "#1A1A1A",
  accent: "#F59E0B",
  success: "#10B981",
  gray: "#6B7280",
  palette: ["#0066FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
};

// Views Line Chart
interface ViewsChartProps {
  data: Array<{ date: string; views: number }>;
  period?: string;
}

export function ViewsChart({ data, period = "30d" }: ViewsChartProps) {
  return (
    <ChartCard
      title="Vues du profil"
      action={
        <Select defaultValue={period}>
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="90d">90 jours</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [value, "Vues"]}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// Revenue Bar Chart
interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
  period?: string;
}

export function RevenueChart({ data, period = "6m" }: RevenueChartProps) {
  return (
    <ChartCard
      title="Revenus"
      action={
        <Select defaultValue={period}>
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="6m">6 mois</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [formatPrice(value), "Revenus"]}
            />
            <Bar
              dataKey="revenue"
              fill={CHART_COLORS.success}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// Reservations Line Chart
interface ReservationsChartProps {
  data: Array<{ date: string; reservations: number; completed: number }>;
  period?: string;
}

export function ReservationsChart({ data, period = "30d" }: ReservationsChartProps) {
  return (
    <ChartCard
      title="Tendances des réservations"
      action={
        <Select defaultValue={period}>
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="90d">90 jours</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="reservations"
              name="Réservations"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="Terminées"
              stroke={CHART_COLORS.success}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// Services Pie Chart
interface ServicesPieChartProps {
  data: Array<{ name: string; value: number }>;
}

export function ServicesPieChart({ data }: ServicesPieChartProps) {
  return (
    <ChartCard title="Répartition des services">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS.palette[index % CHART_COLORS.palette.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [value, "Réservations"]}
            />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

// Simple Stats Card for Analytics
interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "default";
}

export function AnalyticsStatCard({
  title,
  value,
  change,
  icon,
  color = "default",
}: AnalyticsStatCardProps) {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    default: "text-gray-500 bg-gray-500/10",
  };

  return (
    <Card className="border-gray-200/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <p
                className={`text-xs mt-1 ${
                  change.isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {change.isPositive ? "+" : "-"}{Math.abs(change.value)}% vs mois dernier
              </p>
            )}
          </div>
          {icon && (
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { CHART_COLORS };
