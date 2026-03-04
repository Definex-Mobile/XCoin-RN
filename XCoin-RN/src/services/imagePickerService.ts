import {
    launchCamera,
    launchImageLibrary,
    type CameraOptions,
    type ImageLibraryOptions,
    type PhotoQuality,
} from 'react-native-image-picker';

const IMAGE_QUALITY: PhotoQuality = 0.8;

const baseOptions = {
    mediaType: 'photo',
    quality: IMAGE_QUALITY,
    maxWidth: 500,
    maxHeight: 500,
} as const;

const cameraOptions: CameraOptions = { ...baseOptions };
const galleryOptions: ImageLibraryOptions = { ...baseOptions };

export const openCamera = () => launchCamera(cameraOptions);
export const openGallery = () => launchImageLibrary(galleryOptions);
