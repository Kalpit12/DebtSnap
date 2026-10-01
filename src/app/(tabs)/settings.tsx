import {
  Bell,
  ChevronRight,
  Database,
  DollarSign,
  FileText,
  Info,
  Moon,
  Shield,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Platform, Share, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PressableScale } from '@/components/motion';
import { Card, Divider, Screen, Text } from '@/components/ui';
import { CURRENCIES, getCurrencyLabel } from '@/constants/currencies';
import { STAGGER, TIMING_NORMAL } from '@/constants/motion';
import { useAppData } from '@/hooks/useAppData';
import { useTheme } from '@/hooks/useTheme';

interface SettingsRow {
  icon: LucideIcon;
  label: string;
  description?: string;
  value?: string;
  interactive?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

interface SettingsSection {
  title: string;
  rows: SettingsRow[];
}

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { currency, setCurrency, exportData } = useAppData();
  const [exporting, setExporting] = useState(false);

  const themeLabel =
    themeMode === 'light' ? 'Light' : themeMode === 'dark' ? 'Dark' : 'System';

  const handleThemePress = () => {
    Alert.alert('Appearance', 'Choose a theme', [
      { text: 'System', onPress: () => setThemeMode('system') },
      { text: 'Light', onPress: () => setThemeMode('light') },
      { text: 'Dark', onPress: () => setThemeMode('dark') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCurrencyPress = () => {
    Alert.alert(
      'Currency',
      'Choose your display currency',
      [
        ...CURRENCIES.map((item) => ({
          text: getCurrencyLabel(item.code),
          onPress: () => setCurrency(item.code),
        })),
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const json = await exportData();

      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `debtsnap-export-${new Date().toISOString().split('T')[0]}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
        Alert.alert('Export ready', 'Your data file has been downloaded.');
      } else {
        await Share.share({
          message: json,
          title: 'DebtSnap Export',
        });
      }
    } catch {
      Alert.alert('Export failed', 'Could not export your data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const SECTIONS: SettingsSection[] = [
    {
      title: 'Appearance',
      rows: [
        {
          icon: Moon,
          label: 'Theme',
          description: 'System, light, or dark',
          value: themeLabel,
          interactive: true,
          onPress: handleThemePress,
        },
      ],
    },
    {
      title: 'Currency',
      rows: [
        {
          icon: DollarSign,
          label: 'Display currency',
          description: 'How amounts are shown',
          value: currency,
          interactive: true,
          onPress: handleCurrencyPress,
        },
      ],
    },
    {
      title: 'Notifications',
      rows: [
        {
          icon: Bell,
          label: 'Reminders',
          description: 'Payment reminders',
          value: 'Coming soon',
        },
      ],
    },
    {
      title: 'Security',
      rows: [
        {
          icon: Shield,
          label: 'App lock',
          description: 'Protect with biometrics',
          value: 'Coming soon',
        },
      ],
    },
    {
      title: 'Data',
      rows: [
        {
          icon: Database,
          label: 'Export data',
          description: 'Download your local data',
          value: exporting ? 'Exporting...' : undefined,
          interactive: !exporting,
          loading: exporting,
          onPress: handleExport,
        },
      ],
    },
    {
      title: 'About',
      rows: [
        { icon: Info, label: 'DebtSnap', description: 'Never forget who owes you.', value: 'v1.0.0' },
        { icon: FileText, label: 'Privacy', value: 'Coming soon' },
        { icon: FileText, label: 'Terms', value: 'Coming soon' },
      ],
    },
  ];

  return (
    <Screen scroll tabBarClearance>
      <Animated.View
        entering={FadeInDown.duration(TIMING_NORMAL.duration!)}
        style={[styles.header, { marginBottom: theme.spacing.xl }]}
      >
        <Text variant="h1">Settings</Text>
        <Text variant="body" color="muted" style={{ marginTop: theme.spacing.xs }}>
          Never forget who owes you.
        </Text>
      </Animated.View>

      {SECTIONS.map((section, sectionIndex) => (
        <Animated.View
          key={section.title}
          entering={FadeInDown.duration(TIMING_NORMAL.duration!).delay(
            STAGGER.sm + sectionIndex * STAGGER.xs,
          )}
          style={{ marginBottom: theme.spacing.lg }}
        >
          <Text
            variant="label"
            color="muted"
            style={[styles.sectionTitle, { marginBottom: theme.spacing.sm }]}
          >
            {section.title}
          </Text>

          <Card padded={false} level="elevated">
            {section.rows.map((row, rowIndex) => (
              <View key={row.label}>
                <PressableScale
                  disabled={!row.interactive || row.loading}
                  onPress={row.onPress}
                  style={[
                    styles.row,
                    {
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: theme.spacing.md,
                      opacity: row.interactive || row.value === 'Coming soon' ? 1 : 0.95,
                    },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: theme.colors.primaryMuted,
                          borderRadius: theme.radii.md,
                        },
                      ]}
                    >
                      <row.icon
                        size={theme.iconSizes.sm}
                        color={theme.colors.primary}
                        strokeWidth={2}
                      />
                    </View>
                    <View style={styles.textBlock}>
                      <Text variant="body" style={{ fontWeight: '500' }}>{row.label}</Text>
                      {row.description ? (
                        <Text variant="caption" color="muted" style={{ marginTop: 2 }}>
                          {row.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.rowRight}>
                    {row.value ? (
                      <Text variant="bodySmall" color="muted">{row.value}</Text>
                    ) : null}
                    {row.interactive ? (
                      <ChevronRight size={16} color={theme.colors.mutedText} strokeWidth={2} />
                    ) : null}
                  </View>
                </PressableScale>

                {rowIndex < section.rows.length - 1 ? (
                  <Divider inset={theme.spacing.md + 44} />
                ) : null}
              </View>
            ))}
          </Card>
        </Animated.View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  textBlock: {
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
