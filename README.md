# Dr. Vikram Jain's Website

This repository contains the website for Dr. Vikram Jain, a Clinical Immunologist & Rheumatologist.

## Development

To start the development server with live reloading:

```bash
# Using npm
npm run dev

# Or using the script
./dev-server.sh
```

The development server will be available at http://localhost:3000 (or next available port).

## Building for Production

To build the website for production:

```bash
# Using npm
npm run build

# Or using the script
./build.sh
```

This will create a `build` directory with all the necessary files for deployment.

## Serving the Production Build

To preview the production build locally:

```bash
# Using npm
npm run serve

# Or using serve directly
npx serve build
```

## Deployment

You can deploy the website to your preferred hosting service using the production build:

```bash
# Create a production build
./build.sh

# The build files will be in the 'build' directory
```

## Project Structure

- `index.html` - Main page
- `pages/` - Additional HTML pages
- `src/` - Source files
  - `css/` - Stylesheets
  - `js/` - JavaScript files
  - `images/` - Images and videos
  - `components/` - HTML components

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- JavaScript
- Browsersync for development
