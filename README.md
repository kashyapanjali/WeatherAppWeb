# Weather App 🌤️

A modern weather application that provides real-time weather information, personalized recommendations, and user feedback system. Built with HTML, CSS, and JavaScript, integrating Google Authentication and Firebase.

## 🌐 Live Demo
[Weather App Demo](https://anjali-weather-app.netlify.app)

## ✨ Features
- Real-time weather information
- Google Authentication for user management
- User feedback system with Firebase
- Personalized weather recommendations
- Responsive design for all devices
- Dynamic weather icons and information display

## 🛠️ Technologies Used
- HTML5
- CSS3
- JavaScript
- Google OAuth 2.0
- Firebase Realtime Database
- OpenWeather API
- Google Gemini API

## 🔑 API Keys Required
Create a `config.js` file in your root directory with the following:

```javascript
const config = {
  // Weather and Gemini APIs
  WEATHER_API_KEY: 'your_openweather_api_key',
  GEMINI_API_KEY: 'your_gemini_api_key',
  
  // Google Auth
  GOOGLE_CLIENT_ID: 'your_google_client_id',
  
  // Firebase Config
  firebase: {
    apiKey: "your_firebase_api_key",
    authDomain: "your_project.firebaseapp.com",
    databaseURL: "your_database_url",
    projectId: "your_project_id",
    storageBucket: "your_storage_bucket",
    messagingSenderId: "your_sender_id",
    appId: "your_app_id",
    measurementId: "your_measurement_id"
  }
};
```

## 🚀 Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   ```

2. Configure API Keys:
   - Create a `config.js` file in the root directory
   - Add your API keys and configuration as shown above

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Realtime Database
   - Set up Authentication with Google sign-in
   - Copy your Firebase configuration to `config.js`

4. Set up Google OAuth:
   - Create a project in Google Cloud Console
   - Configure the OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized domains and origins

5. Run the application:
   - Open `index.html` in your browser
   - Or use a local server:
     ```bash
     python -m http.server 3000
     ```

## �� Project Structure

weather-app/
│
├── index.html
├── login.html
├── app.js
├── config.js
├── custom.css
│
├── assets/
│ └── weather.png
│
└── README.md
```

## 🌟 Features in Detail

### Weather Information
- Current temperature
- Weather conditions
- Humidity levels
- Wind speed
- Weather icons

### Authentication
- Google Sign-In integration
- User profile display
- Secure authentication flow

### Feedback System
- Real-time feedback submission
- Firebase database integration
- User-specific feedback management
- Delete functionality for own feedback

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- OpenWeather API for weather data
- Google Cloud Platform for authentication
- Firebase for database services
- Google Gemini API for recommendations
- All contributors and users of the app

## 📧 Contact
Your Name - Anjali Kashyap (mailto:anjalikashyap9608@gmail.com)

Project Link: [https://github.com/yourusername/weather-app](https://github.com/yourusername/weather-app)