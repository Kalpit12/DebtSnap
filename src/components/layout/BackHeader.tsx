import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

interface BackHeaderProps {
  title?: string;
  onBack?: () => void;
  style?: ViewStyle;
}

export function BackHeader({ title, onBack, style }: BackHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <View style={[styles.row, { marginBottom: theme.spacing.lg }, style]}>
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [
          styles.backButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ChevronLeft size={20} color={theme.colors.text} strokeWidth={2} />
      </Pressable>
      {title ? <Text variant="h2" style={{ flex: 1 }}>{title}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
