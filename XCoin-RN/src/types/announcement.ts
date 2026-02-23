export interface Announcement {
    id: string;
    type: 'banner' | 'popup'; // Pop-up can be added later
    title: Record<string, string>;
    content: Record<string, string>;
    action_url?: string;
    dismissible: boolean;
    show_once: boolean;
}

export interface AnnouncementData {
    announcements: Announcement[];
}

export interface AnnouncementResponse {
    success: boolean;
    data: AnnouncementData;
    meta: {
        updated_at: string;
    };
    error: string | null;
}
