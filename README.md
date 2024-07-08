#weatherAPI

weatherAPI is a simple web server deployed on Vercel, providing an API endpoint to greet visitors with their location-based weather information.

## API Endpoint

**_Endpoint_**: `https://weatheapi-eziagors-projects.vercel.app/api/hello?visitor_name=Ifeanyi`

Response Example:

```
{
  "client_ip": "127.0.0.1",
  "location": "New York",
  "greeting": "Hello, Ifeanyi! The temperature is 11 degrees Celsius in New York."
}

```

## Setup and Deployment

1. Clone the Repository:

```
git clone https://github.com/Vestertech/weatherAPI
cd weatherAPI

```

2. Install Dependencies:

```
npm install
```

3. start application

```
npm run start
```

## Technologies Used

- Node.js
- Express.js
- IPinfo (for IP geolocation)
- OpenWeatherMap API (for weather data)
