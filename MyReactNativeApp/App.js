import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { sendPushNotification, registerForPushNotificationsAsync, handleRegistrationError, PushTokenContext } from './util';

const PushTokenProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  return (
    <PushTokenContext.Provider value={expoPushToken}>
      {children}
    </PushTokenContext.Provider>
  );
};

export default function App() {
  return (
    <PushTokenProvider>
      <AppNavigator />
    </PushTokenProvider>
    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
    //   <Text>Your Expo push token: {expoPushToken}</Text>
    //   <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    //     <Text>Title: {notification && notification.request.content.title}</Text>
    //     <Text>Body: {notification && notification.request.content.body}</Text>
    //   </View>
    //   <Button
    //     title="Press to Send Notification"
    //     onPress={async () => {
    //       await sendPushNotification(expoPushToken);
    //     }}
    //   />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});