const API_KEY = "63ea7696193a8b454b2775d132cb2a50";

// Replace OpenAI API key with Hugging Face API key (free to obtain)
// const HF_API_KEY = "your-hugging-face-api-key"; // Get this from huggingface.co

const GEMINI_API_KEY = "AIzaSyDOal6vThooDPnjXkvSnENNoh_GUERCEiQ"; // Get this from Google AI Studio

const form = document.getElementById("weatherForm");
const search = document.getElementById("search");
const weather = document.getElementById("weather");

const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");
const feedbackArray = [];

// Add this at the top of your file
const recommendationsCache = new Map();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch Weather
const getWeather = async (city) => {
  weather.innerHTML = `<h2>Loading...</h2>`;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    showWeather(data);
  } catch (error) {
    weather.innerHTML = `<h2>Error: ${error.message}</h2>`;
  }
};

// Update the showWeather function to include recommendations
const showWeather = async (data) => {
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  const weatherIcon = data.weather[0].icon;
  const weatherDesc = data.weather[0].description;

  weather.innerHTML = `
    <div class="weather-display">
      <div class="current-weather">
        <div class="weather-icon">
          <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDesc}" />
        </div>
        <div class="weather-info">
          <h2>${data.name}</h2>
          <h3 class="temperature">${temp}°C</h3>
          <h4 class="weather-main">${data.weather[0].main}</h4>
          <div class="weather-details">
            <p><i class="fas fa-tint"></i> Humidity: ${humidity}%</p>
            <p><i class="fas fa-wind"></i> Wind Speed: ${speed} m/s</p>
          </div>
        </div>
      </div>

      <div class="recommendations-container">
        <h2>Weather Recommendations</h2>
        
        <div class="recommendation-section clothing">
          <h3><i class="fas fa-tshirt"></i> Clothing</h3>
          <ul>
            <li>${getClothingRecommendation(temp, weatherDesc)}</li>
            <li>${getAccessoryRecommendation(weatherDesc)}</li>
          </ul>
        </div>

        <div class="recommendation-section activities">
          <h3><i class="fas fa-running"></i> Activities</h3>
          <ul>
            <li>${getActivityRecommendation(temp, weatherDesc, speed)}</li>
            <li>Stay hydrated throughout the day</li>
          </ul>
        </div>

        <div class="recommendation-section health">
          <h3><i class="fas fa-heartbeat"></i> Health & Safety</h3>
          <ul>
            <li>${getHealthRecommendation(weatherDesc, humidity)}</li>
            <li>${getAirQualityRecommendation(weatherDesc)}</li>
          </ul>
        </div>
      </div>
    </div>
  `;
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

// Handle Feedback Submission
feedbackForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const feedback = document.getElementById("feedback").value.trim();
  if (feedback) {
    feedbackArray.push(feedback);
    document.getElementById("feedback").value = "";
    displayFeedback();
  } else {
    alert("Please enter your feedback before submitting.");
  }
});

// Display Feedback with Scrollable List
const displayFeedback = () => {
  // Clear existing feedback items
  feedbackList.innerHTML = "";

  // Add feedback items to the list
  feedbackArray.forEach((item, index) => {
    const feedbackItem = document.createElement("p");
    feedbackItem.textContent = `${index + 1}. ${item}`;
    feedbackList.appendChild(feedbackItem);
  });

  // Ensure the latest feedback is visible
  feedbackList.scrollTop = feedbackList.scrollHeight;
};
