import React, { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
    apiKey: string | null
    login: () => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [apiKey, setApiKey] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            // 1. Check URL hash for api_key
            const hash = window.location.hash
            const params = new URLSearchParams(hash.replace(/^#/, ""))
            const keyFromUrl = params.get("api_key")

            if (keyFromUrl) {
                // Save to storage
                localStorage.setItem("pollinations_api_key", keyFromUrl)
                setApiKey(keyFromUrl)
                // Clear hash to clean up URL
                window.location.hash = ""
            } else {
                // 2. Check localStorage
                const storedKey = localStorage.getItem("pollinations_api_key")
                if (storedKey) {
                    setApiKey(storedKey)
                }
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [])

    const login = () => {
        const redirectUrl = window.location.href
        window.location.href = `https://enter.pollinations.ai/authorize?redirect_url=${encodeURIComponent(
            redirectUrl
        )}`
    }

    const logout = () => {
        localStorage.removeItem("pollinations_api_key")
        setApiKey(null)
    }

    return (
        <AuthContext.Provider value={{ apiKey, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
