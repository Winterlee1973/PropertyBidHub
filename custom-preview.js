// Simple Express server to serve a custom preview
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if they exist
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Serve test page showing demo data
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
          max-width: 1200px;
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
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .search-bar {
          display: flex;
          width: 60%;
        }
        .search-bar input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 4px 0 0 4px;
          font-size: 16px;
        }
        .search-bar button {
          padding: 10px 15px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
        }
        .auth-buttons button {
          margin-left: 10px;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        .login-btn {
          background-color: white;
          color: #2563eb;
          border: 1px solid #2563eb;
        }
        .signup-btn {
          background-color: #2563eb;
          color: white;
          border: none;
        }
        .properties {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .property-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .property-image {
          width: 100%;
          height: 200px;
          background-color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .property-details {
          padding: 15px;
        }
        .property-price {
          font-weight: bold;
          font-size: 1.2rem;
          color: #2563eb;
          margin-bottom: 5px;
        }
        .property-location {
          color: #64748b;
          margin-bottom: 10px;
        }
        .property-features {
          display: flex;
          gap: 15px;
          color: #64748b;
          margin-bottom: 15px;
        }
        .btn {
          display: block;
          width: 100%;
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          font-weight: 500;
        }
        .test-buttons {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .test-buttons h3 {
          margin-top: 0;
        }
        .test-buttons button {
          margin-right: 10px;
        }
        .result {
          margin-top: 20px;
          background-color: #f1f5f9;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        }
        pre {
          margin: 0;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 PropertyBid</h1>
          <div class="search-bar">
            <input type="text" placeholder="Search by city, zip code or address...">
            <button>Search</button>
          </div>
          <div class="auth-buttons">
            <button class="login-btn">Log In</button>
            <button class="signup-btn">Sign Up</button>
          </div>
        </div>
        
        <p>Welcome to PropertyBid, where you can find your dream home and place competitive bids.</p>
        
        <div class="properties">
          <div class="property-card">
            <div class="property-image">Property Image</div>
            <div class="property-details">
              <div class="property-price">$650,000</div>
              <div class="property-location">Huntington, NY 11743</div>
              <div class="property-features">
                <span>3 bed</span>
                <span>2 bath</span>
                <span>2,100 sqft</span>
              </div>
              <a href="#" class="btn">View Details</a>
            </div>
          </div>
          
          <div class="property-card">
            <div class="property-image">Property Image</div>
            <div class="property-details">
              <div class="property-price">$525,000</div>
              <div class="property-location">Huntington Station, NY 11746</div>
              <div class="property-features">
                <span>4 bed</span>
                <span>2.5 bath</span>
                <span>2,400 sqft</span>
              </div>
              <a href="#" class="btn">View Details</a>
            </div>
          </div>
          
          <div class="property-card">
            <div class="property-image">Property Image</div>
            <div class="property-details">
              <div class="property-price">$785,000</div>
              <div class="property-location">Cold Spring Harbor, NY 11724</div>
              <div class="property-features">
                <span>5 bed</span>
                <span>3 bath</span>
                <span>3,200 sqft</span>
              </div>
              <a href="#" class="btn">View Details</a>
            </div>
          </div>
          
          <div class="property-card">
            <div class="property-image">Property Image</div>
            <div class="property-details">
              <div class="property-price">$495,000</div>
              <div class="property-location">Greenlawn, NY 11740</div>
              <div class="property-features">
                <span>3 bed</span>
                <span>1.5 bath</span>
                <span>1,800 sqft</span>
              </div>
              <a href="#" class="btn">View Details</a>
            </div>
          </div>
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
  console.log(`Forwarding API request to: ${req.url}`);
  res.redirect(`http://localhost:5000/api${req.url}`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Preview server running at http://0.0.0.0:${PORT}`);
});