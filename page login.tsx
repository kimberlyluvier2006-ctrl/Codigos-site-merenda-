"use client"

import type { FormEvent } from "react"

import Script from "next/script"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Leaf, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticate } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await authenticate(email, password)
      if (user) {
        login(user)
        router.push("/dashboard")
      } else {
        setError("Email ou senha inválidos")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">

      {/* ------------------------ */}
      {/* 🔹 Google Login Scripts */}
      {/* ------------------------ */}

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />

      <Script id="google-login">
        {`
          function handleGoogleLogin(response) {
            const data = jwt_decode(response.credential);
            console.log("GOOGLE USER:", data);
            window.location.href = "/dashboard";
          }
        `}
      </Script>

      {/* ------------------------ */}
      {/* 🔹 Tela de Login */}
      {/* ------------------------ */}

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Merenda+</CardTitle>
              <CardDescription className="text-secondary font-medium">Desperdiça Não!</CardDescription>
            </div>
          </div>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Botão Entrar */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            {/* ------------------------ */}
            {/* 🔹 BOTÃO GOOGLE LOGIN   */}
            {/* ------------------------ */}

            <div
              id="g_id_onload"
              data-client_id="455761949556-sr8p8if7cpp1it32776e224s9k2ch4qc.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="redirect"
              data-login_uri="/dashboard"
              data-callback="handleGoogleLogin"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-size="large"
              data-theme="outline"
              data-text="sign_in_with"
              data-shape="rectangular"
              data-logo_alignment="left"
            ></div>

          </form>

          {/* Usuários de teste */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Usuários de teste:</p>
            <div className="text-xs space-y-1">
              <p>
                <strong>Admin:</strong> admin@escola.com / admin123
              </p>
              <p>
                <strong>Merendeira:</strong> maria@escola.com / maria123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
