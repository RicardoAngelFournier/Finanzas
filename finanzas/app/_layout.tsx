import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Black: require('../assets/fonts/Outfit-Black.ttf'),
    Bold: require('../assets/fonts/Outfit-Bold.ttf'),
    ExtraBold: require('../assets/fonts/Outfit-ExtraBold.ttf'),
    ExtraLight: require('../assets/fonts/Outfit-ExtraLight.ttf'),
    Light: require('../assets/fonts/Outfit-Light.ttf'),
    Medium: require('../assets/fonts/Outfit-Medium.ttf'),
    Regular: require('../assets/fonts/Outfit-Regular.ttf'),
    SemiBold: require('../assets/fonts/Outfit-SemiBold.ttf'),
    Thin: require('../assets/fonts/Outfit-Thin.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
        name="pages/score"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="pages/newcard" options={{ headerShown: false }} />
      <Stack.Screen name="pages/card/[id]" options={{ headerShown: false }} />
              <Stack.Screen
        name="pages/infoscore"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
