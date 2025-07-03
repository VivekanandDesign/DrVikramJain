/**
 * Enhanced Express server for Dr. Vikram Jain's website
 * This server handles routing properly for all pages with improved navigation support
 * Version 2.0 with better route handling and proper path normalization
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(__dirname));

// Route handling
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle direct requests to HTML files in pages directory
app.get('/pages/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'pages', page);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next(); // Continue to 404 handler
  }
});

// Handle all pages in the pages directory without .html extension
app.get('/pages/:page', (req, res, next) => {
  let page = req.params.page;
  
  // Add .html if not present
  if (!page.endsWith('.html')) {
    page = `${page}.html`;
  }
  
  const filePath = path.join(__dirname, 'pages', page);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    next(); // Continue to 404 handler
  }
});

// Special route for about page (common direct navigation target)
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

// Special route for contact page (common direct navigation target)
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});

// Special route for services page (common direct navigation target)
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'services.html'));
});

// Handle 404s by showing custom 404 page
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.url}`);
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Pages directory: ${path.join(__dirname, 'pages')}`);
});
