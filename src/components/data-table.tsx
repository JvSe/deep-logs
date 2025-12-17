"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconBug,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
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
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

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
      return <TableCellViewer item={row.original} />;
      // return <p>{row.original.level}</p>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "message",
    header: "Descrição",
    size: Number.MAX_SAFE_INTEGER,
    cell: ({ row }) => (
      <div className="w-32">
        <p className="text-muted-foreground">{row.original.message}</p>
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

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
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
}

export function DataTable({
  data: initialData,
  pagination: externalPagination,
  onPaginationChange,
  paginationInfo,
}: DataTableProps) {
  const [data, setData] = React.useState([...initialData]);
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

  console.log("[data]:", data);
  console.log("[initialData]:", initialData);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="all-logs"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-logs">Todos os Logs</SelectItem>
            <SelectItem value="critical-logs">Logs Críticos</SelectItem>
            <SelectItem value="info-logs">Logs de Informação</SelectItem>
            <SelectItem value="errors-logs">Logs de Erros</SelectItem>
            <SelectItem value="warning-logs">Logs de Alerta</SelectItem>
            <SelectItem value="debug-logs">Logs de Debug</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all-logs">Todos os Logs</TabsTrigger>
          <TabsTrigger value="critical-logs">Logs Críticos</TabsTrigger>
          <TabsTrigger value="info-logs">
            Logs de Informação <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="errors-logs">
            Logs de Erros <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="warning-logs">
            Logs de Alerta <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="debug-logs">Logs de Debug</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button variant="destructive" size="sm">
            <IconTrash />
            <span className="hidden lg:inline">Clear Log</span>
          </Button> */}
        </div>
      </div>
      <TabsContent
        value="all-logs"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
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
      </TabsContent>
      <TabsContent value="critical-logs" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="info-logs" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="errors-logs" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="warning-logs" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="debug-logs" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.level}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-w-[30vw]">
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.level}</DrawerTitle>
          <DrawerDescription>
            {item.deviceModel} - {item.osVersion}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid gap-2">
            <div className="flex gap-2 leading-none font-medium">
              Descrição do Log <IconBug className="size-4" />
            </div>
            <div className="text-muted-foreground">{item.message}</div>
          </div>
          <Separator className="my-2" />

          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <div className="font-medium">Detalhes</div>
              {item.details ? (
                <JsonView
                  displayDataTypes={false}
                  displayObjectSize={false}
                  style={vscodeTheme}
                  value={JSON.parse(item.details)}
                />
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
                <div>
                  <div className="font-medium text-muted-foreground">
                    ID do Dispositivo
                  </div>
                  <div>{item.deviceId}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Modelo
                  </div>
                  <div>{item.deviceModel}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Versão do Sistema
                  </div>
                  <div>{item.osVersion}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Versão do App
                  </div>
                  <div>{item.appVersion}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Localização</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">
                    Latitude
                  </div>
                  <div>{item.latitude}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Longitude
                  </div>
                  <div>{item.longitude}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Informações do Usuário</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">
                    ID do Usuário
                  </div>
                  <div>{item.userId}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Nome</div>
                  <div>{item.nameUser}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="font-medium">Timestamps</div>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">
                    Timestamp do Log
                  </div>
                  <div>{new Date(item.timestamp).toLocaleString("pt-BR")}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Criado em
                  </div>
                  <div>{new Date(item.createdAt).toLocaleString("pt-BR")}</div>
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
