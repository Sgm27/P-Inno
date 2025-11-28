import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Intent } from "../../types";
import { colors, spacing, typography } from "../../config/theme";

interface AnalysisResultListProps {
  intents: Intent[];
}

export const AnalysisResultList: React.FC<AnalysisResultListProps> = ({
  intents,
}) => {
  if (intents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Chưa có kết quả phân tích. Vẽ hoặc tải ảnh để bắt đầu.
        </Text>
      </View>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "need":
        return colors.category.need;
      case "emotion":
        return colors.category.emotion;
      case "object":
        return colors.category.object;
      case "activity":
        return colors.category.activity;
      default:
        return colors.category.object;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category.toLowerCase()) {
      case "need":
        return "Nhu cầu";
      case "emotion":
        return "Cảm xúc";
      case "object":
        return "Đồ vật";
      case "activity":
        return "Hoạt động";
      default:
        return category;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {intents.map((intent, index) => (
        <View key={index} style={styles.intentCard}>
          <View style={styles.header}>
            <Text style={styles.label}>{intent.label}</Text>
            <View
              style={[
                styles.categoryTag,
                { backgroundColor: getCategoryColor(intent.category) },
              ]}
            >
              <Text style={styles.categoryText}>
                {getCategoryLabel(intent.category)}
              </Text>
            </View>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Độ tin cậy:</Text>
            <Text style={styles.confidenceValue}>
              {Math.round(intent.confidence * 100)}%
            </Text>
          </View>
          <Text style={styles.reasoning}>{intent.reasoning}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: "center",
  },
  intentCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.h2,
    flex: 1,
    marginRight: spacing.sm,
  },
  categoryTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  confidenceLabel: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginRight: spacing.xs,
  },
  confidenceValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
  reasoning: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
  },
});



