const fetch = require('node-fetch');

async function loginAndGetToken() {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' })
  });
  const data = await response.json();
  const token = data.access_token;  // Directly access token, ensure it's without quotes
  return token;
}

async function fetchData(token, endpoint) {
  const response = await fetch(`http://localhost:3000/${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }  // Correctly format the Authorization header
  });
  const data = await response.json();
  console.log(`Data from ${endpoint}:`, JSON.stringify(data, null, 2));
}

async function main() {
  const token = await loginAndGetToken();
  console.log('Token retrieved:', token);
  await fetchData(token, 'users'); // Fetch all users
  await fetchData(token, 'users/1'); // Fetch single user
}

main();
