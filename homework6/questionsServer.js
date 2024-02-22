const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data from the request body
app.use(bodyParser.json());

// Middleware to handle session using cookies
app.use(cookieSession({
  name: 'session',
  keys: ['secret-key'],
}));

// Array to store the list of questions
const questions = [];

// Custom middleware to log the total time the request took
app.use((req, res, next) => {
  const startTime = new Date();
  res.on('finish', () => {
    const endTime = new Date();
    const elapsedTime = endTime - startTime;
    console.log(`Request ${req.method} ${req.originalUrl} processed in ${elapsedTime}ms`);
  });
  next();
});

// GET endpoint to return all questions as JSON
app.get('/questions', (req, res) => {
  res.json(questions);
});

// POST endpoint to add a new question
app.post('/questions', (req, res) => {
  const { text } = req.body;
  const id = uuidv4(); // Generate a unique ID for the question
  const question = { id, text, votes: 0 };

  questions.push(question);

  res.json(question);
});

// PUT endpoint to upvote a question
app.put('/questions/:id/upvote', (req, res) => {
  const { id } = req.params;
  const question = questions.find(q => q.id === id);

  if (question) {
    // Check if the question has already been upvoted using session
    if (!req.session.upvotedQuestions) {
      req.session.upvotedQuestions = [];
    }

    if (!req.session.upvotedQuestions.includes(id)) {
      question.votes += 1;
      req.session.upvotedQuestions.push(id);
      res.json(question);
    } else {
      res.status(400).json({ error: 'Question already upvoted' });
    }
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

// GET endpoint to retrieve a specific question by ID
app.get('/questions/:id', (req, res) => {
  const { id } = req.params;
  const question = questions.find(q => q.id === id);

  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});