import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Message } from '../../types';
import { theme } from '../theme';

interface Props {
  message: Message;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isOutgoing = message.isOutgoing;
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.container,
        isOutgoing ? styles.containerOutgoing : styles.containerIncoming,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
        ]}
      >
        <Text style={styles.text}>{message.content}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.timeText}>{time}</Text>

          {message.hopCount > 0 && (
            <View style={styles.hopBadge}>
              <Ionicons name="git-network-outline" size={10} color={theme.colors.textMuted} />
              <Text style={styles.hopText}>{message.hopCount}</Text>
            </View>
          )}

          {isOutgoing && (
            <View style={styles.statusIcon}>
              {message.state === 'DELIVERED' ? (
                <Ionicons name="checkmark-done" size={13} color={theme.colors.success} />
              ) : message.state === 'RELAYED' ? (
                <Ionicons name="arrow-forward-circle" size={13} color={theme.colors.accent} />
              ) : (
                <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  containerOutgoing: {
    justifyContent: 'flex-end',
  },
  containerIncoming: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  bubbleOutgoing: {
    backgroundColor: 'rgba(0, 242, 254, 0.14)',
    borderColor: 'rgba(0, 242, 254, 0.32)',
    borderBottomRightRadius: 4,
  },
  bubbleIncoming: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 4,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  hopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  hopText: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginLeft: 2,
  },
  statusIcon: {
    marginLeft: 6,
  },
});
