import { ENDPOINTS } from '../api/endpoints';
import { configGetData } from '../api/configClient';
import { MaintenanceData } from '../types/maintenance';

export interface MaintenanceCheckResult {
    isActive: boolean;
    title: Record<string, string>;
    message: Record<string, string>;
    estimatedEnd: string | null;
}

const MAINTENANCE_FALLBACK: MaintenanceCheckResult = {
    isActive: false,
    title: {},
    message: {},
    estimatedEnd: null,
};

export async function checkMaintenanceStatus(): Promise<MaintenanceCheckResult> {
    try {
        const data = await configGetData<MaintenanceData>(ENDPOINTS.MAINTENANCE_CONFIG);

        return {
            isActive: data.is_active,
            title: data.title,
            message: data.message,
            estimatedEnd: data.estimated_end
        };
    } catch {
        return MAINTENANCE_FALLBACK;
    }
}
