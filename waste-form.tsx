"use client"

import type { FormEvent } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { mockInventory } from "@/lib/data"
import { useAuth } from "@/hooks/use-auth"

interface WasteFormProps {
  onSubmit: (waste: {
    itemName: string
    quantity: number
    reason: string
    date: string
    registeredBy: string
  }) => void
}

const wasteReasons = [
  "Vencimento",
  "Deterioração",
  "Contaminação",
  "Embalagem danificada",
  "Sobra não consumida",
  "Erro de preparo",
  "Outros",
]

export function WasteForm({ onSubmit }: WasteFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    reason: "",
    customReason: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const finalReason = formData.reason === "Outros" ? formData.customReason : formData.reason

    onSubmit({
      itemName: formData.itemName,
      quantity: Number.parseInt(formData.quantity),
      reason: finalReason,
      date: new Date().toISOString().split("T")[0],
      registeredBy: user?.name || "Usuário",
    })

    // Reset form
    setFormData({
      itemName: "",
      quantity: "",
      reason: "",
      customReason: "",
    })

    // Show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Desperdício</CardTitle>
        <CardDescription>Registre itens que foram desperdiçados para controle e análise</CardDescription>
      </CardHeader>
      <CardContent>
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Desperdício registrado com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="itemName">Nome do Item</Label>
            <Select value={formData.itemName} onValueChange={(value) => setFormData({ ...formData, itemName: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o item desperdiçado" />
              </SelectTrigger>
              <SelectContent>
                {mockInventory.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name} ({item.quantity} disponíveis)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade Desperdiçada</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Ex: 5"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do Desperdício</Label>
            <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {wasteReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.reason === "Outros" && (
            <div className="space-y-2">
              <Label htmlFor="customReason">Especifique o motivo</Label>
              <Textarea
                id="customReason"
                value={formData.customReason}
                onChange={(e) => setFormData({ ...formData, customReason: e.target.value })}
                placeholder="Descreva o motivo do desperdício..."
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!formData.itemName || !formData.quantity || !formData.reason}
          >
            Registrar Desperdício
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
