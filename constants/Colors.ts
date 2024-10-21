/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#752F1F';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    background: '#FBF9F4',
    text: '#967d28',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#752F1F',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FBF9F4',
    background: '#967d28',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
