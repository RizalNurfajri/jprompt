import { Button } from "@/components/ui/button"
import { useAuth } from "@/auth/AuthContext"
import { LogIn, LogOut, Loader2 } from "lucide-react"

export function LoginButton() {
    const { apiKey, login, logout, isLoading } = useAuth()

    if (isLoading) {
        return (
            <Button variant="outline" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
            </Button>
        )
    }

    if (apiKey) {
        return (
            <Button variant="outline" onClick={logout} className="bg-transparent text-zinc-100 border-zinc-700 hover:bg-zinc-800 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Pollinations
            </Button>
        )
    }

    return (
        <Button onClick={login} className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium transition-all shadow-lg hover:shadow-xl active:scale-95">
            <LogIn className="mr-2 h-4 w-4" />
            Connect Pollinations
        </Button>
    )
}
