import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
// Define your Stack Navigator type
export type RootStackParamList = {
    SignIn: undefined;
    Home: undefined;
    SignUp: undefined;

};

// Define your navigation prop type
export type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
