
    // --- Configuration ---
    // To use real data, get a free API key from https://openweathermap.org/
    // Replace 'YOUR_API_KEY' below and uncomment the API_URL.
    const API_KEY = null; // 'YOUR_API_KEY';
    const USE_MOCK_DATA = true; // Set to false if using real API

    // --- Mock Data ---
    const mockData = {
      current: {
        name: "San Francisco",
        temp: 18,
        feels_like: 16,
        weather: [{ main: "Clouds", description: "Partly Cloudy" }],
        wind: { speed: 12 },
        humidity: 65,
        visibility: 10000,
        pressure: 1013,
        sunrise: 1698482520,
        sunset: 1698522480,
        uvi: 4
      },
      forecast: [
        { day: "Mon", temp: 19, icon: "sun", condition: "Sunny" },
        { day: "Tue", temp: 17, icon: "cloud", condition: "Cloudy" },
        { day: "Wed", temp: 15, icon: "rain", condition: "Rain" },
        { day: "Thu", temp: 16, icon: "cloud-sun", condition: "Partly Cloudy" },
        { day: "Fri", temp: 20, icon: "sun", condition: "Sunny" },
        { day: "Sat", temp: 21, icon: "sun", condition: "Clear" },
        { day: "Sun", temp: 18, icon: "cloud", condition: "Overcast" }
      ],
      cities: {
        "london": { name: "London", temp: 12, feels_like: 10, weather: [{ main: "Rain", description: "Light Rain" }], wind: { speed: 20 }, humidity: 85, visibility: 8000, pressure: 1008 },
        "tokyo": { name: "Tokyo", temp: 24, feels_like: 26, weather: [{ main: "Clear", description: "Clear Sky" }], wind: { speed: 8 }, humidity: 50, visibility: 12000, pressure: 1015 },
        "new york": { name: "New York", temp: 15, feels_like: 13, weather: [{ main: "Clouds", description: "Overcast" }], wind: { speed: 15 }, humidity: 70, visibility: 9000, pressure: 1010 }
      }
    };

    // --- DOM Elements ---
    const elements = {
      bg: document.getElementById('weatherBg'),
      city: document.getElementById('cityName'),
      date: document.getElementById('currentDate'),
      temp: document.getElementById('currentTemp'),
      desc: document.getElementById('weatherDesc'),
      feels: document.getElementById('feelsLike'),
      wind: document.getElementById('windSpeed'),
      humidity: document.getElementById('humidity'),
      visibility: document.getElementById('visibility'),
      pressure: document.getElementById('pressure'),
      icon: document.getElementById('weatherIconContainer'),
      uv: document.getElementById('uvIndex'),
      sunrise: document.getElementById('sunrise'),
      sunset: document.getElementById('sunset'),
      forecast: document.getElementById('forecastContainer'),
      search: document.getElementById('searchInput')
    };

    // --- Weather Icons (SVG Strings) ---
    const icons = {
      sun: `
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="sun-glow absolute w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-30 blur-xl"></div>
          <svg class="sun-icon w-24 h-24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="#fbbf24"/>
            <g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
              <line x1="50" y1="10" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="90"/>
              <line x1="10" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="90" y2="50"/>
              <line x1="22" y1="22" x2="29" y2="29"/><line x1="71" y1="71" x2="78" y2="78"/>
              <line x1="22" y1="78" x2="29" y2="71"/><line x1="71" y1="29" x2="78" y2="22"/>
            </g>
          </svg>
        </div>
      `,
      cloud: `
        <div class="absolute inset-0 flex items-center justify-center cloud-float">
          <svg class="w-28 h-28" viewBox="0 0 100 80" fill="#94a3b8">
            <path d="M25,60 Q10,60 10,45 Q10,30 25,30 Q25,15 45,15 Q65,15 65,30 Q80,30 80,45 Q80,60 65,60 Z" />
          </svg>
        </div>
      `,
      rain: `
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-20 h-20 absolute z-10" viewBox="0 0 100 80" fill="#64748b">
            <path d="M25,50 Q10,50 10,40 Q10,28 25,28 Q25,15 45,15 Q65,15 65,28 Q80,28 80,40 Q80,50 65,50 Z" />
          </svg>
          <div class="absolute bottom-4 flex gap-3">
            <div class="w-1 h-6 bg-blue-400 rounded-full rain-drop" style="animation-delay: 0s;"></div>
            <div class="w-1 h-6 bg-blue-400 rounded-full rain-drop" style="animation-delay: 0.3s;"></div>
            <div class="w-1 h-6 bg-blue-400 rounded-full rain-drop" style="animation-delay: 0.6s;"></div>
            <div class="w-1 h-6 bg-blue-400 rounded-full rain-drop" style="animation-delay: 0.2s;"></div>
          </div>
        </div>
      `,
      'cloud-sun': `
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="absolute top-4 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-80"></div>
          <svg class="w-24 h-24 absolute bottom-2 left-4 cloud-float" viewBox="0 0 100 80" fill="#cbd5e1">
            <path d="M25,60 Q10,60 10,45 Q10,30 25,30 Q25,15 45,15 Q65,15 65,30 Q80,30 80,45 Q80,60 65,60 Z" />
          </svg>
        </div>
      `
    };

    // --- Helper Functions ---
    function formatTime(timestamp) {
      return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function formatDate() {
      return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    function getWeatherIcon(weatherMain) {
      switch(weatherMain.toLowerCase()) {
        case 'clear': return 'sun';
        case 'rain': return 'rain';
        case 'clouds': return 'cloud';
        default: return 'cloud-sun';
      }
    }

    function updateBackground(weatherMain) {
      elements.bg.className = 'weather-bg';
      switch(weatherMain.toLowerCase()) {
        case 'clear': elements.bg.classList.add('sunny'); break;
        case 'rain': elements.bg.classList.add('rainy'); break;
        default: elements.bg.classList.add('cloudy');
      }
    }

    // --- Render Functions ---
    function renderForecast(forecastData) {
      elements.forecast.innerHTML = forecastData.map(day => `
        <div class="flex-shrink-0 w-28 p-4 rounded-xl text-center transition-all hover:scale-105" style="background: rgba(255,255,255,0.05);">
          <p class="text-sm font-medium mb-2">${day.day}</p>
          <div class="w-10 h-10 mx-auto mb-2">
            ${getSmallIcon(day.icon)}
          </div>
          <p class="text-lg font-bold">${day.temp}°</p>
          <p class="text-xs" style="color: var(--muted);">${day.condition}</p>
        </div>
      `).join('');
    }

    function getSmallIcon(type) {
      switch(type) {
        case 'sun': return `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" class="w-full h-full"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
        case 'rain': return `<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" class="w-full h-full"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8" y2="20"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="16" y1="16" x2="16" y2="20"/></svg>`;
        default: return `<svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" class="w-full h-full"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`;
      }
    }

    function updateUI(data) {
      elements.city.textContent = data.name;
      elements.date.textContent = formatDate();
      elements.temp.textContent = `${Math.round(data.temp)}°`;
      elements.desc.textContent = data.weather[0].description;
      elements.feels.textContent = `Feels like ${Math.round(data.feels_like)}°`;
      elements.wind.textContent = `${data.wind.speed} km/h`;
      elements.humidity.textContent = `${data.humidity}%`;
      elements.visibility.textContent = `${data.visibility / 1000} km`;
      elements.pressure.textContent = `${data.pressure} hPa`;
      
      // Icon and Background
      const iconType = getWeatherIcon(data.weather[0].main);
      elements.icon.innerHTML = icons[iconType] || icons['cloud-sun'];
      updateBackground(data.weather[0].main);
      
      // Sunrise/Sunset (use current time if not provided)
      if (data.sunrise && data.sunset) {
        elements.sunrise.textContent = formatTime(data.sunrise);
        elements.sunset.textContent = formatTime(data.sunset);
      } else {
        elements.sunrise.textContent = "06:30";
        elements.sunset.textContent = "19:15";
      }
    }

    // --- Event Listeners ---
    elements.search.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        
        if (USE_MOCK_DATA) {
          // Mock search logic
          const cityData = mockData.cities[query];
          if (cityData) {
            updateUI(cityData);
          } else {
            alert("City not found in mock data. Try: London, Tokyo, or New York");
          }
        } else {
          // Real API logic would go here
          console.log("Fetch real data for:", query);
        }
      }
    });

    // --- Initialize ---
    document.addEventListener('DOMContentLoaded', () => {
      updateUI(mockData.current);
      renderForecast(mockData.forecast);
    });