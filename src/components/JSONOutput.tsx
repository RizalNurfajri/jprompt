import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy, Code2, Download, Braces } from "lucide-react"

interface JSONOutputProps {
    data: string | null
}

export function JSONOutput({ data }: JSONOutputProps) {
    const [copied, setCopied] = useState(false)
    const [isPretty, setIsPretty] = useState(true)

    if (!data) return null

    const renderedData = (() => {
        try {
            const parsed = JSON.parse(data)
            return isPretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
        } catch {
            return data
        }
    })()

    const handleCopy = () => {
        navigator.clipboard.writeText(renderedData)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([renderedData], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "enhanced-prompt.json"
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Card className="w-full max-w-3xl bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 shadow-2xl mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-zinc-800/50">
                <CardTitle className="text-zinc-100 flex items-center gap-3 text-lg font-bold">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                        <Code2 className="h-5 w-5 text-blue-400" />
                    </div>
                    JSON Result
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsPretty((prev) => !prev)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 transition-all font-medium"
                    >
                        <Braces className="mr-2 h-4 w-4" />
                        {isPretty ? "Minify" : "Beautify"}
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDownload}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 transition-all font-medium"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCopy}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 transition-all font-medium"
                    >
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4 text-green-400" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Code
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-hidden">
                    <SyntaxHighlighter
                        language="json"
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            background: "transparent",
                            padding: "2rem",
                            fontSize: "0.95rem",
                            lineHeight: "1.6",
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        }}
                        wrapLines
                    >
                        {renderedData}
                    </SyntaxHighlighter>
                </div>
            </CardContent>
        </Card>
    )
}
