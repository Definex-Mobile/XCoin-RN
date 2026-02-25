export interface ThemeScheme {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
}

export interface ThemeColors {
    id: string;
    name: string;
    light_scheme: ThemeScheme;
    dark_scheme: ThemeScheme;
}

export interface ThemeResponse {
    success: boolean;
    data: {
        default_theme: ThemeColors;
        scheduled_themes: any[];
    };
    meta: {
        hash: string;
        updated_at: string;
    };
    error: any;
}
