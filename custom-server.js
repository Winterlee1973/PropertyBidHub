// Simple Express server to serve static files
import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve test page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PropertyBid Platform</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f7f8fa;
          color: #333;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #2563eb;
          margin-top: 0;
        }
        .card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          background-color: #f8fafc;
        }
        .property-image {
          width: 100%;
          height: 200px;
          background-color: #e2e8f0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }
        .btn {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
        .property-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .property-price {
          font-weight: bold;
          font-size: 1.2rem;
          color: #2563eb;
        }
        .property-location {
          color: #64748b;
        }
        .test-buttons {
          margin-top: 30px;
        }
        .result {
          margin-top: 20px;
          background-color: #f1f5f9;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏠 PropertyBid Platform</h1>
        <p>Welcome to the PropertyBid platform! This is a demo version showing a simplified view of the application.</p>
        
        <div class="card">
          <div class="property-image">Property Image Placeholder</div>
          <div class="property-info">
            <div class="property-price">$650,000</div>
            <div class="property-location">Huntington, NY 11743</div>
          </div>
          <p>Beautiful 3 bedroom, 2 bath colonial in the heart of Huntington Village.</p>
          <button class="btn">View Details</button>
        </div>
        
        <div class="card">
          <div class="property-image">Property Image Placeholder</div>
          <div class="property-info">
            <div class="property-price">$525,000</div>
            <div class="property-location">Huntington Station, NY 11746</div>
          </div>
          <p>Renovated split-level home with 4 bedrooms and modern kitchen.</p>
          <button class="btn">View Details</button>
        </div>
        
        <div class="test-buttons">
          <h3>API Endpoints Test</h3>
          <button onclick="testProperties()" class="btn">Test /api/properties</button>
          <button onclick="testPropertyById()" class="btn">Test /api/properties/1</button>
          <button onclick="testCurrentUser()" class="btn">Test /api/user</button>
          
          <div class="result">
            <h4>Result:</h4>
            <pre id="result">Click a button to test an API endpoint...</pre>
          </div>
        </div>
      </div>
      
      <script>
        async function fetchAPI(endpoint) {
          try {
            const response = await fetch(endpoint);
            const data = await response.json();
            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
            return data;
          } catch (error) {
            document.getElementById('result').textContent = \`Error: \${error.message}\`;
            return null;
          }
        }
        
        function testProperties() {
          fetchAPI('/api/properties');
        }
        
        function testPropertyById() {
          fetchAPI('/api/properties/1');
        }
        
        function testCurrentUser() {
          fetchAPI('/api/user');
        }
      </script>
    </body>
    </html>
  `);
});

// Forward API requests to the main server
app.use('/api', (req, res) => {
  res.redirect(`http://localhost:5000${req.url}`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Custom server running at http://0.0.0.0:${PORT}`);
});