import { useState } from "react"
import { AuthProvider, useAuth } from "@/auth/AuthContext"
import { LoginButton } from "@/components/LoginButton"
import { PromptInput } from "@/components/PromptInput"
import { JSONOutput } from "@/components/JSONOutput"
import { Toaster } from "@/components/ui/toast"
import { chatCompletion } from "@/lib/pollinations"
import { toast } from "sonner"


function AppContent() {
  const { apiKey, isLoading: isAuthLoading } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [jsonOutput, setJsonOutput] = useState<string | null>(null)

  const handleGenerate = async (prompt: string) => {
    if (!apiKey) {
      toast.error("Please connect with Pollinations first!")
      return
    }

    setIsGenerating(true)
    setJsonOutput(null)

    try {
      // Construct the prompt for the AI
      const messages = [
        {
          role: "system" as const,
          content: `You are a helpful assistant that converts natural language prompts into structured JSON objects. 
          Your output must be valid JSON only, without markdown code blocks or explanations.
          The user will describe a prompt or a task. You should enhance it and return a JSON object with at least a "prompt" field, and potentially other relevant fields like "negative_prompt", "parameters", "model_suggestion", etc., depending on the context.
          If the user input is vague, get creative but keep it structured.`
        },
        {
          role: "user" as const,
          content: prompt
        }
      ]

      const result = await chatCompletion(messages, apiKey, "qwen-coder")

      // Clean up result if it contains markdown code blocks
      let cleanResult = result.trim()
      if (cleanResult.startsWith("```json")) {
        cleanResult = cleanResult.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanResult.startsWith("```")) {
        cleanResult = cleanResult.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      setJsonOutput(cleanResult)
      toast.success("Prompt enhanced successfully!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to generate JSON")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center relative overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950"></div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/50 transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="JP Logo" className="h-10 w-auto object-contain" />

          </div>
          <div className="flex items-center gap-4">
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl px-4 sm:px-6 py-10 pt-28 sm:pt-32 flex flex-col items-center gap-8 z-10">
        <div className="text-center space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-7xl font-extrabold tracking-in text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-sm">
            Turn Thoughts <br className="hidden md:block" /> into JSON
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Generate complex, structured prompt configurations for your AI workflows using the power of Qwen Coder.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-zinc-300">
            <span className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1">1. Tulis prompt</span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1">2. Generate JSON</span>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1">3. Copy / Download</span>
          </div>
        </div>

        <PromptInput
          onSubmit={handleGenerate}
          isLoading={isGenerating}
          isDisabled={isAuthLoading || !apiKey}
        />

        {!apiKey && !isAuthLoading && (
          <div className="mt-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm">
            Please connect your Pollinations account to start generating. Use your own credits (Pollens).
          </div>
        )}

        <JSONOutput data={jsonOutput} />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-zinc-600 text-sm z-10">
        <p>Powered by Pollinations.ai & Qwen Coder</p>
      </footer>

      <Toaster />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
