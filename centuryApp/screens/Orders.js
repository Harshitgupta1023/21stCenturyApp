import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const Orders = props => {
  return (
    <View style={styles.screen}>
      <Text>This is Orders Screen!!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Orders;