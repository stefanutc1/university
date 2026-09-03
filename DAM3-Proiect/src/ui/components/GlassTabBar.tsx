import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_MARGIN = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH - TAB_BAR_MARGIN * 2;

export const GlassTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { t } = useI18n();
  const numTabs = state.routes.length;
  const tabWidth = TAB_BAR_WIDTH / numTabs;

  // Animated value for the sliding glass indicator
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth]);

  const getIconName = (routeName: string, isFocused: boolean): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
      case 'Chats':
        return isFocused ? 'chatbubbles' : 'chatbubbles-outline';
      case 'AirDrop':
        return isFocused ? 'paper-plane' : 'paper-plane-outline';
      case 'Walkie':
        return isFocused ? 'radio' : 'radio-outline';
      case 'IncidentMap':
        return isFocused ? 'map' : 'map-outline';
      case 'Tools':
        return isFocused ? 'shield-checkmark' : 'shield-outline';
      default:
        return 'cube-outline';
    }
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case 'Chats':
        return t('nav_chats');
      case 'AirDrop':
        return t('nav_airdrop');
      case 'Walkie':
        return t('nav_walkie');
      case 'IncidentMap':
        return t('nav_map');
      case 'Tools':
        return t('nav_tools');
      default:
        return routeName;
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={Platform.OS === 'ios' ? 75 : 100} tint="dark" style={styles.glassContainer}>
        {/* Animated Sliding Pill Indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: tabWidth - 10,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* Tab Buttons */}
        <View style={styles.tabsRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = getIconName(route.name, isFocused);
            const label = getTabLabel(route.name);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.7}
                onPress={onPress}
                style={[styles.tabButton, { width: tabWidth }]}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isFocused ? theme.colors.accent : theme.colors.textMuted}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: TAB_BAR_MARGIN,
    right: TAB_BAR_MARGIN,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  glassContainer: {
    backgroundColor: Platform.OS === 'android' ? 'rgba(10, 14, 23, 0.88)' : 'rgba(12, 17, 28, 0.72)',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 5,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 242, 254, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: theme.colors.accent,
    fontWeight: '800',
  },
  tabLabelInactive: {
    color: theme.colors.textMuted,
  },
});
