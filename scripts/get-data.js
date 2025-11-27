require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;
const CREDENTIALS = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');

// Top 50 US Cities
const cities = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "Indianapolis, IN", "San Francisco, CA", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
  "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Mesa, AZ",
  "Sacramento, CA", "Atlanta, GA", "Kansas City, MO", "Colorado Springs, CO", "Omaha, NE",
  "Raleigh, NC", "Miami, FL", "Long Beach, CA", "Virginia Beach, VA", "Oakland, CA",
  "Minneapolis, MN", "Tulsa, OK", "Arlington, TX", "Tampa, FL", "New Orleans, LA"
];

const services = ['Sushi', 'Pizza', 'Plumber'];

// Generate queries
const queries = [];
for (const city of cities) {
  for (const service of services) {
    queries.push(`${service} in ${city}`);
  }
}

async function fetchData(keyword) {
  const postData = [{
    keyword: keyword,
    location_name: "United States",
    language_code: "en",
    device: "desktop",
    os: "windows",
    depth: 10
  }];

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
      headers: {
        'Authorization': `Basic ${CREDENTIALS}`,
        'Content-Type': 'application/json'
      },
      data: postData
    });

    const tasks = response.data.tasks;
    if (!tasks || tasks.length === 0) {
      console.warn(`No tasks returned for keyword: ${keyword}`);
      return [];
    }

    const result = tasks[0].result;
    if (!result || result.length === 0) {
      console.warn(`No results found for keyword: ${keyword}`);
      return [];
    }

    // DataForSEO Maps API usually returns items in result[0].items
    const items = result[0].items;
    if (!items) {
      return [];
    }

    return items.map(item => ({
      name: item.title,
      address: item.address,
      rating: item.rating ? item.rating.value : null,
      phone: item.phone,
      keyword: keyword
    }));

  } catch (error) {
    console.error(`Error fetching data for ${keyword}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

async function main() {
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
    console.error('Error: DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set in .env file.');
    process.exit(1);
  }

  let allResults = [];

  console.log(`Starting data fetch for ${queries.length} queries...`);

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    console.log(`[${i + 1}/${queries.length}] Fetching data for: ${query}`);
    const data = await fetchData(query);
    console.log(`Found ${data.length} results.`);
    allResults = [...allResults, ...data];
    
    // Wait a bit between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Define output path: src/lib/seeds.json
  const outputDir = path.join(__dirname, '../src/lib');
  const outputPath = path.join(outputDir, 'seeds.json');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
  console.log(`\nSuccess! Saved ${allResults.length} items to ${outputPath}`);
}

main();
