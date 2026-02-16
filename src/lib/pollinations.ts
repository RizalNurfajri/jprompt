export interface Message {
    role: "system" | "user" | "assistant"
    content: string
}

export interface ChatCompletionResponse {
    choices: {
        message: {
            content: string
        }
    }[]
}

const POLLINATIONS_API_URL = "https://gen.pollinations.ai/v1/chat/completions"

export async function chatCompletion(
    messages: Message[],
    apiKey: string,
    model: string = "qwen-coder"
): Promise<string> {
    if (!apiKey) {
        throw new Error("API Key is required")
    }

    const response = await fetch(POLLINATIONS_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages,
            stream: false,
        }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
            errorData.error?.message || `API Error: ${response.statusText}`
        )
    }

    const data: ChatCompletionResponse = await response.json()
    return data.choices[0]?.message?.content || ""
}
