import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import DropListScreen from "./screens/DropListScreen";
import DropDetailScreen from "./screens/DropDetailScreen";
import ClaimScreen from "./screens/ClaimScreen";

const Stack = createStackNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {authenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="Drops" component={DropListScreen} />
          <Stack.Screen name="Detail" component={DropDetailScreen} />
          <Stack.Screen name="Claim" component={ClaimScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setAuthenticated={setAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Signup">
              {(props) => <SignupScreen {...props} setAuthenticated={setAuthenticated} />}
          </Stack.Screen>        
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
