"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable, type FilterType } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<{
    nameUser?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const [logType, setLogType] = useState<FilterType>("all-logs");

  const { data: logsData } = useQuery({
    queryKey: [
      "logs",
      pagination.pageIndex + 1,
      pagination.pageSize,
      filters.nameUser,
      filters.startDate,
      filters.endDate,
      logType,
    ],
    queryFn: async () =>
      await axios.get("/api/logs", {
        params: {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          ...(filters.nameUser && { nameUser: filters.nameUser }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(logType && logType !== "all-logs" && { logType }),
        },
      }),
    select: (data) => data.data,
    placeholderData: keepPreviousData,
    // refetchInterval: 10e3,
  });

  const logs = logsData?.data || [];
  const paginationInfo = logsData?.pagination;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 flex flex-col gap-4">
                <div className="flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/app-versions">
                      Versões do App por usuário
                    </Link>
                  </Button>
                </div>
                <ChartAreaInteractive />
              </div>
              <DataTable
                data={logsData?.data || []}
                pagination={pagination}
                onPaginationChange={(newPagination) =>
                  setPagination(newPagination)
                }
                paginationInfo={paginationInfo}
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters);
                  // Resetar para primeira página quando filtros mudarem
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                activeFilter={logType}
                onActiveFilterChange={(newFilter) => {
                  setLogType(newFilter);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
