import * as Haptics from 'expo-haptics';
import {
  ChartNoAxesCombined,
  House,
  Plus,
  Settings,
  Users,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/motion';
import { useTheme } from '@/hooks/useTheme';

import { Text } from '../ui/Text';

const TAB_CONFIG: Record<
  string,
  { label: string; icon: typeof House; isAdd?: boolean }
> = {
  index: { label: 'Home', icon: House },
  people: { label: 'People', icon: Users },
  add: { label: 'Add', icon: Plus, isAdd: true },
  insights: { label: 'Insights', icon: ChartNoAxesCombined },
  settings: { label: 'Settings', icon: Settings },
};

interface TabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string }>;
  };
  descriptors: Record<string, { options: { title?: string } }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
}

function AddTabButton({ onPress, label }: { onPress: () => void; label: string }) {
  const { theme } = useTheme();

  return (
    <PressableScale
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      accessibilityLabel={label}
      scaleTo={0.94}
      style={[
        styles.addButton,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radii.pill,
          shadowColor: theme.colors.primary,
        },
      ]}
    >
      <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
    </PressableScale>
  );
}

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.outer,
        {
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
          paddingHorizontal: theme.spacing.md,
          backgroundColor: 'transparent',
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.tabBar,
            borderColor: theme.colors.tabBarBorder,
            borderRadius: theme.radii.xl,
            shadowColor: theme.isDark ? '#000000' : theme.colors.primaryDark,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.title ?? config.label;
          const Icon = config.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          if (config.isAdd) {
            return <AddTabButton key={route.key} onPress={onPress} label={label} />;
          }

          const color = isFocused ? theme.colors.primary : theme.colors.mutedText;

          return (
            <PressableScale
              key={route.key}
              onPress={onPress}
              accessibilityLabel={label}
              style={styles.tab}
            >
              <View
                style={[
                  styles.iconWrap,
                  isFocused && {
                    backgroundColor: theme.colors.primaryMuted,
                    borderRadius: theme.radii.md,
                  },
                ]}
              >
                <Icon size={20} color={color} strokeWidth={isFocused ? 2.25 : 2} />
              </View>
              <Text
                variant="caption"
                style={{
                  color,
                  marginTop: 2,
                  fontWeight: isFocused ? '600' : '400',
                }}
              >
                {label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginTop: -20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
