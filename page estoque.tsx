"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { InventoryForm } from "@/components/inventory/inventory-form"
import { mockInventory, type InventoryItem } from "@/lib/data"

export default function EstoquePage() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddItem = (newItem: Omit<InventoryItem, "id">) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
    }
    setItems([...items, item])
  }

  const handleEditItem = (updatedItem: Omit<InventoryItem, "id">) => {
    if (editingItem) {
      setItems(items.map((item) => (item.id === editingItem.id ? { ...updatedItem, id: editingItem.id } : item)))
      setEditingItem(null)
    }
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const openEditForm = (item: InventoryItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const openAddForm = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Estoque</h1>
            <p className="text-muted-foreground">Gerencie os itens do estoque da merenda escolar</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Itens em Estoque</CardTitle>
              <CardDescription>Lista completa dos itens disponíveis no estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome ou categoria..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={openAddForm} className="sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {filteredItems.length > 0 ? (
                <InventoryTable items={filteredItems} onEdit={openEditForm} onDelete={handleDeleteItem} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "Nenhum item encontrado com os critérios de busca." : "Nenhum item no estoque."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <InventoryForm
            isOpen={isFormOpen}
            onClose={closeForm}
            onSubmit={editingItem ? handleEditItem : handleAddItem}
            editingItem={editingItem}
          />
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
