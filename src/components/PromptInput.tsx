import { useState, type KeyboardEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Wand2, Loader2, Clipboard, Eraser } from "lucide-react"

interface PromptInputProps {
    onSubmit: (prompt: string) => void
    isLoading: boolean
    isDisabled: boolean
}

export function PromptInput({ onSubmit, isLoading, isDisabled }: PromptInputProps) {
    const [prompt, setPrompt] = useState("")
    const hasPrompt = !!prompt.trim()

    const handleSubmit = () => {
        if (!hasPrompt) return
        onSubmit(prompt)
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setPrompt((prev) => prev + text)
        } catch (err) {
            console.error("Failed to read clipboard:", err)
        }
    }

    const handleClear = () => {
        setPrompt("")
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            if (!isLoading && !isDisabled && hasPrompt) {
                handleSubmit()
            }
        }
    }

    return (
        <Card className="w-full max-w-3xl bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 shadow-2xl transition-all duration-300 hover:shadow-zinc-900/50 hover:border-zinc-700">
            <CardHeader>
                <CardTitle className="text-zinc-100 text-xl">Your Prompt</CardTitle>
                <CardDescription className="text-zinc-400 text-base">Describe what you want, and I'll convert it into a structured JSON prompt using Qwen Coder.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <Textarea
                        placeholder="e.g. Create a python script that scrapes google search results..."
                        className="relative min-h-[200px] bg-zinc-950/80 border-zinc-800/50 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 text-zinc-100 placeholder:text-zinc-600 resize-none text-lg leading-relaxed p-6 shadow-inner tracking-wide"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isDisabled || isLoading}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                        onClick={handlePaste}
                        title="Paste from clipboard"
                    >
                        <Clipboard className="w-4 h-4 mr-2" />
                        Paste
                    </Button>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                    Tip: press <span className="text-zinc-300">Ctrl/Cmd + Enter</span> to generate faster.
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center py-6 px-6 bg-zinc-900/30 border-t border-zinc-800/50 rounded-b-lg">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-medium px-2">
                        {prompt.length} chars
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClear}
                        disabled={!prompt.length || isLoading}
                        className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50"
                    >
                        <Eraser className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={!hasPrompt || isDisabled || isLoading}
                    size="lg"
                    className="bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-105 active:scale-95 transition-all font-bold shadow-lg shadow-zinc-900/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            Enhance to JSON
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
