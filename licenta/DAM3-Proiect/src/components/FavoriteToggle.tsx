import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function FavoriteToggle({ isFav, onToggle }: any) { return <TouchableOpacity onPress={onToggle}><Ionicons name={isFav ? 'star' : 'star-outline'} size={22} color='#f59e0b' /></TouchableOpacity>; }
