import { Leaf } from "lucide-react"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Merenda+</h1>
              <p className="text-sm opacity-90">Desperdiça Não!</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
