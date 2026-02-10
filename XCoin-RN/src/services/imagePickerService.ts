import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';

const options = {
    mediaType: 'photo' as MediaType,
    quality: 0.8,
    maxWidth: 500,
    maxHeight: 500,
};

export const openCamera = () => launchCamera(options);
export const openGallery = () => launchImageLibrary(options);
