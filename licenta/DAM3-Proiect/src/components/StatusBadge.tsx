import React from 'react';
import { View, Text } from 'react-native';
export default function StatusBadge({ status }: { status: string }) { return <View><Text>{status}</Text></View>; }
