import {
    type CameraOptions,
    type ImagePickerResponse,
    type ImageLibraryOptions,
    type PhotoQuality,
} from 'react-native-image-picker';
import Constants, { AppOwnership } from 'expo-constants';

const IMAGE_QUALITY: PhotoQuality = 0.8;

const baseOptions = {
    mediaType: 'photo',
    quality: IMAGE_QUALITY,
    maxWidth: 500,
    maxHeight: 500,
} as const;

const cameraOptions: CameraOptions = { ...baseOptions };
const galleryOptions: ImageLibraryOptions = { ...baseOptions };

let imagePickerModule: typeof import('react-native-image-picker') | null | undefined;
let didWarnUnavailable = false;

function isExpoGo(): boolean {
    return Constants.appOwnership === AppOwnership.Expo;
}

function warnUnavailableOnce(message: string, error?: unknown) {
    if (didWarnUnavailable) {
        return;
    }

    didWarnUnavailable = true;
    console.warn(`[ImagePickerService] ${message}`);
    if (error) {
        console.warn(error);
    }
}

function getImagePickerModule(): typeof import('react-native-image-picker') | null {
    if (imagePickerModule !== undefined) {
        return imagePickerModule;
    }

    if (isExpoGo()) {
        imagePickerModule = null;
        warnUnavailableOnce('Skipped in Expo Go. Use a development build for camera and gallery access.');
        return null;
    }

    try {
        imagePickerModule = require('react-native-image-picker') as typeof import('react-native-image-picker');
        return imagePickerModule;
    } catch (error) {
        imagePickerModule = null;
        warnUnavailableOnce('Native image picker module is not available.', error);
        return null;
    }
}

function getCancelledResponse(): ImagePickerResponse {
    return { didCancel: true };
}

export const openCamera = async () => {
    const picker = getImagePickerModule();
    if (!picker) {
        return getCancelledResponse();
    }

    return picker.launchCamera(cameraOptions);
};

export const openGallery = async () => {
    const picker = getImagePickerModule();
    if (!picker) {
        return getCancelledResponse();
    }

    return picker.launchImageLibrary(galleryOptions);
};
