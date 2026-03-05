"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AppVersionRow = {
  id: string;
  userId: string | null;
  nameUser: string | null;
  appVersion: string | null;
  routeOrFunction: string;
  timestamp: string;
};

export default function AppVersionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["app-versions"],
    queryFn: async () =>
      await axios.get<{ data: AppVersionRow[] }>("/api/logs/app-versions"),
    select: (res) => res.data.data,
  });

  const groupedData = React.useMemo(() => {
    if (!data) return [];

    const result: AppVersionRow[] = [];

    for (const row of data) {
      const last = result[result.length - 1];
      const sameUser =
        last &&
        last.userId === row.userId &&
        last.nameUser === row.nameUser;

      if (sameUser) {
        // Unificar rota/função em uma única string separada por vírgula,
        // evitando duplicar textos iguais.
        const existing = last.routeOrFunction.split(",").map((s) => s.trim());
        if (!existing.includes(row.routeOrFunction.trim())) {
          last.routeOrFunction = `${last.routeOrFunction}, ${row.routeOrFunction}`;
        }
        // Mantém o timestamp do primeiro (mais recente), então não atualizamos aqui.
      } else {
        result.push({ ...row });
      }
    }

    return result;
  }, [data]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Versões do App por usuário
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Lista das últimas requisições com a versão do app por
                    usuário.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <p className="text-muted-foreground">Carregando...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead className="w-[260px]">ID</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Versão do App</TableHead>
                          <TableHead>Rota/Função</TableHead>
                          <TableHead className="w-[200px]">
                            Data da requisição
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupedData && groupedData.length > 0 ? (
                          groupedData.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-mono text-xs">
                                {row.id}
                              </TableCell>
                              <TableCell>
                                {row.nameUser || "Usuário desconhecido"}
                              </TableCell>
                              <TableCell>{row.appVersion ?? "-"}</TableCell>
                              <TableCell
                                className="max-w-xl truncate"
                                title={row.routeOrFunction}
                              >
                                {row.routeOrFunction}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs">
                                {new Date(row.timestamp).toLocaleString(
                                  "pt-BR"
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="h-24 text-center text-muted-foreground"
                            >
                              Nenhum registro encontrado.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

