import { CONFIG_API_BASE_URL, CONFIG_API_KEY, ENDPOINTS } from '../api/endpoints';
import { logRequest, logResponse, logError } from '../api/logger';
import { AnnouncementResponse, Announcement } from '../types/announcement';

export async function getAnnouncements(): Promise<Announcement[]> {
    const url = `${CONFIG_API_BASE_URL}${ENDPOINTS.ANNOUNCEMENTS}`;
    const requestId = Math.random().toString(16).slice(2);
    const startTime = Date.now();

    logRequest({ id: requestId, method: 'GET', url });

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'X-API-Key': CONFIG_API_KEY },
        });

        const durationMs = Date.now() - startTime;
        const responseText = await response.text();

        logResponse({
            id: requestId,
            method: 'GET',
            url,
            status: response.status,
            durationMs,
            bodySnippet: responseText,
        });

        if (!response.ok) {
            return [];
        }

        let json: AnnouncementResponse;
        try {
            json = JSON.parse(responseText);
        } catch {
            return [];
        }

        if (!json.success || !json.data || !json.data.announcements) {
            return [];
        }

        return json.data.announcements;
    } catch (error) {
        const durationMs = Date.now() - startTime;
        logError({
            id: requestId,
            method: 'GET',
            url,
            durationMs,
            error: (error as Error)?.message ?? 'Unknown error',
        });
        return [];
    }
}
