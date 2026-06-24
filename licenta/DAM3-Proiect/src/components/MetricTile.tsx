import React from 'react';
import { View, Text } from 'react-native';
export default function MetricTile({ label, value }: any) { return <View><Text>{label}: {value}</Text></View>; }
