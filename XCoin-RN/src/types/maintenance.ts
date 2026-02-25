export interface MaintenanceData {
    is_active: boolean;
    title: Record<string, string>;
    message: Record<string, string>;
    estimated_end: string | null;
}

export interface MaintenanceResponse {
    success: boolean;
    data: MaintenanceData;
    meta: {
        hash: string;
        updated_at: string;
    };
    error: string | null;
}
