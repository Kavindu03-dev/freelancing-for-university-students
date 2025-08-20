<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# FlexiHire Frontend

A modern React application for connecting freelancers with clients.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navigation.jsx  # Main navigation component
│   │   ├── Footer.jsx      # Footer component
│   │   └── Slideshow.jsx   # Hero slideshow component
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Main homepage
│   │   ├── SignIn.jsx      # Sign in page
│   │   ├── Join.jsx        # Registration page
│   │   └── AdminDashboard.jsx # Admin dashboard
│   ├── App.jsx             # Main app component with routing
│   ├── App.css             # Global styles
│   ├── index.css           # Base styles
│   └── main.jsx            # Entry point
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## Code Organization

### Components (`/src/components/`)
- **Navigation.jsx**: Main navigation bar with logo, menu items, and auth buttons
- **Footer.jsx**: Footer with company info, links, and copyright
- **Slideshow.jsx**: Interactive hero slideshow with statistics

### Pages (`/src/pages/`)
- **HomePage.jsx**: Complete homepage with all sections
- **SignIn.jsx**: User authentication page
- **Join.jsx**: User registration page
- **AdminDashboard.jsx**: Administrative interface

### App Structure
- **App.jsx**: Clean routing configuration using React Router
- **App.css**: Global styling and CSS variables
- **index.css**: Base CSS reset and typography

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component-Based Architecture**: Modular and reusable components
- **Routing**: Clean URL structure with React Router
- **Modern UI**: Beautiful gradients, animations, and hover effects
- **Accessibility**: Semantic HTML and keyboard navigation support

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technologies Used

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## Code Quality

- **Modular Structure**: Separated concerns into logical directories
- **Reusable Components**: Components can be easily reused across pages
- **Clean Imports**: Organized import statements and clear dependencies
- **Consistent Styling**: Unified design system with Tailwind CSS

## Future Improvements

- Add TypeScript for better type safety
- Implement state management (Redux/Context API)
- Add unit tests with Jest/React Testing Library
- Implement lazy loading for better performance
- Add error boundaries for better error handling
>>>>>>> 87693993d22806f0057d868825aad1267bd28e8d
