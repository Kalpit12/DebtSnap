import { ChevronRight } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { PressableScale } from '@/components/motion';
import { useTheme } from '@/hooks/useTheme';

import { PersonAvatar } from './PersonAvatar';
import { Text } from './Text';

interface ListRowProps {
  title: string;
  subtitle?: string;
  value?: string;
  valueColor?: 'primary' | 'success' | 'danger' | 'muted';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  avatarName?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function ListRow({
  title,
  subtitle,
  value,
  valueColor = 'muted',
  onPress,
  style,
  avatarName,
  leading,
  trailing,
}: ListRowProps) {
  const { theme } = useTheme();

  const content = (
    <>
      {avatarName ? <PersonAvatar name={avatarName} size="sm" /> : null}
      {leading}
      <View style={styles.content}>
        <Text variant="body" style={{ fontWeight: '500' }}>{title}</Text>
        {subtitle ? (
          <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        {value ? (
          <Text variant="bodySmall" color={valueColor} style={{ fontWeight: '600' }}>
            {value}
          </Text>
        ) : null}
        {trailing}
        {onPress ? (
          <ChevronRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
        ) : null}
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.row, { paddingVertical: theme.spacing.md }, style]}>
        {content}
      </View>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      style={[styles.row, { paddingVertical: theme.spacing.md }, style]}
    >
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
  },
  content: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
