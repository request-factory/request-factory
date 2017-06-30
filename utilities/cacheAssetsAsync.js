import { Image } from 'react-native';
import { Asset, Font } from 'expo';

export default function cacheAssetsAsync({ images = [], fonts = [
  { Roboto: require('../node_modules/native-base/Fonts/Roboto.ttf') },
  { Roboto_medium: require('../node_modules/native-base/Fonts/Roboto_medium.ttf') },
] }) {
  return Promise.all([...cacheImages(images), ...cacheFonts(fonts)]);
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
      return Asset.fromModule(image).downloadAsync();

  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}
