import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Quicksand_400Regular, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts ({
    Quicksand_400Regular,
    Quicksand_700Bold,
    Poppins_400Regular,
    Poppins_700Bold
  });

  if(!fontsLoaded) {
    return null;
  } 

  
  return (
    <UserProvider>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* auth folder to load first (login/signup) */}
        <Stack.Screen name="(auth)" />

        {/* tabs folder */}
        <Stack.Screen name="(tabs)" />

        {/* badges screen */}
        <Stack.Screen name="badges" />

        {/* modal */}
        <Stack.Screen name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
    </UserProvider>
  );
}
