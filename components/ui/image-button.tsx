import React from "react";
import {TouchableOpacity, Image, StyleSheet, ImageSourcePropType, ViewStyle, ImageStyle} from "react-native";

export type ImageButtonProps = {
    handlePress?: () => void;
    source: ImageSourcePropType | number; // Accept require() result or number
    width?: number;
    height?: number;
    imageStyle?: ImageStyle; // Style for the image
    buttonStyle?: ViewStyle; // Style for the button container
    tintColor?: string; // Tint color for the image
};

export default function ImageButton({ imageStyle, buttonStyle, source, handlePress, width = 26, height = 26, tintColor}: ImageButtonProps) {
    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[
                styles.button,
                { width, height }, // Apply width/height dynamically
                buttonStyle
            ]}
        >
            <Image
                source={source}
                style={[styles.image, imageStyle, tintColor ? { tintColor } : undefined]}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
});