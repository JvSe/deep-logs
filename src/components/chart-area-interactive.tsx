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

export const description = "An interactive area chart";

const chartData = [
  {
    date: "2024-04-01",
    error: 222,
    warning: 150,
    info: 450,
    debug: 320,
    critical: 180,
  },
  {
    date: "2024-04-02",
    error: 97,
    warning: 180,
    info: 380,
    debug: 290,
    critical: 150,
  },
  {
    date: "2024-04-03",
    error: 167,
    warning: 120,
    info: 420,
    debug: 340,
    critical: 200,
  },
  {
    date: "2024-04-04",
    error: 242,
    warning: 260,
    info: 510,
    debug: 380,
    critical: 220,
  },
  {
    date: "2024-04-05",
    error: 373,
    warning: 290,
    info: 580,
    debug: 420,
    critical: 250,
  },
  {
    date: "2024-04-06",
    error: 301,
    warning: 340,
    info: 620,
    debug: 460,
    critical: 280,
  },
  {
    date: "2024-04-07",
    error: 245,
    warning: 180,
    info: 440,
    debug: 320,
    critical: 190,
  },
  {
    date: "2024-04-08",
    error: 409,
    warning: 320,
    info: 680,
    debug: 520,
    critical: 310,
  },
  {
    date: "2024-04-09",
    error: 59,
    warning: 110,
    info: 290,
    debug: 220,
    critical: 120,
  },
  {
    date: "2024-04-10",
    error: 261,
    warning: 190,
    info: 480,
    debug: 350,
    critical: 210,
  },
  {
    date: "2024-04-11",
    error: 327,
    warning: 350,
    info: 720,
    debug: 540,
    critical: 330,
  },
  {
    date: "2024-04-12",
    error: 292,
    warning: 210,
    info: 520,
    debug: 380,
    critical: 240,
  },
  {
    date: "2024-04-13",
    error: 342,
    warning: 380,
    info: 780,
    debug: 580,
    critical: 360,
  },
  {
    date: "2024-04-14",
    error: 137,
    warning: 220,
    info: 420,
    debug: 310,
    critical: 180,
  },
  {
    date: "2024-04-15",
    error: 120,
    warning: 170,
    info: 380,
    debug: 280,
    critical: 160,
  },
  {
    date: "2024-04-16",
    error: 138,
    warning: 190,
    info: 400,
    debug: 300,
    critical: 170,
  },
  {
    date: "2024-04-17",
    error: 446,
    warning: 360,
    info: 820,
    debug: 620,
    critical: 380,
  },
  {
    date: "2024-04-18",
    error: 364,
    warning: 410,
    info: 880,
    debug: 660,
    critical: 420,
  },
  {
    date: "2024-04-19",
    error: 243,
    warning: 180,
    info: 460,
    debug: 340,
    critical: 200,
  },
  {
    date: "2024-04-20",
    error: 89,
    warning: 150,
    info: 350,
    debug: 260,
    critical: 140,
  },
  {
    date: "2024-04-21",
    error: 137,
    warning: 200,
    info: 420,
    debug: 310,
    critical: 180,
  },
  {
    date: "2024-04-22",
    error: 224,
    warning: 170,
    info: 440,
    debug: 320,
    critical: 190,
  },
  {
    date: "2024-04-23",
    error: 138,
    warning: 230,
    info: 480,
    debug: 350,
    critical: 210,
  },
  {
    date: "2024-04-24",
    error: 387,
    warning: 290,
    info: 720,
    debug: 540,
    critical: 320,
  },
  {
    date: "2024-04-25",
    error: 215,
    warning: 250,
    info: 520,
    debug: 380,
    critical: 230,
  },
  {
    date: "2024-04-26",
    error: 75,
    warning: 130,
    info: 320,
    debug: 240,
    critical: 130,
  },
  {
    date: "2024-04-27",
    error: 383,
    warning: 420,
    info: 840,
    debug: 630,
    critical: 410,
  },
  {
    date: "2024-04-28",
    error: 122,
    warning: 180,
    info: 400,
    debug: 290,
    critical: 170,
  },
  {
    date: "2024-04-29",
    error: 315,
    warning: 240,
    info: 580,
    debug: 420,
    critical: 260,
  },
  {
    date: "2024-04-30",
    error: 454,
    warning: 380,
    info: 860,
    debug: 640,
    critical: 390,
  },
  {
    date: "2024-05-01",
    error: 165,
    warning: 220,
    info: 460,
    debug: 330,
    critical: 200,
  },
  {
    date: "2024-05-02",
    error: 293,
    warning: 310,
    info: 680,
    debug: 500,
    critical: 300,
  },
  {
    date: "2024-05-03",
    error: 247,
    warning: 190,
    info: 480,
    debug: 350,
    critical: 210,
  },
  {
    date: "2024-05-04",
    error: 385,
    warning: 420,
    info: 840,
    debug: 630,
    critical: 410,
  },
  {
    date: "2024-05-05",
    error: 481,
    warning: 390,
    info: 920,
    debug: 690,
    critical: 430,
  },
  {
    date: "2024-05-06",
    error: 498,
    warning: 520,
    info: 1040,
    debug: 780,
    critical: 520,
  },
  {
    date: "2024-05-07",
    error: 388,
    warning: 300,
    info: 720,
    debug: 540,
    critical: 320,
  },
  {
    date: "2024-05-08",
    error: 149,
    warning: 210,
    info: 420,
    debug: 310,
    critical: 190,
  },
  {
    date: "2024-05-09",
    error: 227,
    warning: 180,
    info: 440,
    debug: 320,
    critical: 200,
  },
  {
    date: "2024-05-10",
    error: 293,
    warning: 330,
    info: 680,
    debug: 500,
    critical: 310,
  },
  {
    date: "2024-05-11",
    error: 335,
    warning: 270,
    info: 640,
    debug: 470,
    critical: 280,
  },
  {
    date: "2024-05-12",
    error: 197,
    warning: 240,
    info: 520,
    debug: 380,
    critical: 230,
  },
  {
    date: "2024-05-13",
    error: 197,
    warning: 160,
    info: 380,
    debug: 280,
    critical: 170,
  },
  {
    date: "2024-05-14",
    error: 448,
    warning: 490,
    info: 980,
    debug: 730,
    critical: 480,
  },
  {
    date: "2024-05-15",
    error: 473,
    warning: 380,
    info: 900,
    debug: 670,
    critical: 400,
  },
  {
    date: "2024-05-16",
    error: 338,
    warning: 400,
    info: 800,
    debug: 600,
    critical: 380,
  },
  {
    date: "2024-05-17",
    error: 499,
    warning: 420,
    info: 940,
    debug: 700,
    critical: 420,
  },
  {
    date: "2024-05-18",
    error: 315,
    warning: 350,
    info: 720,
    debug: 540,
    critical: 340,
  },
  {
    date: "2024-05-19",
    error: 235,
    warning: 180,
    info: 440,
    debug: 320,
    critical: 200,
  },
  {
    date: "2024-05-20",
    error: 177,
    warning: 230,
    info: 480,
    debug: 350,
    critical: 220,
  },
  {
    date: "2024-05-21",
    error: 82,
    warning: 140,
    info: 320,
    debug: 240,
    critical: 130,
  },
  {
    date: "2024-05-22",
    error: 81,
    warning: 120,
    info: 300,
    debug: 220,
    critical: 110,
  },
  {
    date: "2024-05-23",
    error: 252,
    warning: 290,
    info: 620,
    debug: 460,
    critical: 280,
  },
  {
    date: "2024-05-24",
    error: 294,
    warning: 220,
    info: 540,
    debug: 400,
    critical: 240,
  },
  {
    date: "2024-05-25",
    error: 201,
    warning: 250,
    info: 520,
    debug: 380,
    critical: 230,
  },
  {
    date: "2024-05-26",
    error: 213,
    warning: 170,
    info: 400,
    debug: 290,
    critical: 180,
  },
  {
    date: "2024-05-27",
    error: 420,
    warning: 460,
    info: 920,
    debug: 690,
    critical: 450,
  },
  {
    date: "2024-05-28",
    error: 233,
    warning: 190,
    info: 440,
    debug: 320,
    critical: 200,
  },
  {
    date: "2024-05-29",
    error: 78,
    warning: 130,
    info: 300,
    debug: 220,
    critical: 120,
  },
  {
    date: "2024-05-30",
    error: 340,
    warning: 280,
    info: 640,
    debug: 480,
    critical: 270,
  },
  {
    date: "2024-05-31",
    error: 178,
    warning: 230,
    info: 480,
    debug: 350,
    critical: 210,
  },
  {
    date: "2024-06-01",
    error: 178,
    warning: 200,
    info: 460,
    debug: 340,
    critical: 190,
  },
  {
    date: "2024-06-02",
    error: 470,
    warning: 410,
    info: 920,
    debug: 690,
    critical: 400,
  },
  {
    date: "2024-06-03",
    error: 103,
    warning: 160,
    info: 340,
    debug: 250,
    critical: 140,
  },
  {
    date: "2024-06-04",
    error: 439,
    warning: 380,
    info: 840,
    debug: 630,
    critical: 370,
  },
  {
    date: "2024-06-05",
    error: 88,
    warning: 140,
    info: 320,
    debug: 240,
    critical: 130,
  },
  {
    date: "2024-06-06",
    error: 294,
    warning: 250,
    info: 580,
    debug: 430,
    critical: 240,
  },
  {
    date: "2024-06-07",
    error: 323,
    warning: 370,
    info: 740,
    debug: 550,
    critical: 350,
  },
  {
    date: "2024-06-08",
    error: 385,
    warning: 320,
    info: 720,
    debug: 540,
    critical: 300,
  },
  {
    date: "2024-06-09",
    error: 438,
    warning: 480,
    info: 960,
    debug: 720,
    critical: 470,
  },
  {
    date: "2024-06-10",
    error: 155,
    warning: 200,
    info: 440,
    debug: 320,
    critical: 190,
  },
  {
    date: "2024-06-11",
    error: 92,
    warning: 150,
    info: 340,
    debug: 250,
    critical: 140,
  },
  {
    date: "2024-06-12",
    error: 492,
    warning: 420,
    info: 940,
    debug: 700,
    critical: 410,
  },
  {
    date: "2024-06-13",
    error: 81,
    warning: 130,
    info: 300,
    debug: 220,
    critical: 120,
  },
  {
    date: "2024-06-14",
    error: 426,
    warning: 380,
    info: 820,
    debug: 610,
    critical: 360,
  },
  {
    date: "2024-06-15",
    error: 307,
    warning: 350,
    info: 700,
    debug: 520,
    critical: 330,
  },
  {
    date: "2024-06-16",
    error: 371,
    warning: 310,
    info: 720,
    debug: 540,
    critical: 290,
  },
  {
    date: "2024-06-17",
    error: 475,
    warning: 520,
    info: 1040,
    debug: 780,
    critical: 510,
  },
  {
    date: "2024-06-18",
    error: 107,
    warning: 170,
    info: 360,
    debug: 260,
    critical: 150,
  },
  {
    date: "2024-06-19",
    error: 341,
    warning: 290,
    info: 640,
    debug: 480,
    critical: 270,
  },
  {
    date: "2024-06-20",
    error: 408,
    warning: 450,
    info: 900,
    debug: 670,
    critical: 430,
  },
  {
    date: "2024-06-21",
    error: 169,
    warning: 210,
    info: 460,
    debug: 340,
    critical: 200,
  },
  {
    date: "2024-06-22",
    error: 317,
    warning: 270,
    info: 600,
    debug: 440,
    critical: 250,
  },
  {
    date: "2024-06-23",
    error: 480,
    warning: 530,
    info: 1060,
    debug: 790,
    critical: 520,
  },
  {
    date: "2024-06-24",
    error: 132,
    warning: 180,
    info: 400,
    debug: 290,
    critical: 170,
  },
  {
    date: "2024-06-25",
    error: 141,
    warning: 190,
    info: 420,
    debug: 310,
    critical: 180,
  },
  {
    date: "2024-06-26",
    error: 434,
    warning: 380,
    info: 840,
    debug: 630,
    critical: 360,
  },
  {
    date: "2024-06-27",
    error: 448,
    warning: 490,
    info: 980,
    debug: 730,
    critical: 480,
  },
  {
    date: "2024-06-28",
    error: 149,
    warning: 200,
    info: 440,
    debug: 320,
    critical: 190,
  },
  {
    date: "2024-06-29",
    error: 103,
    warning: 160,
    info: 340,
    debug: 250,
    critical: 140,
  },
  {
    date: "2024-06-30",
    error: 446,
    warning: 400,
    info: 860,
    debug: 640,
    critical: 380,
  },
];

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

  const filteredData = chartData.filter((item) => {
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
      </CardContent>
    </Card>
  );
}
