"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: logsData } = useQuery({
    queryKey: ["logs", pagination.pageIndex + 1, pagination.pageSize],
    queryFn: async () =>
      await axios.get("/api/logs", {
        params: {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
        },
      }),
    select: (data) => data.data,
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
              {/* <SectionCards /> */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable
                data={logs}
                pagination={pagination}
                onPaginationChange={(newPagination) =>
                  setPagination(newPagination)
                }
                paginationInfo={paginationInfo}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
