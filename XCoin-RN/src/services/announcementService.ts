import { ENDPOINTS } from '../api/endpoints';
import { configGetData } from '../api/configClient';
import { AnnouncementData, Announcement } from '../types/announcement';

export async function getAnnouncements(): Promise<Announcement[]> {
    try {
        const data = await configGetData<AnnouncementData>(ENDPOINTS.ANNOUNCEMENTS);
        return data.announcements ?? [];
    } catch {
        return [];
    }
}
