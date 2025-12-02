"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReportFiltersProps {
  onFilterChange: (filters: {
    period: string
    startDate: string
    endDate: string
    category: string
  }) => void
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [filters, setFilters] = useState({
    period: "month",
    startDate: "",
    endDate: "",
    category: "all",
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleExport = () => {
    // Mock export functionality
    alert("Relatório exportado com sucesso!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Relatório</CardTitle>
        <CardDescription>Configure os parâmetros para gerar relatórios personalizados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={filters.period} onValueChange={(value) => handleFilterChange("period", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
                <SelectItem value="custom">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.period === "custom" && (
            <>
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="grãos">Grãos</SelectItem>
                <SelectItem value="laticínios">Laticínios</SelectItem>
                <SelectItem value="panificados">Panificados</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="verduras">Verduras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
