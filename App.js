import 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from "./Login";
import HomeScreen from "./Home";
// import ProfileScreen from "./Profile";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
// const Stack = createStackNavigator();

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('spotify_access_token');
//         setIsAuthenticated(!!token);
//       } catch (error) {
//         console.error('Auth check error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isAuthenticated ? (
//           <>
//             <Stack.Screen 
//               name="Home" 
//               component={HomeScreen}
//               // options={{ title: 'Home' }}
//             />
//             <Stack.Screen 
//               name="Profile" 
//               component={ProfileScreen}
//               // options={{ title: 'Profile' }}
//             />
//           </>
//         ) : (
//           <Stack.Screen 
//             name="Login" 
//             component={LoginScreen}
//             options={{ headerShown: false }}
//           />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;