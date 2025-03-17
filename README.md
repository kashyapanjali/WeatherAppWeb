# Weather App with Google Authentication

A real-time weather application with Google Authentication and feedback system using Firebase Database.

## Features

- 🌤️ Real-time weather information
- 🔐 Google Authentication
- 💭 User feedback system with Firebase
- 🎯 Personalized weather recommendations
- 👤 User profile management
- 🔄 Real-time feedback updates
- 🗑️ User-specific feedback deletion

## Live Demo

Visit the live application: [Weather App](https://anjali-weather-app.netlify.app/)

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Google OAuth 2.0
- Firebase Realtime Database
- OpenWeather API
- Google Gemini API

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Configure API Keys**
   - Update the `config.js` file with your API keys:
   ```javascript
   const config = {
     WEATHER_API_KEY: 'your_weather_api_key',
     GEMINI_API_KEY: 'your_gemini_api_key',
     GOOGLE_CLIENT_ID: 'your_google_client_id',
     firebase: {
       // Your Firebase config object
     }
   };
   ```

3. **Set Up Firebase**
   - Create a project in Firebase Console
   - Enable Realtime Database
   - Set up Google Authentication
   - Add your domain to authorized origins

4. **Run the Application**
   - Open `index.html` in a web browser
   - Or use a local server:
     ```bash
     python -m http.server 3000
     ```
   - Visit `http://localhost:3000`

## Features in Detail

### Weather Information
- Search for any city
- View current temperature, humidity, and wind speed
- Get weather-specific recommendations

### Authentication
- Sign in with Google
- Secure user sessions
- Profile picture and name display

### Feedback System
- Submit feedback with user information
- Real-time feedback updates
- Delete your own feedback
- Persistent storage with Firebase

## Project Structure