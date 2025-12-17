"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const description = "An interactive area chart";

type ChartDataProps = {
  date: string;
  error: number;
  warning: number;
  info: number;
  debug: number;
  critical: number;
};

const chartConfig = {
  logs: {
    label: "Logs",
  },
  error: {
    label: "Error",
    color: "var(--error-color)",
  },
  warning: {
    label: "Warning",
    color: "var(--warning-color)",
  },
  info: {
    label: "Info",
    color: "var(--info-color)",
  },
  debug: {
    label: "Debug",
    color: "var(--debug-color)",
  },
  critical: {
    label: "Critical",
    color: "var(--critical-color)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const { data: chartData } = useQuery({
    queryKey: ["log-summary"],
    queryFn: async () => await axios.get("/api/logs/summary"),
    select: (data) => data.data as ChartDataProps[],
    refetchInterval: 10e3,
  });

  if (!chartData)
    return (
      <Card className="@container/card py-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </Card>
    );

  // Ordena os dados por data (crescente) antes de filtrar
  const sortedData = [...chartData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  const filteredData = sortedData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Logs</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total logs for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillError" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-error)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-error)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-warning)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-warning)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillDebug" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-debug)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-debug)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-critical)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-critical)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillInfo" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-info)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-info)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="warning"
                type="natural"
                fill="url(#fillWarning)"
                stroke="var(--color-warning)"
                stackId="a"
              />
              <Area
                dataKey="error"
                type="natural"
                fill="url(#fillError)"
                stroke="var(--color-error)"
                stackId="a"
              />
              <Area
                dataKey="debug"
                type="natural"
                fill="url(#fillDebug)"
                stroke="var(--color-debug)"
                stackId="a"
              />
              <Area
                dataKey="critical"
                type="natural"
                fill="url(#fillCritical)"
                stroke="var(--color-critical)"
                stackId="a"
              />
              <Area
                dataKey="info"
                type="natural"
                fill="url(#fillInfo)"
                stroke="var(--color-info)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full py-10 w-full items-center justify-center">
            <p className="text-muted-foreground">No results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
