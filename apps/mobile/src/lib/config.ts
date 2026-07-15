import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as { apiUrl?: string; wsUrl?: string };

export const API_URL = extra.apiUrl || "http://localhost:4000";
export const WS_URL = extra.wsUrl || "ws://localhost:4000/ws";
export const ACCOUNT_ID = "demo";
