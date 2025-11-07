import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import DropListScreen from "./screens/DropListScreen";
import DropDetailScreen from "./screens/DropDetailScreen";
import ClaimScreen from "./screens/ClaimScreen";
import AdminDropScreen from "./screens/AdminDropScreen";

const Stack = createStackNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const commonScreenOptions = {
    headerShown: false,
  };

return (
    <NavigationContainer>
      {authenticated ? (
        <Stack.Navigator screenOptions={commonScreenOptions}>
          <Stack.Screen name="Drops">
            {(props) => <DropListScreen {...props} isAdmin={isAdmin} />}
          </Stack.Screen>
          <Stack.Screen name="Detail" component={DropDetailScreen} />
          <Stack.Screen name="Claim" component={ClaimScreen} />
          
          {isAdmin && (
             <Stack.Screen name="Admin" component={AdminDropScreen} />
          )}
          
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={commonScreenOptions}> 
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setAuthenticated={setAuthenticated} setIsAdmin={setIsAdmin} />}
          </Stack.Screen>
          <Stack.Screen name="Signup">
             {(props) => <SignupScreen {...props} setAuthenticated={setAuthenticated} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
