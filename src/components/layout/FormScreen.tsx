import { ReactNode } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CLEARANCE } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/useTheme';

interface FormScreenProps {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  tabBarClearance?: boolean;
}

export function FormScreen({ children, contentContainerStyle, tabBarClearance = false }: FormScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        {
          paddingTop: insets.top + theme.spacing.sm,
          paddingBottom: insets.bottom + theme.spacing['3xl'] + (tabBarClearance ? TAB_BAR_CLEARANCE : 0),
          paddingHorizontal: theme.screenPadding,
          flexGrow: 1,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
