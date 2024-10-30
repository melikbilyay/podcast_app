/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(menu)/SignIn` | `/(menu)/SignUp` | `/(menu)/settings` | `/(tabs)` | `/(tabs)/` | `/(tabs)/calendars` | `/(tabs)/podcasts` | `/SignIn` | `/SignUp` | `/_sitemap` | `/calendars` | `/podcasts` | `/settings`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
