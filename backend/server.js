// CommunityHub API — scaffold (Lesson 19, Task 19.2)
// One member per team commits this on setup/backend-scaffold -> PR -> review -> merge.
// Lesson 20 replaces the routes below with src/app.js.

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to CommunityHub API');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 for anything not matched above — must come after every route.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
