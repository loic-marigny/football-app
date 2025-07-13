import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View } from 'react-native';

interface SafeImageProps extends ImageProps {
  fallbackIcon?: string;
  fallbackSize?: number;
  fallbackColor?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  source,
  style,
  fallbackIcon = 'image-outline',
  fallbackSize = 24,
  fallbackColor = '#999',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (error: any) => {
    console.error('Image load error', error);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Ionicons 
          name={fallbackIcon as any} 
          size={fallbackSize} 
          color={fallbackColor} 
        />
      </View>
    );
  }

  return (
    <Image
      {...props}
      source={source}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
}); 