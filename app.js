const API_KEY = "63ea7696193a8b454b2775d132cb2a50";

const form = document.getElementById("weatherForm");
const search = document.getElementById("search");
const weather = document.getElementById("weather");

const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");
const feedbackArray = [];

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

const showWeather = (data) => {
  const { temp, humidity } = data.main;
  const { speed } = data.wind;
  const weatherIcon = data.weather[0].icon;

  weather.innerHTML = `
    <div class="weather-icon">
      <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${data.weather[0].description}" />
    </div>
    <div class="weather-info">
      <h3>${temp}°C</h3>
      <h4>${data.weather[0].main}</h4>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${speed} m/s</p>
    </div>
  `;
};

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
