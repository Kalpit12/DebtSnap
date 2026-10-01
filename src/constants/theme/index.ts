import { darkColors, lightColors, ThemeColors } from './colors';
import { spacing, radii, iconSizes, buttonHeights, inputHeight, screenPadding } from './spacing';
import { typography } from './typography';

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  iconSizes: typeof iconSizes;
  buttonHeights: typeof buttonHeights;
  inputHeight: number;
  screenPadding: number;
  typography: typeof typography;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radii,
  iconSizes,
  buttonHeights,
  inputHeight,
  screenPadding,
  typography,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radii,
  iconSizes,
  buttonHeights,
  inputHeight,
  screenPadding,
  typography,
  isDark: true,
};

export type ThemeMode = 'light' | 'dark' | 'system';

export { lightColors, darkColors, typography, spacing, radii, iconSizes, buttonHeights, inputHeight, screenPadding };
