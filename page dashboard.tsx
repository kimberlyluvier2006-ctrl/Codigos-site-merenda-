import { Package, AlertTriangle, TrendingDown, BarChart3 } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { MetricCard } from "@/components/dashboard/metric-card"
import { WasteChart } from "@/components/dashboard/waste-chart"
import { RecentWaste } from "@/components/dashboard/recent-waste"
import { getTotalStock, getExpiringItems, getMonthlyWaste } from "@/lib/data"

export default function DashboardPage() {
  const totalStock = getTotalStock()
  const expiringItems = getExpiringItems()
  const monthlyWaste = getMonthlyWaste()

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do sistema de gestão de merenda</p>
          </div>

          {/* Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Estoque Total"
              value={totalStock}
              icon={Package}
              description="Itens em estoque"
              variant="success"
            />
            <MetricCard
              title="Itens Vencendo"
              value={expiringItems.length}
              icon={AlertTriangle}
              description="Próximos 7 dias"
              variant={expiringItems.length > 0 ? "warning" : "success"}
            />
            <MetricCard
              title="Desperdício do Mês"
              value={monthlyWaste}
              icon={TrendingDown}
              description="Itens desperdiçados"
              variant={monthlyWaste > 20 ? "warning" : "default"}
            />
            <MetricCard
              title="Taxa de Aproveitamento"
              value="87%"
              icon={BarChart3}
              description="Meta: 90%"
              variant="default"
            />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <WasteChart />
            <RecentWaste />
          </div>

          {/* Expiring Items Alert */}
          {expiringItems.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                ⚠️ Atenção: Itens próximos ao vencimento
              </h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {expiringItems.map((item) => (
                  <div key={item.id} className="text-sm">
                    <span className="font-medium">{item.name}</span> - {item.quantity} unidades
                    <br />
                    <span className="text-orange-600 dark:text-orange-400">
                      Vence em: {new Date(item.expiryDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
