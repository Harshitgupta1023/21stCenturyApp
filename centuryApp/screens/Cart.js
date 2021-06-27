import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import AppLoading from '../hooks/AppLoading';
import CartCard from '../components/cart/CartCard';
import OrderButton from '../components/cart/OrderButton';

const Cart = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState();
  const [images, setImages] = useState();
  const userId = auth().currentUser.uid;

  const fetchItems = async () => {
    const userDetails = await firestore().collection('users').doc(userId).get();
    const imageStore = storage().ref();

    var fetchedUserCart = userDetails.data().cart;

    Object.keys(fetchedUserCart).map(dat => {
      fetchedUserCart[dat].quantity === 0 ? delete fetchedUserCart[dat] : null;
    });
    var imagesObject = {};

    await Promise.all(
      Object.keys(fetchedUserCart).map(async dat => {
        const mealImageURL = await firestore()
          .collection('meals')
          .doc(fetchedUserCart[dat].mealID)
          .get();
        imagesObject[fetchedUserCart[dat].mealID] =
          mealImageURL.data().imageURL;
      }),
    );

    await Promise.all(
      Object.keys(imagesObject).map(async dat => {
        const newURL = await imageStore
          .child(imagesObject[dat])
          .getDownloadURL();
        imagesObject[dat] = newURL;
      }),
    );
    setCartItems(fetchedUserCart);
    setImages(imagesObject);
  };

  useEffect(() => {
    const updateCart = () => {
      firestore().collection('users').doc(userId).update({
        cart: cartItems,
      });
    };
    cartItems === undefined ? null : updateCart();
  }, [cartItems]);
  if (!isLoading) {
    return (
      <AppLoading
        fetchItems={fetchItems}
        onFinish={() => {
          setIsLoading(true);
        }}
        onError={console.warn}
      />
    );
  }

  var totalValue = 0;
  Object.keys(cartItems).map(dat => {
    totalValue += cartItems[dat].quantity * cartItems[dat].price;
  });

  return Object.keys(cartItems).length === 0 ? (
    <View style={styles.emptyScreen}>
      <Text>Cart Is Empty....</Text>
      <Button
        title="Go to Meals"
        onPress={() => {
          props.navigation.navigate('Meals');
        }}
      />
    </View>
  ) : (
    <View style={styles.screen}>
      <View style={styles.cardContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(cartItems).map(dat => (
            <CartCard
              key={dat}
              details={cartItems[dat]}
              imageURL={images[cartItems[dat].mealID]}
              setCartItems={setCartItems}
              cartMealID={dat}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.text}>
          Total :
          <Text
            style={{
              fontFamily: 'robotoRegular',
              fontSize: 25,
            }}>
            {' '}
            ₹ {totalValue}
          </Text>
        </Text>
        <OrderButton
          totalAmount={totalValue}
          cartItems={cartItems}
          setIsLoading={setIsLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  emptyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    height: '75%',
    overflow: 'hidden',
    marginBottom: 10,
  },
  totalContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '25%',
    borderTopWidth: 0.001,
    elevation: 2,
    marginHorizontal: -5,
  },
  text: {
    marginTop: 10,
    textAlign: 'left',
    fontFamily: 'robotoLight',
    fontSize: 25,
  },
});

export default Cart;
