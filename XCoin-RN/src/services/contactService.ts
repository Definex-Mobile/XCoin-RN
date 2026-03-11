import { ENDPOINTS } from '../api/endpoints';
import { configGetData } from '../api/configClient';
import { ContactData } from '../types/contact';

/**
 * Fetches contact information from the backend.
 * Uses the config API with the provided base URL and API key.
 */
export async function getContactInfo(): Promise<ContactData | null> {
    try {
        return await configGetData<ContactData>(ENDPOINTS.CONTACT_CONFIG);
    } catch {
        return null;
    }
}
