import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useFocusEffect } from '@react-navigation/native';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  Linking,
  ActivityIndicator,
  AppState,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    console.log("Login screen mounted - starting auth flow...");
    Linking.getInitialURL().then(url => {
      console.log("Initial URL:", url);
    }).catch(console.error);
    const subscription = Linking.addEventListener('url', handleCallback);

    console.log("Listening for deep links...", !!subscription);

    return () => {
      console.log("Cleaning up deep link listener...");
      subscription.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://192.168.1.248:8000/spotify/auth_url')

      const authUrl = response.data.auth_url;

      console.log('Spotify Auth URL:', authUrl);

      const val = await Linking.openURL(authUrl);
      console.log('Linking result:', val);
      //Linking.addEventListener('url', handleCallback);
      Linking.addEventListener('url', (event) => {
        console.log('Received URL:', event.url);
        if (event.url.includes('beatpulse://callback')) {
          const code = event.url.split('code=')[1];
          console.log('Success! Code:', code);
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleCallback = async (event) => {
    console.log('Received URL:', event.url);
    if (event.url.startsWith('beatpulse://callback')) {
      const code = new URL(event.url).searchParams.get('code');

      console.log('Received code:', code);

      navigation.navigate('Home', { code });
      Linking.removeEventListener('url', handleCallback);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Connect Spotify" onPress={handleLogin} />
    </View>
  );
};
export default LoginScreen;

// const API_BASE = 'http://127.0.0.1:8000';

// const SpotifyAuth = () => {
//   const [userData, setUserData] = useState(null);

//   const initAuth = async () => {
//     try {
//       //get auth URL from backend
//       const { data } = await axios.get(`${API_BASE}/spotify/auth_url`);

//       //open spotify login browser
//       Linking.openURL(data.auth_url);

//       //listen for callback
//       Linking.addEventListener('url', handleCallback);

//     } catch (err) {
//       console.error('Auth error:', err);
//     }
//   };

//   const handleCallback = async (event) => {
//     if (!event.url.includes('callback')) return;

//     // Extract the code from the URL
//     const code = event.url.split('code=')[1];

//     try {
//       const { data } = await axios.get(`${API_BASE}/spotify/callback?code=
//         ${code}`);
//       setUserData(data);
//     } catch (err) {
//       console.error('Callback error:', err);
//     }
//   };

//   return (
//     <View>
//       <Button title="Connect Spotify" onPress={initAuth} />
//       {userData && <ProfileScreen userData={userData} />}
//     </View>
//   );
// };

// const LoginScreen = ({ navigation }) => {
//   const [isLoading, setIsLoading] = useState(true);

//   const parseDeepLinkUrl = (url) => {
//     try {
//       const params = {};
//       const queryString = url.split('?')[1];
      
//       if (queryString) {
//         queryString.split('&').forEach(param => {
//           const [key, value] = param.split('=');
//           params[decodeURIComponent(key)] = decodeURIComponent(value || '');
//         });
//       }
      
//       return params;

//     } catch (error) {

//       console.error('Error parsing URL:', error);
//       return {};
//     }
//   };

//   const exchangeCodeForToken = async (code) => {
//     console.log("exchanging code for token.....");
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:5001/spotify/callback?code=${code}`
//       );
      
//       if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
//       const tokenData = await response.json();
//       console.log('token received from backend:', tokenData)
      
//       if (tokenData.error) throw new Error(tokenData.error);
//       await AsyncStorage.multiSet([
//         ['spotify_access_token', tokenData.access_token],
//         ['spotify_user_id', tokenData.user_id],
//         ['spotify_token_expires', tokenData.expires_in.toString()],
//         ['spotify_refresh_token', tokenData.refresh_token]
//       ]);

//       console.log('Token stored successfully:', await AsyncStorage.getItem('spotify_access_token'));
//       const storedtoken = await AsyncStorage.getItem('spotify_access_token');
//       if (!storedtoken) {
//         throw new Error('Token storage failed');
//       }
//     } catch (error) {
//       console.error('Token exchange failed:', error);
//       Alert.alert('Authentication Error', 'Failed to complete authentication. Please try again.');
//     } 
//   };

//   const handleDeepLink = async (url) => {
//     if (!url?.includes('beatpulse://callback')) return;
    
//     console.log('Received deep link:', url);
//     console.log('Extracted params:', params);
//     const params = parseDeepLinkUrl(url);
      
//     if (params.code) {
//       try{
//         setIsLoading(true);
//         await exchangeCodeForToken(params.code);
//         const token = await AsyncStorage.getItem('spotify_access_token');
//         if (token) {
//           navigation.reset({
//             index: 0,
//             routes: [{ name: 'Home' }],
//           });
//         }
//       } catch (error) {
//         console.error('Deep link failed', error)
//       } finally {
//         setIsLoading(false);
//       }
      
//     } else if (params.error) {
//       Alert.alert('Authentication Error', params.error_description || 'Authentication failed');
//     }
    
//   };

//   const checkAuthStatus = async () => {
//     try {
//       console.log('checking auth status....')
//       const allk = await AsyncStorage.getAllKeys();
//       console.log('all stored keys:', allk)
//       const token = await AsyncStorage.getItem('spotify_access_token');
//       console.log('existing token found:', token);
//       if (token) {
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Home' }],
//         });
//       } else {
//         console.log("no token");
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAppStateChange = async (nextAppState) => {
//     if (nextAppState === 'active') {
//       try {
//         const url = await Linking.getInitialURL();
//         if (url) {
//           handleDeepLink(url);
//         } else {
//           checkAuthStatus();
//         }
//       } catch (error) {
//         console.error('Error handling app state change:', error);
//       }
//     }
//   };

//   const initializeDeepLinking = async () => {
//     const initialUrl = await Linking.getInitialURL();
//     if (initialUrl) {
//       await handleDeepLink(initialUrl);
//     } else {
//       await checkAuthStatus();
//     }

//     Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    
//   };

//   useEffect(() => {
//     console.log("Login screen mounted-starting auth flow...");

//     let deepLinkListener;

//     const initAuthFlow = async () => {
      
//       console.log("init auth flow..");

      

//       const initialUrl = await Linking.getInitialURL();
      
//       console.log("Initial url:", initialUrl);

//       if (initialUrl) {
//         console.log("Processing cold start deep link");
//         await handleDeepLink(initialUrl);
//       } else {
//         console.log("No deep link - checking exiting auth");
//         await checkAuthStatus();
//       }
//     };

//     deepLinkListener = Linking.addEventListener('url', ({ url }) => {
//       console.log("New deep link while app running:", url);
//       handleDeepLink(url);
//     });
    
//     initAuthFlow();

//     return () => {
//       if (deepLinkListener) {
//         deepLinkListener.remove();
//       }
//     };
//   }, []);

//   // useFocusEffect(
//   //   React.useCallback(() => {
//   //     const checkAuthWhenFocused = async () => {
//   //       const token = await AsyncStorage.getItem('spotify_access_token');
//   //       if (token) {
//   //         navigation.reset({
//   //           index: 0,
//   //           routes: [{ name: 'Home'}],
//   //         });
//   //       }
//   //     };

//   //     checkAuthWhenFocused();
//   //   }, [navigation])
//   // );

//   const handleSpotifyLogin = async () => {
//     try {
//       console.log("handling spotify login....");
//       setIsLoading(true);
//       const response = await fetch('http://127.0.0.1:5001/spotify/auth_url');
      
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
//       const { auth_url } = await response.json();
//       console.log("auth url from spotify:", auth_url)

//       await Linking.openURL(auth_url);
      
//     } catch (error) {
//       console.error('Authentication failed:', error);
//       Alert.alert('Connection Error', 'Failed to connect to Spotify. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#1DB954" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.centerContainer}>
//         <Image 
//           source={require('./assets/beat-logo.png')}
//           style={styles.appLogo}
//         />
//       </View>
      
//       <View style={styles.buttonGroup}>
//         <Text style={styles.title}>Connect Your Accounts</Text>
        
//         <TouchableOpacity style={[styles.button, styles.whoopButton]}>
//           <Image source={require('./assets/whoop-logo.png')} style={styles.buttonIcon} />
//           <Text style={styles.buttonText}>Connect WHOOP</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.button, styles.spotifyButton]} 
//           onPress={handleSpotifyLogin}
//           disabled={isLoading}
//         >
//           <Image source={require('./assets/spotify-logo.png')} style={styles.buttonIcon} />
//           <Text style={styles.buttonText}>Connect Spotify</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5'
//   },
//   centerContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 300,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   appLogo: {
//     width: 600,
//     height: 600,
//     resizeMode: 'contain'
//   },
//   buttonGroup: {
//     position: 'absolute',
//     top: '49%', 
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center'
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '80%',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3
//   },
//   whoopButton: {
//     backgroundColor: '#808080'
//   },
//   spotifyButton: {
//     backgroundColor: '#1DB954'
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginLeft: 15
//   },
//   buttonIcon: {
//     width: 30,
//     height: 30
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   }
// });

// export default LoginScreen;