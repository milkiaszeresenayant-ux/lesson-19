// ============================================
// LESSON 19 — CLASS EXERCISE
// CommunityHub posts API, read-only: GET endpoints, params, query strings.
// Week 10 · Tasks 19.3 and 19.4 (GET half) · Daily challenge Day 3 (bonus step)
//
// Lives in:  backend/exercises/{username}/posts-api.js   ({username} = your GitHub username)
// Move this file there first. Run from backend/:   node --watch exercises/{username}/posts-api.js
// Test with:           posts-api.http (VS Code REST Client), Thunder Client, Postman or curl
// ============================================

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data. Restart the server and every change is gone (Lesson 21 fixes that).
const posts = [
  {
    id: 1,
    title: 'Getting Started with Node.js',
    content: 'Node.js runs JavaScript outside the browser.',
    author: 'amina',
    createdAt: '2026-11-02T09:00:00Z',
    likes: 12,
  },
  {
    id: 2,
    title: 'Express Routing in Ten Minutes',
    content: 'A route is a method, a path and a handler.',
    author: 'brian',
    createdAt: '2026-11-05T14:30:00Z',
    likes: 30,
  },
  {
    id: 3,
    title: 'Why Status Codes Matter',
    content: '200, 201, 400, 404: the client reads the number first.',
    author: 'amina',
    createdAt: '2026-11-08T08:15:00Z',
    likes: 7,
  },
  {
    id: 4,
    title: 'Query Strings vs Route Params',
    content: 'Params name the thing. Query strings filter the list.',
    author: 'cyrus',
    createdAt: '2026-11-10T17:45:00Z',
    likes: 19,
  },
];

// STEP 1 — GIVEN. Text and JSON responses. Run the file, open both URLs in the browser.
app.get('/', (req, res) => {
  res.send('Welcome to CommunityHub API');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// STEP 2 — List all posts.
// TODO(class): GET /api/posts responds with { posts: [...] }.
//   Shape it as an object, not a bare array — STEP 5 adds a `pagination` key beside it.
app.get('/api/posts', (req, res) => {
  const author = typeof req.query.author === 'string' ? req.query.author : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';

  if (!['newest', 'oldest', 'popular'].includes(sort)) {
    return res.status(400).json({ error: 'sort must be newest, oldest or popular' });
  }

  let result = [...posts];

  if (author) {
    const normalizedAuthor = author.toLowerCase();
    result = result.filter((post) => post.author.toLowerCase() === normalizedAuthor);
  }

  if (search) {
    const normalizedSearch = search.toLowerCase();
    result = result.filter((post) => post.title.toLowerCase().includes(normalizedSearch));
  }

  if (sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    result.sort((a, b) => b.likes - a.likes);
  }

  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);

  if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(limit) || limit <= 0) {
    return res.status(400).json({ error: 'page and limit must be positive whole numbers' });
  }

  const total = result.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedPosts = result.slice(start, start + limit);

  return res.json({
    posts: paginatedPosts,
    pagination: { page, limit, total, pages },
  });
});

// STEP 3 — One post by id.
app.get('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Post id must be a whole number' });
  }

  const post = posts.find((item) => item.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.json(post);
});

// STEP 6 — 404 for every unmatched route.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Posts API running at http://localhost:${PORT}`);
});

// STEP 7 — Commit (from the team repo root, on your own branch):
//   git checkout -b exercises/{username}-week10
//   git add backend/exercises/{username}/
//   git commit -m "Add: Lesson 19 read-only posts API"
//   git push -u origin exercises/{username}-week10
//   Open a PR, request a teammate's review. Do not merge your own.
