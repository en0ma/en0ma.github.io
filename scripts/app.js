const app = Vue.createApp({
  data() {
    return {
      user: {},
      weather: {},
      wordData: {},
      city: 'London',
      province: 'Ontario',
      country: 'Canada',
      word: '',
      userError: '',
      weatherError: '',
      dictionaryError: ''
    }
  },

  computed: {
    fullName() {
      if (!this.user.name) return '';
      return this.user.name.toUpperCase();
    },
    weatherSummary() {
      if (!this.weather.temperature) return '';
      return `${this.weather.temperature}°C, ${this.weather.wind_speed} km/h, ${this.weather.description}`;
    },
    hasDefinition() {
      return this.wordData && this.wordData.meanings && this.wordData.meanings.length > 0;
    }
  },

  methods: {
    async getUser() {
      try {
        this.userError = '';
        const res = await fetch('https://randomuser.me/api/');
        if (!res.ok) throw new Error();
        const data = await res.json();
        this.user = {
          name: data['results'][0].name.first + ' ' + data['results'][0].name.last,
          age: data['results'][0].dob.age,
          avatar: data['results'][0].picture.large
        };
      } catch {
        this.userError = 'Error loading user profile.';
      }
    },

    async getWeather() {
      try {
        this.weatherError = '';
        const url = `https://api.weatherstack.com/current?access_key=9bebae38a4b4b1daae25bf2e6dc913cd&query=${this.city},${this.province},${this.country}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        this.weather = {
          temperature: data.current.temperature,
          description: data.current.weather_descriptions[0],
          wind_speed: data.current.wind_speed
        };
      } catch {
        this.weatherError = 'Could not load weather data.';
      }
    },

    async defineWord() {
      try {
        this.dictionaryError = '';
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        this.wordData = data[0];
      } catch {
        this.dictionaryError = 'Definition not found.';
      }
    }
  },

  mounted() {
    this.getUser();
    this.getWeather();
  }
});

app.mount('#app');
