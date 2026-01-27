import React from 'react';
import { Image, ImageSourcePropType, StyleProp, ImageStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

export interface SmartImageProps {
    uri?: string | null;
    fallback: ImageSourcePropType;
    style?: StyleProp<ImageStyle>;
    className?: string;
    width?: number;
    height?: number;
}

const isSvg = (uri: string): boolean => {
    return uri.toLowerCase().endsWith('.svg');
};

export const SmartImage: React.FC<SmartImageProps> = ({
    uri,
    fallback,
    style,
    className,
    width,
    height,
}) => {
    const trimmedUri = uri?.trim();
    if (!trimmedUri || trimmedUri.length === 0) {
        return <Image source={fallback} style={style} className={className} />;
    }

    if (isSvg(trimmedUri)) {
        return (
            <SvgUri
                uri={trimmedUri}
                width={width || '100%'}
                height={height || '100%'}
                style={style}
            />
        );
    }

    return (
        <Image
            source={{ uri: trimmedUri }}
            style={style}
            className={className}
            resizeMode="cover"
        />
    );
};
