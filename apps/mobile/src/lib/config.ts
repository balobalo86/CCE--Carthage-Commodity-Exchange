import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as { apiUrl?: string; wsUrl?: string };

// EXPO_PUBLIC_* env vars (set at `expo start` time, e.g. via a .env file) win over
// app.json's extra block, which wins over the localhost default. This lets you point
// a physical device at your computer's LAN IP without editing app.json:
//   EXPO_PUBLIC_API_URL=http://192.168.1.42:4000 EXPO_PUBLIC_WS_URL=ws://192.168.1.42:4000/ws pnpm start
export const API_URL = process.env.EXPO_PUBLIC_API_URL || extra.apiUrl || "http://localhost:4000";
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL || extra.wsUrl || "ws://localhost:4000/ws";
