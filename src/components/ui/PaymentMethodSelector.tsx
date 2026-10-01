import {
  Banknote,
  Building2,
  CreditCard,
  LucideIcon,
  Smartphone,
  Wallet,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { PressableScale } from '@/components/motion';
import { TIMING_FAST } from '@/constants/motion';
import { PAYMENT_METHODS } from '@/constants/payments';
import type { PaymentMethod } from '@/types/payment';
import { useTheme } from '@/hooks/useTheme';

import { Text } from './Text';

const METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  CASH: Banknote,
  MPESA: Smartphone,
  BANK: Building2,
  CARD: CreditCard,
  OTHER: Wallet,
};

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.grid, { gap: theme.spacing.sm, marginBottom: theme.spacing.lg }]}>
      {PAYMENT_METHODS.map((method) => {
        const selected = method.value === value;
        const Icon = METHOD_ICONS[method.value];

        return (
          <PressableScale
            key={method.value}
            onPress={() => onChange(method.value)}
            haptic
            style={[
              styles.item,
              {
                backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.surface,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                borderRadius: theme.radii.md,
              },
            ]}
          >
            {selected ? (
              <Animated.View entering={FadeIn.duration(TIMING_FAST.duration!)}>
                <Icon size={18} color={theme.colors.primary} strokeWidth={2.25} />
              </Animated.View>
            ) : (
              <Icon size={18} color={theme.colors.mutedText} strokeWidth={2} />
            )}
            <Text
              variant="caption"
              style={{
                marginTop: 6,
                color: selected ? theme.colors.primary : theme.colors.text,
                fontWeight: selected ? '600' : '500',
              }}
            >
              {method.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '31%',
    minWidth: 96,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
