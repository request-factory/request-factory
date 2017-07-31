import { Platform, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    marginTop: 5,
    paddingTop: 10,
  },
  responseContainer: {
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: 'white',
  },
  responseGrid: {
    flex: 1.6,
  },
  responseTab: {
    flex: 0.1,
    padding: 0,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#f7f7f7',
  },
  viewTab: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  viewTabSelected: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.mainTheme,
  },
  viewCol: {
    backgroundColor: '#f7f7f7',
  },
  responseStat: {
    marginTop: 10,
    color: '#c6c7c6',
    textAlign: 'left',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 80,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 140,
    height: 38,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginRight: 20,
    marginTop: 10,
    marginLeft: 100,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  pickerContainer: {
    flex: 0.22,
    marginRight: 10,
    height: 40,
    marginTop: 5,
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
  },
  sendButton: {
    marginTop: 5,
    height: 40,
    flex: 0.05,
    borderBottomLeftRadius: 7,
    borderTopLeftRadius: 7,
    backgroundColor: '#4fca34',
  },
  urlBox: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    paddingLeft: 10,
    flex: 0.30,
    height: 50,
  },
  url: {
    fontSize: 14,
  },
  requestHeader: {
    borderWidth: 0,
    height: 50,
    flex: 0.08,
    marginRight: 10,
    backgroundColor: 'white',
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
});

export default styles;
