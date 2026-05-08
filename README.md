# Weather Application

A weather forecast app built with React and TypeScript, using the Open-Meteo API to show real-time weather for any location.

## Live Demo

https://weather-application-cyan-theta.vercel.app/

## Features

- Search any city with autocomplete
- Use your current location
- Current conditions — temperature, humidity, wind, UV index
- 7-day and hourly forecast
- Filter by Today, 3 days, or 7 days
- Switch between Celsius and Fahrenheit
- Responsive on mobile and desktop

## Tech Stack

- React 18, TypeScript, Sass CSS Modules
- Vite, Axios
- Vitest and React Testing Library for tests
- GitHub Actions for CI/CD, Vercel for deployment

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/KhangLeThanh/weather-application
cd weather-application
npm install
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run test:run   # run all tests once
```

## Testing

Tests are placed next to their source files. Run them with:

```bash
npm run test:run
```

## Deployment

The app is deployed on Vercel. GitHub Actions runs tests and a build check on every push to `main` and on every pull request. If tests pass, Vercel automatically deploys the latest version.
