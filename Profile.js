import React, { use } from 'react';
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

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [timeRange, setTimeRange] = useState('medium_term');

    const SERVER_URL = 'http://127.0.0.1:5001';

    useEffect(() => {
        loadUserData();
    }, [timeRange]);

    const loadUserData = async () => {
        try {
            const userId = await AsyncStorage.getItem('spotify_user_id');
            if (!userId) {
                Alert.alert('Error', 'User ID not found. Please log in again.');
                navigation.navigate('Login');
                return;
            }

            await Promise.all([
                fetchUserProfile(userId),
                fetchRecentlyPlayedTracks(userId)
            ]);
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async (userId) => {
        try {
            const response = await fetch(`${SERVER_URL}/spotify/profile/user_id=${userId}`);
            if (response.ok) {
                const profileData = await response.json();
                setProfile(profileData);
            }
            
        } catch (error) {
            console.error('Error fetching user profile:', error);
            Alert.alert('Error', 'Failed to fetch user profile.');
        }
    };

    const fetchRecentlyPlayedTracks = async (userId) => {
        try {
            const response = await fetch(`${SERVER_URL}/spotify/recently-played/${userId}?limit=5`);
            if (response.ok) {
                const data = await response.json();
                setRecentlyPlayed(data.items || []);
            } else {
                console.error('Failed to fetch recently played tracks:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching recently played tracks:', error);
            Alert.alert('Error', 'Failed to fetch recently played tracks.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUserData();
        setRefreshing(false);
    };

    const renderTimeRangeSelector = () => {
        const timeRanges = [
            { key: 'short_term', label: '4 Weeks' },
            { key: 'medium_term', label: '6 Months' },
            { key: 'long_term', label: 'All Time' }
        ];

        return (
            <View style={styles.timeRangeSelector}>
                {timeRanges.map((range) => (
                    <TouchableOpacity
                        key={range.key}
                        style={[
                            styles.timeRangeButton,
                            timeRange === range.key && styles.activeTimeRangeButton
                        ]}
                        onPress={() => setTimeRange(range.key)}
                    >
                        <Text style={[
                            styles.timeRangeText,
                            timeRange === range.key && styles.timeRangeTextActive,
                        ]}
                        >
                            {range.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderRecentlyPlayedItem = (item, index) => {
        const track = item.track;
        return (
            <View key={`${track.id}-${item.played_at}`} style={styles.listItem}>
            {track.album?.images && track.album.images[0] && (
                <Image source={{ uri: track.album.images[0].url }} style={styles.trackImage} />
            )}
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{track.name}</Text>
                <Text style={styles.itemDetail}>
                    {track.artists?.map(artist => artist.name).join(', ')}
                </Text>
                <Text style={styles.playedAt}>
                    {new Date(item.played_at).toLocaleDateString()}
                </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1DB954" />
                <Text style={styles.loadingText}>Loading your music profile...</Text>
            </View>
        );
    }

      return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Profile Header */}
            {profile && (
                <View style={styles.profileHeader}>
                    {profile.images && profile.images[0] && (
                        <Image source={{ uri: profile.images[0].url }} style={styles.profileImage} />
                    )}
                    <Text style={styles.displayName}>{profile.display_name}</Text>
                    <Text style={styles.userStats}>
                        {profile.followers?.total} followers • {profile.country}
                    </Text>
                </View>
            )}

        {/* Time Range Selector */}
        {renderTimeRangeSelector()}

        {/* Recently Played */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            {recentlyPlayed.map(renderRecentlyPlayedItem)}
        </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userStats: {
    fontSize: 14,
    color: '#999',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  timeRangeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  timeRangeButtonActive: {
    backgroundColor: '#1DB954',
  },
  timeRangeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: '#000',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  rankNumber: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemDetail: {
    color: '#999',
    fontSize: 14,
  },
  playedAt: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
});

export default ProfileScreen;