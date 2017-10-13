import { StyleSheet } from 'react-native';

const themes = {
  lightTheme: {
    _id: 'light',
    container: {
      backgroundColor: 'white',
    },
    requestContainer: {
      backgroundColor: '#f7f7f7',
    },
    requestTab: {
      borderColor: '#d6d7da',
    },
    responseContainer: {
      backgroundColor: 'white',
    },
    tabBar: {
      backgroundColor: 'white',
    },
    header: {
      backgroundColor: 'white',
    },
    text: {
      color: 'black',
    },
    responseStat: {
      color: '#c6c7c6',
    },
    urlBox: {
      backgroundColor: 'white',
    },
    requestOptions: {
      backgroundColor: 'white',
    },
  },
  darkTheme: {
    _id: 'dark',
    container: {
      backgroundColor: 'black',
    },
    cardContainer: {
      backgroundColor: 'black',
    },
    historyContainer: {
      backgroundColor: '#222222',
    },
    requestContainer: {
      backgroundColor: 'black',
    },
    requestTab: {
      borderColor: 'black',
    },
    responseContainer: {
      backgroundColor: '#222222',
    },
    tabBar: {
      backgroundColor: 'black',
    },
    header: {
      backgroundColor: 'black',
    },
    text: {
      color: 'white',
    },
    responseStat: {
      color: 'grey',
    },
    separator: {
      backgroundColor: '#222222',
    },
    urlBox: {
      backgroundColor: '#222222',
    },
    requestOptions: {
      backgroundColor: '#222222',
    },
  },
};

export default themes;
