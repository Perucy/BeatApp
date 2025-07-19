import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./Login";
import HomeScreen from "./Home";
import ProfileScreen from "./Profile";

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen}
                    options={{ headerShown: false }} // Hide header for login
                />
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Home' }}
                />
                <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default App;