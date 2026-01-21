"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconBug,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconSearch,
  IconX
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import JsonView from "@uiw/react-json-view";
import { vscodeTheme } from "@uiw/react-json-view/vscode";
import * as React from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const schema = z.object({
  id: z.string(),
  level: z.string(),
  message: z.string(),
  details: z.string(),
  deviceId: z.string(),
  deviceModel: z.string(),
  osVersion: z.string(),
  appVersion: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  userId: z.string().nullable(),
  nameUser: z.string().nullable(),
  timestamp: z.string(),
  createdAt: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
      data-sortable-handle
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "level",
    header: "Tipo de Log",
    cell: ({ row }) => {
      return <p className="text-foreground">{row.original.level}</p>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "message",
    header: "Descrição",
    size: Number.MAX_SAFE_INTEGER,
    cell: ({ row }) => (
      <div className="min-w-64 max-w-2xl">
        <p className="text-muted-foreground truncate">{row.original.message}</p>
      </div>
    ),
  },
  {
    accessorKey: "deviceModel",
    header: "Modelo de dispositivo",
    cell: ({ row }) => (
      <div className="w-32">
        <p className="text-muted-foreground">{row.original.deviceModel}</p>
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Data do Log",
    cell: ({ row }) => (
      <div className="w-32">
        <p className="text-muted-foreground">
          {new Date(row.original.timestamp).toLocaleString("pt-BR")}
        </p>
      </div>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Prevenir abertura do drawer durante o drag ou ao clicar no drag handle/checkbox
  const handleClick = (e: React.MouseEvent) => {
    // Se o clique for no drag handle ou checkbox, não abrir o drawer
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-sortable-handle]') ||
      target.closest('input[type="checkbox"]') ||
      target.closest('[role="checkbox"]')
    ) {
      return;
    }
    setIsDrawerOpen(true);
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className="relative z-0 cursor-pointer data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 hover:bg-muted/50"
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
        onClick={handleClick}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
      <DrawerContent className="min-w-[30vw]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{row.original.level}</DrawerTitle>
          <DrawerDescription>
            {row.original.deviceModel} - {row.original.osVersion}
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="flex flex-col gap-4 overflow-y-auto px-4 text-sm"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="grid gap-2">
            <div className="flex gap-2 leading-none font-medium">
              Descrição do Log <IconBug className="size-4" />
            </div>
            <div className="text-muted-foreground select-text">
              {row.original.message}
            </div>
          </div>
          <Separator className="my-2" />

          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Detalhes</div>
              {row.original.details ? (
                <div
                  className="select-text"
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <JsonView
                    displayDataTypes={false}
                    displayObjectSize={false}
                    style={vscodeTheme}
                    value={JSON.parse(row.original.details)}
                  />
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Não há detalhes para este log.
                </div>
              )}
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Informações do Dispositivo</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    ID do Dispositivo
                  </div>
                  <div>{row.original.deviceId}</div>
                </div>
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Modelo
                  </div>
                  <div>{row.original.deviceModel}</div>
                </div>
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Versão do Sistema
                  </div>
                  <div>{row.original.osVersion}</div>
                </div>
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Versão do App
                  </div>
                  <div>{row.original.appVersion}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Localização</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Latitude
                  </div>
                  <div>{row.original.latitude}</div>
                </div>
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Longitude
                  </div>
                  <div>{row.original.longitude}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Informações do Usuário</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    ID do Usuário
                  </div>
                  <div>{row.original.userId}</div>
                </div>
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">Nome</div>
                  <div>{row.original.nameUser}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Timestamps</div>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Timestamp do Log
                  </div>
                  <div>
                    {new Date(row.original.timestamp).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div className="select-text">
                  <div className="font-medium text-muted-foreground">
                    Criado em
                  </div>
                  <div>
                    {new Date(row.original.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface DataTableProps {
  data: z.infer<typeof schema>[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  paginationInfo?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    nameUser?: string;
    startDate?: string;
    endDate?: string;
  };
  onFiltersChange?: (filters: {
    nameUser?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

type FilterType =
  | "all-logs"
  | "critical-logs"
  | "info-logs"
  | "errors-logs"
  | "warning-logs"
  | "debug-logs";

export function DataTable({
  data,
  pagination: externalPagination,
  onPaginationChange,
  paginationInfo,
  filters: externalFilters,
  onFiltersChange,
}: DataTableProps) {
  // const [data, setData] = React.useState([...initialData]);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>("all-logs");
  const [internalFilters, setInternalFilters] = React.useState<{
    nameUser?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const filters = externalFilters ?? internalFilters;
  const setFilters = onFiltersChange ?? setInternalFilters;

  // Estado local para o campo de busca (com debounce)
  const [searchValue, setSearchValue] = React.useState(filters.nameUser || "");

  // Debounce para o campo de busca
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (filters.nameUser || "")) {
        const newFilters = {
          nameUser: searchValue || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        };
        setFilters(newFilters as any);
      }
    }, 500); // 500ms de delay

    return () => clearTimeout(timer);
  }, [searchValue]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Usa paginação externa se fornecida, caso contrário usa interna
  const pagination = externalPagination ?? internalPagination;
  const setPagination = onPaginationChange
    ? (updater: any) => {
        const newPagination =
          typeof updater === "function" ? updater(pagination) : updater;
        onPaginationChange(newPagination);
      }
    : setInternalPagination;
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Filtrar dados baseado no filtro ativo
  const filteredData = React.useMemo(() => {
    if (activeFilter === "all-logs") {
      return data;
    }

    const filterMap: Record<FilterType, string[]> = {
      "all-logs": [],
      "critical-logs": ["critical", "fatal"],
      "info-logs": ["info", "information"],
      "errors-logs": ["error", "err"],
      "warning-logs": ["warning", "warn"],
      "debug-logs": ["debug"],
    };

    const levelsToFilter = filterMap[activeFilter];
    if (!levelsToFilter || levelsToFilter.length === 0) {
      return data;
    }

    return data.filter((item) =>
      levelsToFilter.some((level) =>
        item.level.toLowerCase().includes(level.toLowerCase())
      )
    );
  }, [data, activeFilter]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData?.map(({ id }) => id) || [],
    [filteredData]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Usa paginação manual se paginationInfo for fornecido (server-side)
    manualPagination: !!paginationInfo,
    pageCount: paginationInfo?.totalPages ?? undefined,
    getPaginationRowModel: paginationInfo ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Resetar paginação quando o filtro mudar
  React.useEffect(() => {
    table.setPageIndex(0);
  }, [activeFilter, table]);

  // Calcular contagens para os badges
  const getFilterCount = (filterType: FilterType): number => {
    if (filterType === "all-logs") return data.length;
    
    const filterMap: Record<FilterType, string[]> = {
      "all-logs": [],
      "critical-logs": ["critical", "fatal"],
      "info-logs": ["info", "information"],
      "errors-logs": ["error", "err"],
      "warning-logs": ["warning", "warn"],
      "debug-logs": ["debug"],
    };

    const levelsToFilter = filterMap[filterType];
    if (!levelsToFilter || levelsToFilter.length === 0) return 0;

    return data.filter((item) =>
      levelsToFilter.some((level) =>
        item.level.toLowerCase().includes(level.toLowerCase())
      )
    ).length;
  };

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6 mb-6">
        {/* Linha única: Botões de tipo de log e filtros */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:justify-end">
          {/* Botões de tipo de log */}
          <div
            className={cn(
              "bg-muted text-muted-foreground inline-flex h-9 w-full lg:w-fit items-center justify-center rounded-lg p-[3px] overflow-x-auto lg:ml-auto",
              "**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 flex"
            )}
          >
            <button
              onClick={() => setActiveFilter("all-logs")}
              className={cn(
                "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                activeFilter === "all-logs"
                  ? "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm"
                  : ""
              )}
            >
              Todos os Logs
            </button>
            <button
              onClick={() => setActiveFilter("critical-logs")}
              className={cn(
                "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                activeFilter === "critical-logs"
                  ? "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm"
                  : ""
              )}
            >
              Logs Críticos
            </button>
            <button
              onClick={() => setActiveFilter("info-logs")}
              className={cn(
                "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                activeFilter === "info-logs"
                  ? "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm"
                  : ""
              )}
            >
              Logs de Informação{" "}
              <Badge variant="secondary">{getFilterCount("info-logs")}</Badge>
            </button>
            <button
              onClick={() => setActiveFilter("errors-logs")}
              className={cn(
                "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                activeFilter === "errors-logs"
                  ? "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm"
                  : ""
              )}
            >
              Logs de Erros{" "}
              <Badge variant="secondary">{getFilterCount("errors-logs")}</Badge>
            </button>
            <button
              onClick={() => setActiveFilter("warning-logs")}
              className={cn(
                "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                activeFilter === "warning-logs"
                  ? "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm"
                  : ""
              )}
            >
              Logs de Alerta{" "}
              <Badge variant="secondary">{getFilterCount("warning-logs")}</Badge>
            </button>
            <button
              onClick={() => setActiveFilter("debug-logs")}
              className={cn(
                "text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                activeFilter === "debug-logs"
                  ? "bg-background dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm"
                  : ""
              )}
            >
              Logs de Debug
            </button>
          </div>

          {/* Filtros de busca e data na mesma linha */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:ml-auto">
            {/* Campo de busca por nome */}
            <div className="relative min-w-[200px] lg:w-[240px]">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
              <Input
                id="search-name"
                type="text"
                placeholder="Buscar por nome..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9 pr-9 h-9"
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    setFilters({
                      nameUser: undefined,
                      startDate: filters.startDate || undefined,
                      endDate: filters.endDate || undefined,
                    } as any);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted p-0.5"
                  type="button"
                >
                  <IconX className="size-3.5" />
                </button>
              )}
            </div>

            {/* Filtro de data inicial */}
            <div className="relative lg:min-w-[140px]">
              <IconCalendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
              <Input
                id="start-date"
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => {
                  const newFilters = {
                    nameUser: filters.nameUser || undefined,
                    startDate: e.target.value || undefined,
                    endDate: filters.endDate || undefined,
                  };
                  setFilters(newFilters as any);
                }}
                className="pl-9 h-9"
              />
            </div>

            {/* Filtro de data final */}
            <div className="relative lg:min-w-[140px]">
              <IconCalendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
              <Input
                id="end-date"
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => {
                  const newFilters = {
                    nameUser: filters.nameUser || undefined,
                    startDate: filters.startDate || undefined,
                    endDate: e.target.value || undefined,
                  };
                  setFilters(newFilters as any);
                }}
                className="pl-9 h-9"
              />
            </div>

            {/* Botão para limpar filtros */}
            {(filters.nameUser || filters.startDate || filters.endDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchValue("");
                  setFilters({
                    nameUser: undefined,
                    startDate: undefined,
                    endDate: undefined,
                  } as any);
                }}
                className="h-9 gap-2 shrink-0"
              >
                <IconX className="size-4" />
                <span className="hidden sm:inline">Limpar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {paginationInfo?.total ?? table.getFilteredRowModel().rows.length}{" "}
            row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  const newPageSize = Number(value);
                  table.setPageSize(newPageSize);
                  // Reset to first page when page size changes
                  table.setPageIndex(0);
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {paginationInfo?.totalPages ?? table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() =>
                  table.setPageIndex(
                    (paginationInfo?.totalPages ?? table.getPageCount()) - 1
                  )
                }
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

