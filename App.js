import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
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
        
        <TouchableOpacity style={[styles.button, styles.spotifyButton]}>
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
    top: '49%', // Adjust this percentage to move buttons up/down
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