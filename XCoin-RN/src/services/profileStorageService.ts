import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_IMAGE_KEY = 'profile_image_uri';

export const saveProfileImage = async (uri: string): Promise<void> => {
    await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
};

export const getProfileImage = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
};
