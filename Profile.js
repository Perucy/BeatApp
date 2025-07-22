import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ userData }) => {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/spotify/profile/${userData.user_id}`);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  return (
    <View>
      {profile ? (
        <>
          <Text>Name: {profile.display_name}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>Followers: {profile.followers?.total}</Text>
        </>
      ) : (
        <Text>Loading profile.........</Text>
      )}
    </View>
  );
};

// const ProfileScreen = ({ navigation }) => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [recentlyPlayed, setRecentlyPlayed] = useState([]);
//   const [timeRange, setTimeRange] = useState('medium_term');

//   const SERVER_URL = 'http://127.0.0.1:5001';

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       loadUserData();
//     });
//     return unsubscribe;
//   }, [navigation, timeRange]);

//   const verifyToken = async () => {
//     const token = await AsyncStorage.getItem('spotify_access_token');
//     if (!token) {
//       Alert.alert('Session Expired', 'Please login again');
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//       return false;
//     }
//     return true;
//   };

//   const loadUserData = async () => {
//     try {
//       setLoading(true);
//       const isAuthenticated = await verifyToken();
//       if (!isAuthenticated) return;

//       const userId = await AsyncStorage.getItem('spotify_user_id');
//       const token = await AsyncStorage.getItem('spotify_access_token');

//       await Promise.all([
//         fetchUserProfile(userId, token),
//         fetchRecentlyPlayedTracks(userId, token)
//       ]);
//     } catch (error) {
//       console.error('Error loading user data:', error);
//       Alert.alert('Error', 'Failed to load user data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserProfile = async (userId, token) => {
//     try {
//       const response = await fetch(`${SERVER_URL}/spotify/profile?user_id=${userId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.status === 401) {
//         throw new Error('Unauthorized');
//       }
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }
      
//       const profileData = await response.json();
//       setProfile(profileData);
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       if (error.message === 'Unauthorized') {
//         await AsyncStorage.multiRemove([
//           'spotify_access_token',
//           'spotify_user_id'
//         ]);
//         navigation.navigate('Login');
//       }
//       throw error;
//     }
//   };

//   const fetchRecentlyPlayedTracks = async (userId, token) => {
//     try {
//       const response = await fetch(
//         `${SERVER_URL}/spotify/recently-played?user_id=${userId}&limit=5`, 
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setRecentlyPlayed(data.items || []);
//       } else {
//         throw new Error(`HTTP ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error fetching recently played tracks:', error);
//       throw error;
//     }
//   };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#1DB954" />
//                 <Text style={styles.loadingText}>Loading your music profile...</Text>
//             </View>
//         );
//     }

//       return (
//         <ScrollView
//             style={styles.container}
//             refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         >
//             {/* Profile Header */}
//             {profile && (
//                 <View style={styles.profileHeader}>
//                     {profile.images && profile.images[0] && (
//                         <Image source={{ uri: profile.images[0].url }} style={styles.profileImage} />
//                     )}
//                     <Text style={styles.displayName}>{profile.display_name}</Text>
//                     <Text style={styles.userStats}>
//                         {profile.followers?.total} followers • {profile.country}
//                     </Text>
//                 </View>
//             )}

//         {/* Time Range Selector */}
//         {renderTimeRangeSelector()}

//         {/* Recently Played */}
//         <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Recently Played</Text>
//             {recentlyPlayed.map(renderRecentlyPlayedItem)}
//         </View>
//         </ScrollView>
//     );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   loadingText: {
//     color: '#fff',
//     marginTop: 10,
//     fontSize: 16,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   displayName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 5,
//   },
//   userStats: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timeRangeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   timeRangeButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     marginHorizontal: 5,
//     borderRadius: 20,
//     backgroundColor: '#333',
//   },
//   timeRangeButtonActive: {
//     backgroundColor: '#1DB954',
//   },
//   timeRangeText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   timeRangeTextActive: {
//     color: '#000',
//   },
//   section: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 15,
//   },
//   listItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#333',
//   },
//   rankNumber: {
//     color: '#1DB954',
//     fontSize: 16,
//     fontWeight: 'bold',
//     width: 30,
//     textAlign: 'center',
//   },
//   artistImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   trackImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 5,
//     marginRight: 15,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   itemDetail: {
//     color: '#999',
//     fontSize: 14,
//   },
//   playedAt: {
//     color: '#666',
//     fontSize: 12,
//     marginTop: 2,
//   },
// });

// export default ProfileScreen;