import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

export const TAB_BAR_CLEARANCE = 24;

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tabBarClearance?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  tabBarClearance = false,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: padded ? theme.screenPadding : 0,
    },
    style,
  ];

  if (scroll) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={[
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + theme.spacing.xl + (tabBarClearance ? TAB_BAR_CLEARANCE : 0),
            paddingHorizontal: padded ? theme.screenPadding : 0,
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
