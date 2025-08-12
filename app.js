// Use config object instead of process.env
const WEATHER_API_KEY = config.WEATHER_API_KEY;
const GEMINI_API_KEY = config.GEMINI_API_KEY;

const form = document.getElementById("weatherForm");
const search = document.getElementById("search");
const weatherCard = document.querySelector(".weather-card");
const weatherInfo = document.querySelector(".weather-info");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const recommendations = document.getElementById("recommendations");

const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");
const feedbackArray = [];

// Add this at the top of your file
const recommendationsCache = new Map();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add this after your existing constants
const database = firebase.database();

// Check authentication
window.onload = function() {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set user profile information
    const user = JSON.parse(userProfile);
    document.getElementById('userAvatar').src = user.picture;
    document.getElementById('userName').textContent = user.name;
}

// Add this function for sign out
function handleSignOut() {
    localStorage.removeItem('userProfile');
    window.location.href = 'login.html';
}

// Fetch Weather
const getWeather = async (city) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    showWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<h2>Error: ${error.message}</h2>`;
  }
};

// Update the showWeather function to include recommendations
const showWeather = async (data) => {
  const { temp, humidity, pressure } = data.main;
  const { speed } = data.wind;
  const weatherIcon = data.weather[0].icon;
  const weatherDesc = data.weather[0].description;

  // Update weather info
  temperature.textContent = `${temp}°C`;
  condition.textContent = weatherDesc;
  humidity.textContent = humidity;
  wind.textContent = speed;
  pressure.textContent = pressure;

  // Update weather icon
  const weatherIconElement = document.querySelector(".weather-icon img");
  weatherIconElement.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  weatherIconElement.alt = weatherDesc;

  // Generate and display recommendations
  const recommendationsHtml = await getWeatherRecommendations(data);
  recommendations.innerHTML = recommendationsHtml;
};

// Helper functions for specific recommendations
function getClothingRecommendation(temp, weather) {
  if (temp > 28) {
    return 'Wear light, breathable clothing such as cotton or linen to stay cool';
  } else if (temp > 20) {
    return 'Light clothing with optional light layers for comfort';
  } else if (temp > 15) {
    return 'Comfortable clothing with light layers';
  } else {
    return 'Wear warm, layered clothing';
  }
}

function getAccessoryRecommendation(weather) {
  if (weather.includes('smoke')) {
    return 'Consider wearing a protective mask due to smoke conditions';
  } else if (weather.includes('rain')) {
    return 'Carry an umbrella and wear water-resistant clothing';
  } else {
    return 'Carry sunglasses and sun protection if going outdoors';
  }
}

function getActivityRecommendation(temp, weather, windSpeed) {
  if (weather.includes('smoke')) {
    return 'Limit outdoor activities due to smoke conditions. Indoor activities recommended.';
  } else if (temp > 30) {
    return 'Avoid strenuous outdoor activities during peak heat. Early morning or evening activities recommended.';
  } else if (windSpeed > 5) {
    return 'Be cautious with outdoor activities due to wind conditions';
  } else {
    return 'Weather is suitable for most outdoor activities';
  }
}

function getHealthRecommendation(weather, humidity) {
  if (weather.includes('smoke')) {
    return 'People with respiratory conditions should take extra precautions';
  } else if (humidity > 70) {
    return 'High humidity - stay hydrated and watch for heat exhaustion';
  } else {
    return 'Maintain regular hydration and sun protection';
  }
}

function getAirQualityRecommendation(weather) {
  if (weather.includes('smoke')) {
    return 'Poor air quality - consider using air purifiers indoors and limit outdoor exposure';
  } else {
    return 'Monitor local air quality updates';
  }
}

// Modify getWeatherRecommendations to use caching
const getWeatherRecommendations = async (weatherData) => {
  try {
    const prompt = `Based on the following weather data for ${weatherData.name}, provide recommendations for clothing, activities, and safety precautions:
    Temperature: ${weatherData.main.temp}°C
    Weather: ${weatherData.weather[0].main} (${weatherData.weather[0].description})
    Humidity: ${weatherData.main.humidity}%
    Wind Speed: ${weatherData.wind.speed} m/s
    Please format the response with appropriate sections.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return generateStaticRecommendations(weatherData);
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return generateStaticRecommendations(weatherData);
  }
};

