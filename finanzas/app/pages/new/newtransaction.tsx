import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

  const { id } = useLocalSearchParams(); // Get the card ID from the route

export default function newtransaction() {
  return (
    <View>
      <Text>newtransaction: {id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})