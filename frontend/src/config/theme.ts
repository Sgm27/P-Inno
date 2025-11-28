export const colors = {
  primary: "#4A90E2",
  primaryDark: "#357ABD",
  secondary: "#7B8D93",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  text: "#2C3E50",
  textLight: "#7B8D93",
  error: "#E74C3C",
  success: "#27AE60",
  border: "#E1E8ED",
  category: {
    need: "#E8F5E9",
    emotion: "#FFF3E0",
    object: "#E3F2FD",
    activity: "#F3E5F5",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textLight,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.textLight,
  },
};



