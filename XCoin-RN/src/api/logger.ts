type LogRequestParams = {
    id: string
    method: string
    url: string
}

type LogResponseParams = {
    id: string
    method: string
    url: string
    status: number
    durationMs: number
    bodySnippet: string
}

type LogErrorParams = {
    id: string
    method: string
    url: string
    durationMs: number
    error: string
}

function truncateBody(body: string, maxLength = 2000): string {
    if (body.length <= maxLength) {
        return body
    }
    return body.substring(0, maxLength) + "...(truncated)"
}

export function logRequest({ id, method, url }: LogRequestParams): void {
    if (!__DEV__) return

    console.log(`🚀 [${id}] ${method} ${url}`)
}

export function logResponse({ id, method, url, status, durationMs, bodySnippet }: LogResponseParams): void {
    if (!__DEV__) return

    const truncated = truncateBody(bodySnippet)
    console.log(`✅ [${id}] ${method} ${url} → ${status} (${durationMs}ms) ${truncated}`)
}

export function logError({ id, method, url, durationMs, error }: LogErrorParams): void {
    if (!__DEV__) return

    console.log(`❌ [${id}] ${method} ${url} → ERROR (${durationMs}ms) ${error}`)
}
