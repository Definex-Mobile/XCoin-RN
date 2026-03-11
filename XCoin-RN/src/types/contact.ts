export interface ContactSocial {
    twitter: string;
    instagram: string;
    facebook: string;
}

export interface ContactWorkingHours {
    ar: string;
    en: string;
    tr: string;
}

export interface ContactData {
    phone: string;
    whatsapp: string;
    email: string;
    social: ContactSocial;
    working_hours: ContactWorkingHours;
}

export interface ContactResponse {
    success: boolean;
    data: ContactData;
    meta: {
        hash: string;
        updated_at: string;
    };
    error: string | null;
}
