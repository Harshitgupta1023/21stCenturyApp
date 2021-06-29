import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
import Touchable from 'react-native-touchable-scale';

import Colors from '../../constants/Colors';
import CategoryTile from '../CategoryTile';
import greenTick from '../../assets/greenTick.jpg';
import yellowTick from '../../assets/yellowTick.jpg';

const screenWidth = Dimensions.get('window').width;

const OrdersTile = ({orderData, navigation, orderID}) => {
  const {amount, status, createdAt} = orderData;
  const Openable = () => {
    navigation.navigate('OrderDetails', {
      orderID: orderID,
      total: amount,
      date: createdAt,
      status: status,
    });
  };

  return (
    <Touchable onPress={Openable} activeScale={0.9} friction={8}>
      <View style={styles.container}>
        <View>
          <View style={styles.order}>
            <Text>OrderID:</Text>
            <Text style={styles.orderText}>{orderID}</Text>
          </View>
          <View style={styles.date}>
            <Text>Date/Time :</Text>
            <Text style={styles.dateText}>
              {createdAt.toDate().toDateString()}
            </Text>
            <Text style={styles.dateText}>
              {createdAt.toDate().toLocaleTimeString()}
            </Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text>Total:</Text>
          <CategoryTile
            text={`Rs ${amount}`}
            containerStyle={{
              backgroundColor: 'rgba(0,65,255,0.2)',
              borderColor: Colors['Navy Blue'],
            }}
            textStyle={{color: Colors['Navy Blue']}}
          />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={status ? greenTick : yellowTick}
              style={{width: 50, height: 50}}
            />
          </View>
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    width: screenWidth - 20,
    justifyContent: 'space-around',
    borderWidth: 0.001,
    elevation: 3,
    alignItems: 'center',
  },
  orderText: {
    fontSize: 17,
    fontFamily: 'robotoRegular',
  },
  date: {
    marginTop: 10,
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'robotoRegular',
  },
  priceConainer: {},
  bottomContainer: {
    // backgroundColor: 'rgba(0,165,255,0.1)',
  },
});

export default OrdersTile;
