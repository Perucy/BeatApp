import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const LoginScreen = ({ navigation }) => {
  useEffect(() => {
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

    const handleDeepLink = (event) => {
      const url = typeof event === 'string' ? event : event.url;
      
      if (url && url.includes('beatpulse://callback')) {
        console.log('Deep link received:', url);
        const params = parseDeepLinkUrl(url);
        
        if (params.code) {
          exchangeCodeForToken(params.code);
        } else if (params.error) {
          console.error('OAuth error:', params.error);
          Alert.alert('Authentication Error', params.error_description || 'Authentication failed');
        } else {
          console.warn('No authorization code found in deep link');
        }
      }
    };

    // For newer React Native versions
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was launched from a deep link
    Linking.getInitialURL().then(url => {
      if (url && url.includes('beatpulse://callback')) {
        console.log('App launched with deep link:', url);
        handleDeepLink(url);
      }
    }).catch(error => {
      console.error('Error checking initial URL:', error);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
      console.log('Exchanging code for token:', code);
      const response = await fetch(
        `http://127.0.0.1:5001/spotify/callback?code=${code}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const tokenData = await response.json();
      
      if (tokenData.error) {
        throw new Error(tokenData.error);
      }
      
      if (tokenData.access_token) {
        console.log('Auth successful, navigating to Home');
        navigation.navigate('Home');
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      Alert.alert('Authentication Error', 'Failed to complete authentication. Please try again.');
    }
  };

  const handleSpotifyLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/spotify/auth_url');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const { auth_url } = await response.json();
      
      // Use system browser for OAuth (recommended for OAuth flows)
      await Linking.openURL(auth_url);
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert('Connection Error', 'Failed to connect to Spotify. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {/* App Logo - True Center */}
      <View style={styles.centerContainer}>
        <Image 
          source={require('./assets/beat-logo.png')}
          style={styles.appLogo}
        />
      </View>
      
      {/* Buttons - Slightly Below Center */}
      <View style={styles.buttonGroup}>
        <Text style={styles.title}>Connect Your Accounts</Text>
        
        <TouchableOpacity style={[styles.button, styles.whoopButton]}>
          <Image source={require('./assets/whoop-logo.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Connect WHOOP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.spotifyButton]} 
          onPress={handleSpotifyLogin}
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
  }
});

export default LoginScreen;