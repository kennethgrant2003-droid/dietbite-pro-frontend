// src/config/apiBaseUrl.js

// ✅ Physical phone on same Wi-Fi as your PC:
const LAN_BASE_URL = "http://10.0.0.160:10000";

// ✅ Android emulator (ONLY if you're using emulator):
const ANDROID_EMULATOR_BASE_URL = "http://10.0.2.2:10000";

// Pick ONE.
// If you are testing on a real phone, keep LAN_BASE_URL.
export const API_BASE_URL = LAN_BASE_URL;

// If you switch to Android emulator later, change to:
// export const API_BASE_URL = ANDROID_EMULATOR_BASE_URL;
