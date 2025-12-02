"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { UserTable } from "@/components/users/user-table"
import { UserForm } from "@/components/users/user-form"
import { UserStats } from "@/components/users/user-stats"
import { mockUsers, type ExtendedUser } from "@/lib/users"

export default function UsuariosPage() {
  const [users, setUsers] = useState<ExtendedUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = (newUser: Omit<ExtendedUser, "id" | "createdAt" | "lastLogin">) => {
    const user: ExtendedUser = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, user])
  }

  const handleEditUser = (updatedUser: Omit<ExtendedUser, "id" | "createdAt" | "lastLogin">) => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? { ...updatedUser, id: editingUser.id, createdAt: editingUser.createdAt, lastLogin: editingUser.lastLogin }
            : user,
        ),
      )
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const openEditForm = (user: ExtendedUser) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const openAddForm = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários do sistema Merenda+</p>
          </div>

          <UserStats users={users} />

          <Card>
            <CardHeader>
              <CardTitle>Usuários do Sistema</CardTitle>
              <CardDescription>Lista completa dos usuários cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={openAddForm} className="sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </div>

              {filteredUsers.length > 0 ? (
                <UserTable users={filteredUsers} onEdit={openEditForm} onDelete={handleDeleteUser} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "Nenhum usuário encontrado com os critérios de busca." : "Nenhum usuário cadastrado."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <UserForm
            isOpen={isFormOpen}
            onClose={closeForm}
            onSubmit={editingUser ? handleEditUser : handleAddUser}
            editingUser={editingUser}
          />
        </div>
      </MainLayout>
    </AuthGuard>
  )
}