function generateStaticRecommendations(weatherData) {
  const temp = weatherData.main.temp;
  const weather = weatherData.weather[0].description;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  let clothingRec = '';
  if (temp > 25) {
    clothingRec = 'light, breathable clothing like cotton t-shirts and shorts';
  } else if (temp > 15) {
    clothingRec = 'comfortable clothing with light layers';
  } else {
    clothingRec = 'warm clothing, consider wearing layers';
  }

  return `
    <div class="weather-recommendations">
      <h3>Weather Recommendations for ${weatherData.name}</h3>
      <div class="recommendation-section">
        <h4>Clothing</h4>
        <p>With the temperature at ${temp}°C, wear ${clothingRec}.</p>
      </div>
      <div class="recommendation-section">
        <h4>Current Conditions</h4>
        <ul>
          <li>Weather: ${weather}</li>
          <li>Humidity: ${humidity}% - ${humidity > 70 ? 'High humidity, dress accordingly' : 'Comfortable humidity levels'}</li>
          <li>Wind: ${windSpeed} m/s - ${windSpeed > 5 ? 'Consider wind protection' : 'Mild wind conditions'}</li>
        </ul>
      </div>
      <div class="recommendation-section">
        <h4>General Advice</h4>
        <ul>
          <li>Stay hydrated</li>
          <li>Check local weather updates</li>
          <li>${temp > 30 ? 'Avoid prolonged sun exposure' : temp < 10 ? 'Protect against cold' : 'Enjoy the moderate weather'}</li>
        </ul>
      </div>
    </div>
  `;
}

function formatRecommendations(data) {
  // Extract the text content from the response
  const recommendations = data.candidates[0].content.parts[0].text;
  
  // Parse the markdown-style text into sections
  const sections = recommendations.split('**').filter(section => section.trim());
  
  // Create HTML structure
  let html = `
    <div class="recommendations-container">
      <h2>Weather Recommendations for Mumbai</h2>
  `;

  sections.forEach(section => {
    if (section.includes('I. Clothing')) {
      html += createSection('Clothing Recommendations', section, 'category-clothing');
    } else if (section.includes('II. Activity')) {
      html += createSection('Activity Recommendations', section, 'category-activities');
    } else if (section.includes('III. Safety')) {
      html += createSection('Safety Precautions', section, 'category-safety');
    } else if (section.includes('Important Note')) {
      html += `
        <div class="important-note">
          <strong>Important Note:</strong>
          ${section.split(':')[1]}
        </div>
      `;
    }
  });

  html += '</div>';
  return html;
}

function createSection(title, content, categoryClass) {
  // Extract bullet points
  const bulletPoints = content.match(/\*([^*]+)/g) || [];
  
  return `
    <div class="recommendation-section ${categoryClass}">
      <h2>${title}</h2>
      <ul class="recommendation-list">
        ${bulletPoints.map(point => `
          <li>${point.replace('*', '').trim()}</li>
        `).join('')}
      </ul>
    </div>
  `;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = search.value.trim();
  if (city) getWeather(city);
});

// Update the feedback submission handler
feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const feedback = document.getElementById("feedback").value.trim();
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (feedback) {
        const feedbackItem = {
            text: feedback,
            user: {
                name: userProfile.name,
                picture: userProfile.picture,
                email: userProfile.email,
                id: userProfile.id
            },
            timestamp: new Date().toISOString()
        };
        
        try {
            // Save to Firebase
            await database.ref('feedback').push(feedbackItem);
            document.getElementById("feedback").value = "";
        } catch (error) {
            console.error("Error saving feedback:", error);
            alert("Error saving feedback. Please try again.");
        }
    } else {
        alert("Please enter your feedback before submitting.");
    }
});

// Add real-time feedback listener
function initializeFeedbackListener() {
    const feedbackRef = database.ref('feedback');
    feedbackRef.on('value', (snapshot) => {
        const feedbackData = snapshot.val();
        displayFeedback(feedbackData);
    });
}

// Update the display feedback function
const displayFeedback = (feedbackData) => {
    feedbackList.innerHTML = "";
    
    if (feedbackData) {
        const currentUser = JSON.parse(localStorage.getItem('userProfile'));
        
        // Convert to array and sort by timestamp
        const feedbackArray = Object.entries(feedbackData)
            .map(([key, value]) => ({
                id: key,
                ...value
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        feedbackArray.forEach((item) => {
            const feedbackItem = document.createElement("div");
            feedbackItem.className = "feedback-item";
            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <img src="${item.user.picture}" alt="${item.user.name}" class="user-avatar">
                    <span class="user-name">${item.user.name}</span>
                    <span class="timestamp">${new Date(item.timestamp).toLocaleString()}</span>
                    ${item.user.id === currentUser.id ? 
                        `<button onclick="deleteFeedback('${item.id}')" class="delete-btn">Delete</button>` : 
                        ''}
                </div>
                <div class="feedback-text">${item.text}</div>
            `;
            feedbackList.appendChild(feedbackItem);
        });
    }
    
    feedbackList.scrollTop = feedbackList.scrollHeight;
};

// Add delete functionality
async function deleteFeedback(feedbackId) {
    try {
        await database.ref(`feedback/${feedbackId}`).remove();
        // UI will update automatically through the listener
    } catch (error) {
        console.error("Error deleting feedback:", error);
        alert("Error deleting feedback. Please try again.");
    }
}

// Make deleteFeedback available globally
window.deleteFeedback = deleteFeedback;

// Update your existing window.onload
const existingOnload = window.onload;
window.onload = function() {
    // Call existing onload for Google Auth
    existingOnload?.();
    
    // Initialize feedback listener
    initializeFeedbackListener();
};
