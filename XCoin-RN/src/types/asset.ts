export interface AssetData {
    assets: {
        img_welcome_card?: string;
        img_refer_card?: string;
        img_like_card?: string;
        [key: string]: string | undefined;
    };
}

export interface AssetResponse {
    success: boolean;
    data: AssetData;
    meta: {
        hash: string;
        updated_at: string;
    };
    error: string | null;
}
