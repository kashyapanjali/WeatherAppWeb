const config = {
  // Weather and Gemini APIs
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  
  // Google Auth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  
  // Firebase Config
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  }
}; 