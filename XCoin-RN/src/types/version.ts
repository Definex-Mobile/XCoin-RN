export interface VersionData {
    platform: "ios" | "android";
    min_version: string;
    recommended_version: string;
    latest_version: string;
    store_url: string;
    release_notes: Record<string, string>;
}

export interface VersionResponse {
    success: boolean;
    data: VersionData;
    meta: {
        hash: string;
        updated_at: string;
    };
    error: string | null;
}
