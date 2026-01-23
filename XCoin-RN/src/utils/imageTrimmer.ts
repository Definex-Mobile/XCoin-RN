export function trimImageUrl(url?: string): string | undefined {
    if (!url) return undefined
    const trimmedUrl = url.trim()

    if (trimmedUrl.startsWith("https://www.google.com/url?")) {
        try {
            const urlObj = new URL(trimmedUrl)
            const actualUrl = urlObj.searchParams.get("url")
            return actualUrl ? actualUrl.trim() : undefined
        } catch {
            return undefined
        }
    }

    return trimmedUrl
}
