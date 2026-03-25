import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useColorScheme, View, ActivityIndicator } from "react-native";
import { vars } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeService } from "../services/themeService";
import { ThemeColors, ThemeScheme } from "../types/theme";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
    theme: ThemeColors | null;
    isLoading: boolean;
    error: Error | null;
    activeScheme: ThemeScheme | null;
    themePreference: ThemePreference;
    setThemePreference: (pref: ThemePreference) => void;
}

const THEME_PREF_KEY = "@theme_preference";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeColors | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [themePreference, setThemePreference] = useState<ThemePreference>("system");
    const systemColorScheme = useColorScheme();

    useEffect(() => {
        const loadThemeAndPref = async () => {
            try {
                setIsLoading(true);

                // Load preference
                const savedPref = await AsyncStorage.getItem(THEME_PREF_KEY);
                if (savedPref) {
                    setThemePreference(savedPref as ThemePreference);
                }

                const themeData = await ThemeService.fetchTheme();
                setTheme(themeData.default_theme);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to initialize theme"));
            } finally {
                setIsLoading(false);
            }
        };

        loadThemeAndPref();
    }, []);

    const updateThemePreference = async (pref: ThemePreference) => {
        setThemePreference(pref);
        try {
            await AsyncStorage.setItem(THEME_PREF_KEY, pref);
        } catch (err) {
            console.error("Failed to save theme preference:", err);
        }
    };

    const activeScheme = useMemo(() => {
        if (!theme) return null;

        const effectiveScheme = themePreference === "system"
            ? systemColorScheme
            : themePreference;

        return effectiveScheme === "dark" ? theme.dark_scheme : theme.light_scheme;
    }, [theme, themePreference, systemColorScheme]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0066FF" />
            </View>
        );
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            isLoading,
            error,
            activeScheme,
            themePreference,
            setThemePreference: updateThemePreference
        }}>
            <View style={[{ flex: 1 }, getThemeVars(activeScheme)]}>
                {children}
            </View>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const getThemeVars = (activeScheme: ThemeScheme | null) => {
    if (!activeScheme) return {};
    return vars({
        "--primary": activeScheme.primary,
        "--on-primary": activeScheme.onPrimary,
        "--primary-container": activeScheme.primaryContainer,
        "--on-primary-container": activeScheme.onPrimaryContainer,
        "--secondary": activeScheme.secondary,
        "--on-secondary": activeScheme.onSecondary,
        "--secondary-container": activeScheme.secondaryContainer,
        "--on-secondary-container": activeScheme.onSecondaryContainer,
        "--tertiary": activeScheme.tertiary,
        "--on-tertiary": activeScheme.onTertiary,
        "--tertiary-container": activeScheme.tertiaryContainer,
        "--on-tertiary-container": activeScheme.onTertiaryContainer,
        "--error": activeScheme.error,
        "--on-error": activeScheme.onError,
        "--error-container": activeScheme.errorContainer,
        "--on-error-container": activeScheme.onErrorContainer,
        "--background": activeScheme.background,
        "--on-background": activeScheme.onBackground,
        "--surface": activeScheme.surface,
        "--on-surface": activeScheme.onSurface,
        "--surface-variant": activeScheme.surfaceVariant,
        "--on-surface-variant": activeScheme.onSurfaceVariant,
        "--outline": activeScheme.outline,
        "--outline-variant": activeScheme.outlineVariant,
        "--shadow": activeScheme.shadow,
        "--scrim": activeScheme.scrim,
        "--inverse-surface": activeScheme.inverseSurface,
        "--inverse-on-surface": activeScheme.inverseOnSurface,
        "--inverse-primary": activeScheme.inversePrimary,
    });
}
