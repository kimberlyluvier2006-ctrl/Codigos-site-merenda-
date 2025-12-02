"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { WasteByPeriodChart } from "@/components/reports/waste-by-period-chart"
import { MostWastedItems } from "@/components/reports/most-wasted-items"
import { MonthlyComparison } from "@/components/reports/monthly-comparison"
import { ReportFilters } from "@/components/reports/report-filters"

export default function RelatoriosPage() {
  const [filters, setFilters] = useState({
    period: "month",
    startDate: "",
    endDate: "",
    category: "all",
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    // Here you would typically refetch data based on filters
    console.log("Filters updated:", newFilters)
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">Análise detalhada do desperdício e performance do sistema</p>
          </div>

          <ReportFilters onFilterChange={handleFilterChange} />

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="items">Itens Desperdiçados</TabsTrigger>
              <TabsTrigger value="comparison">Comparativo</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <WasteByPeriodChart />
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <MostWastedItems />
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <MonthlyComparison />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
