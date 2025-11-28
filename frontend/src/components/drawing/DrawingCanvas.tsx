import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, PanResponder, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { captureRef } from "react-native-view-shot";
import { colors } from "../../config/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_HEIGHT = 400;

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
}

export interface DrawingCanvasRef {
  clear: () => void;
  exportToImage: () => Promise<string>;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  (
    {
      width = SCREEN_WIDTH - 32,
      height = CANVAS_HEIGHT,
      strokeWidth = 4,
      strokeColor = colors.text,
    },
    ref
  ) => {
    const [paths, setPaths] = useState<Array<{ path: string; color: string; width: number }>>([]);
    const [currentPath, setCurrentPath] = useState<string>("");
    const viewRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        setPaths([]);
        setCurrentPath("");
      },
      exportToImage: async () => {
        if (!viewRef.current) {
          throw new Error("Canvas ref not available");
        }

        try {
          const uri = await captureRef(viewRef.current, {
            format: "png",
            quality: 0.9,
            result: "base64",
            snapshotContentContainer: false,
          });

          // Remove data URL prefix if present
          const base64 = uri.includes(",") ? uri.split(",")[1] : uri;
          return base64;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to export canvas: ${errorMessage}. Please try drawing again.`);
        }
      },
    }));

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: (): boolean => true,
        onMoveShouldSetPanResponder: (): boolean => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          setCurrentPath(`M${locationX},${locationY}`);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          setCurrentPath((prev) => `${prev} L${locationX},${locationY}`);
        },
        onPanResponderRelease: () => {
          if (currentPath) {
            setPaths((prev) => [
              ...prev,
              { path: currentPath, color: strokeColor, width: strokeWidth },
            ]);
            setCurrentPath("");
          }
        },
      })
    ).current;

    const svgWidth = typeof width === "number" ? width : Number(width);
    const svgHeight = typeof height === "number" ? height : Number(height);

    return (
      <View
        ref={viewRef}
        style={[styles.container, { width: svgWidth, height: svgHeight }]}
        collapsable={false}
        {...panResponder.panHandlers}
      >
        <Svg 
          width={svgWidth} 
          height={svgHeight} 
          style={styles.svg}
        >
          {paths.map((pathData, index) => (
            <Path
              key={`path-${index}`}
              d={pathData.path}
              stroke={pathData.color}
              strokeWidth={Number(pathData.width)}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
          {currentPath ? (
            <Path
              d={currentPath}
              stroke={strokeColor}
              strokeWidth={Number(strokeWidth)}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}
        </Svg>
      </View>
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  svg: {
    backgroundColor: "transparent",
  },
});
