import Colors from '../constants/Colors';

export function requestColours(type) {
  switch (type.toUpperCase()) {
    case 'GET': return (Colors.requestGet);
    case 'PUT': return (Colors.requestPut);
    case 'POST': return (Colors.requestPost);
    case 'DELETE': return (Colors.requestDelete);
    default: return (Colors.requestDefault);
  }
}
