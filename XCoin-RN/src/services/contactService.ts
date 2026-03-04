import { CONFIG_API_BASE_URL, CONFIG_API_KEY, ENDPOINTS } from '../api/endpoints';
import { ContactResponse, ContactData } from '../types/contact';

/**
 * Fetches contact information from the backend.
 * Uses the config API with the provided base URL and API key.
 */
export async function getContactInfo(): Promise<ContactData | null> {
    const url = `${CONFIG_API_BASE_URL}${ENDPOINTS.CONTACT_CONFIG}`;
    try {
        console.log(`[ContactService] Fetching contact from: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-Key': CONFIG_API_KEY,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`[ContactService] Failed with status: ${response.status}`);
            return null;
        }

        const json: ContactResponse = await response.json();
        if (json.success && json.data) {
            return json.data;
        }

        console.error('[ContactService] Response success is false or data is missing');
        return null;
    } catch (error) {
        console.error('[ContactService] Error fetching contact info:', error);
        return null;
    }
}
