import { LucideIcon } from 'lucide-react-native';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { PressableScale } from '@/components/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

interface ActivityRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  amount?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ActivityRow({
  icon: Icon,
  title,
  subtitle,
  amount,
  onPress,
  style,
}: ActivityRowProps) {
  const { theme } = useTheme();

  const content = (
    <>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: theme.colors.primaryMuted,
            borderRadius: theme.radii.md,
          },
        ]}
      >
        <Icon size={18} color={theme.colors.primary} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text variant="body" style={{ fontWeight: '500' }}>{title}</Text>
        <Text variant="caption" color="muted" style={{ marginTop: 2 }}>{subtitle}</Text>
      </View>
      {amount ? (
        <Text variant="bodySmall" style={{ fontWeight: '600' }}>{amount}</Text>
      ) : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, style]}>{content}</View>;
  }

  return (
    <PressableScale onPress={onPress} style={[styles.row, style]}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});
