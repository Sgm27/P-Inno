import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { DrawingCanvas, DrawingCanvasRef } from "../components/drawing/DrawingCanvas";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { SecondaryButton } from "../components/common/SecondaryButton";
import { LoadingOverlay } from "../components/common/LoadingOverlay";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { AnalysisResultList } from "../components/feedback/AnalysisResultList";
import { analyzeImage } from "../api/analyze";
import { Intent } from "../types";
import { colors, spacing, typography } from "../config/theme";

export const DrawingScreen: React.FC = () => {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const handleAnalyzeDrawing = async () => {
    if (!canvasRef.current) {
      setErrorMessage("Canvas không khả dụng");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      const imageBase64 = await canvasRef.current.exportToImage();
      const response = await analyzeImage(imageBase64);
      setIntents(response.intents);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Lỗi khi phân tích nét vẽ. Vui lòng thử lại."
      );
      setIntents([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    setIntents([]);
    setErrorMessage("");
  };

  const handleImagePicker = async () => {
    // Request permissions
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cần quyền truy cập",
          "Ứng dụng cần quyền truy cập thư viện ảnh để tải ảnh."
        );
        return;
      }
    }

    // Show action sheet
    Alert.alert(
      "Chọn ảnh",
      "Bạn muốn chọn ảnh từ đâu?",
      [
        {
          text: "Thư viện",
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
              });

              if (!result.canceled && result.assets[0]) {
                await handleImageAnalysis(result.assets[0].base64 || "");
              }
            } catch (error) {
              setErrorMessage("Lỗi khi chọn ảnh từ thư viện");
            }
          },
        },
        {
          text: "Máy ảnh",
          onPress: async () => {
            try {
              const { status } =
                await ImagePicker.requestCameraPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Cần quyền truy cập",
                  "Ứng dụng cần quyền truy cập máy ảnh để chụp ảnh."
                );
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
              });

              if (!result.canceled && result.assets[0]) {
                await handleImageAnalysis(result.assets[0].base64 || "");
              }
            } catch (error) {
              setErrorMessage("Lỗi khi chụp ảnh");
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleImageAnalysis = async (imageBase64: string) => {
    if (!imageBase64) {
      setErrorMessage("Không có dữ liệu ảnh");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");

    try {
      const response = await analyzeImage(imageBase64);
      setIntents(response.intents);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Lỗi khi phân tích ảnh. Vui lòng thử lại."
      );
      setIntents([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SenseSketch – Nét vẽ của con</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.canvasContainer}>
          <DrawingCanvas ref={canvasRef} />
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Phân tích nét vẽ"
              onPress={handleAnalyzeDrawing}
              disabled={isAnalyzing}
              loading={isAnalyzing}
            />
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              title="Xóa"
              onPress={handleClear}
              disabled={isAnalyzing}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.buttonContainerFull}>
            <SecondaryButton
              title="Tải / Chụp hình"
              onPress={handleImagePicker}
              disabled={isAnalyzing}
            />
          </View>
        </View>

        <ErrorMessage message={errorMessage} />

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Kết quả phân tích:</Text>
          <AnalysisResultList intents={intents} />
        </View>
      </ScrollView>

      {isAnalyzing && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  canvasContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  buttonContainer: {
    flex: 1,
  },
  buttonContainerFull: {
    width: "100%",
  },
  resultsContainer: {
    marginTop: spacing.md,
    flex: 1,
  },
  resultsTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
});



