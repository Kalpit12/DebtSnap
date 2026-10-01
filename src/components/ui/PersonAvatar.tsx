import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

interface PersonAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const SIZES = {
  sm: { box: 36, text: 'caption' as const },
  md: { box: 44, text: 'bodySmall' as const },
  lg: { box: 52, text: 'body' as const },
};

export function PersonAvatar({ name, size = 'md', style }: PersonAvatarProps) {
  const { theme } = useTheme();
  const config = SIZES[size];

  return (
    <View
      style={[
        styles.avatar,
        {
          width: config.box,
          height: config.box,
          borderRadius: config.box / 2,
          backgroundColor: theme.colors.primaryMuted,
          borderColor: theme.isDark ? theme.colors.border : 'transparent',
        },
        style,
      ]}
    >
      <Text variant={config.text} color="primary" style={styles.initials}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  initials: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
