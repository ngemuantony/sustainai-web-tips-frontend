# SustainAI Tips Frontend

A modern, responsive web application that provides personalized sustainability tips using AI. Built with Next.js, React Bootstrap, and integrated with a Flask backend using the Google Gemini AI API.

## Features

- 🌱 Personalized sustainability tips based on location and habits
- 📱 Responsive, mobile-friendly design
- 🎨 Beautiful card-based UI with animations
- 🔍 Tips organized into categories for better readability
- ⚡ Real-time AI-powered suggestions
- 🎯 Actionable and location-specific recommendations

## Tech Stack

- **Framework**: Next.js with TypeScript
- **UI Library**: React Bootstrap
- **Styling**: CSS-in-JS with styled-jsx
- **HTTP Client**: Axios
- **Markdown Rendering**: react-markdown

## Getting Started

1. **Install Dependencies**

```bash
npm install
# or
yarn install
```

2. **Environment Setup**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
frontend/
├── pages/              # Next.js pages
│   └── index.tsx      # Main application page
├── public/            # Static assets
├── styles/           # Global styles
└── package.json      # Project dependencies
```

## Key Components

### Main Page (`pages/index.tsx`)

The main page consists of:
- Form for user input (location and habits)
- Card-based display of sustainability tips
- Category-based organization of tips
- Loading states and error handling
- Responsive design elements

## Styling

The application uses a combination of:
- React Bootstrap for layout and components
- Custom CSS using styled-jsx for enhanced styling
- CSS variables for consistent theming
- Animations for better user experience

## API Integration

The frontend communicates with the Flask backend using Axios:
- POST request to `/api/tips` endpoint
- Sends location and habits data
- Receives categorized sustainability tips
- Handles loading states and errors

## Best Practices

- TypeScript for type safety
- Component-based architecture
- Responsive design principles
- Error handling and loading states
- Clean and maintainable code structure
- Consistent styling patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning and development!
