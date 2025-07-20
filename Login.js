import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  Linking,
  ActivityIndicator,
  AppState
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  const parseDeepLinkUrl = (url) => {
    try {
      const params = {};
      const queryString = url.split('?')[1];
      
      if (queryString) {
        queryString.split('&').forEach(param => {
          const [key, value] = param.split('=');
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      }
      
      return params;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return {};
    }
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5001/spotify/callback?code=${code}`
      );
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      const tokenData = await response.json();
      
      if (tokenData.error) throw new Error(tokenData.error);
      
      if (tokenData.access_token && tokenData.user_id) {
        await AsyncStorage.multiSet([
          ['spotify_access_token', tokenData.access_token],
          ['spotify_user_id', tokenData.user_id],
          ['spotify_token_expires', tokenData.expires_in.toString()],
          ['spotify_refresh_token', tokenData.refresh_token]
        ]);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      Alert.alert('Authentication Error', 'Failed to complete authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepLink = async (url) => {
    if (!url) return;
    
    if (url.includes('beatpulse://callback')) {
      const params = parseDeepLinkUrl(url);
      
      if (params.code) {
        setIsLoading(true);
        await exchangeCodeForToken(params.code);
      } else if (params.error) {
        Alert.alert('Authentication Error', params.error_description || 'Authentication failed');
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('spotify_access_token');
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          handleDeepLink(url);
        } else {
          checkAuthStatus();
        }
      } catch (error) {
        console.error('Error handling app state change:', error);
      }
    }
  };

  const initializeDeepLinking = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      handleDeepLink(initialUrl);
    } else {
      checkAuthStatus();
    }

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  };

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    const deepLinkCleanup = initializeDeepLinking();

    return () => {
      appStateSubscription.remove();
      deepLinkCleanup();
    };
  }, [navigation]);

  const handleSpotifyLogin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5001/spotify/auth_url');
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const { auth_url } = await response.json();
      await Linking.openURL(auth_url);
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert('Connection Error', 'Failed to connect to Spotify. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Image 
          source={require('./assets/beat-logo.png')}
          style={styles.appLogo}
        />
      </View>
      
      <View style={styles.buttonGroup}>
        <Text style={styles.title}>Connect Your Accounts</Text>
        
        <TouchableOpacity style={[styles.button, styles.whoopButton]}>
          <Image source={require('./assets/whoop-logo.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Connect WHOOP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.spotifyButton]} 
          onPress={handleSpotifyLogin}
          disabled={isLoading}
        >
          <Image source={require('./assets/spotify-logo.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Connect Spotify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogo: {
    width: 600,
    height: 600,
    resizeMode: 'contain'
  },
  buttonGroup: {
    position: 'absolute',
    top: '49%', 
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  whoopButton: {
    backgroundColor: '#808080'
  },
  spotifyButton: {
    backgroundColor: '#1DB954'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15
  },
  buttonIcon: {
    width: 30,
    height: 30
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoginScreen;