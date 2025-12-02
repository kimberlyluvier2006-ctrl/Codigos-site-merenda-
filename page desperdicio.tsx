"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { WasteForm } from "@/components/waste/waste-form"
import { WasteHistory } from "@/components/waste/waste-history"
import { WasteSummary } from "@/components/waste/waste-summary"
import { mockWasteRecords, type WasteRecord } from "@/lib/data"

export default function DesperdicioPage() {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(mockWasteRecords)

  const handleAddWaste = (newWaste: Omit<WasteRecord, "id">) => {
    const wasteRecord: WasteRecord = {
      ...newWaste,
      id: Date.now().toString(),
    }
    setWasteRecords([wasteRecord, ...wasteRecords])
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Controle de Desperdício</h1>
            <p className="text-muted-foreground">Registre e monitore os desperdícios de merenda escolar</p>
          </div>

          <WasteSummary records={wasteRecords} />

          <div className="grid gap-6 lg:grid-cols-2">
            <WasteForm onSubmit={handleAddWaste} />
            <WasteHistory records={wasteRecords} />
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
