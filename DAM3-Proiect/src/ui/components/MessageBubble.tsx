import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
          {isOutgoing && (
            <Text style={[styles.stateText, getStateColor(message.state)]}>
              • {message.state}
            </Text>
          )}
          {message.hopCount > 0 && (
            <Text style={styles.hopText}> • {message.hopCount} hops</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const getStateColor = (state: string) => {
  switch (state) {
    case 'DELIVERED':
      return { color: theme.colors.success };
    case 'SENDING':
    case 'RELAYED':
      return { color: theme.colors.accent };
    case 'FAILED':
    case 'EXPIRED':
      return { color: theme.colors.sosEmergency };
    default:
      return { color: theme.colors.textSecondary };
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  containerOutgoing: {
    justifyContent: 'flex-end',
  },
  containerIncoming: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.lg,
  },
  bubbleOutgoing: {
    backgroundColor: '#1e2633',
    borderTopRightRadius: 2,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
  },
  bubbleIncoming: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 2,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  stateText: {
    fontSize: 10,
    marginLeft: 4,
  },
  hopText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
});
