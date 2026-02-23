import { CONFIG_API_BASE_URL, CONFIG_API_KEY, ENDPOINTS } from '../api/endpoints';
import { logRequest, logResponse, logError } from '../api/logger';
import { MaintenanceResponse, MaintenanceData } from '../types/maintenance';

export interface MaintenanceCheckResult {
    isActive: boolean;
    title: Record<string, string>;
    message: Record<string, string>;
    estimatedEnd: string | null;
}

export async function checkMaintenanceStatus(): Promise<MaintenanceCheckResult> {
    const url = `${CONFIG_API_BASE_URL}${ENDPOINTS.MAINTENANCE_CONFIG}`;
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
            return { isActive: false, title: {}, message: {}, estimatedEnd: null };
        }

        let json: MaintenanceResponse;
        try {
            json = JSON.parse(responseText);
        } catch {
            return { isActive: false, title: {}, message: {}, estimatedEnd: null };
        }

        if (!json.success || !json.data) {
            return { isActive: false, title: {}, message: {}, estimatedEnd: null };
        }

        const data = json.data;

        return {
            isActive: data.is_active,
            title: data.title,
            message: data.message,
            estimatedEnd: data.estimated_end
        };
    } catch (error) {
        const durationMs = Date.now() - startTime;
        logError({
            id: requestId,
            method: 'GET',
            url,
            durationMs,
            error: (error as Error)?.message ?? 'Unknown error',
        });
        return { isActive: false, title: {}, message: {}, estimatedEnd: null };
    }
}
