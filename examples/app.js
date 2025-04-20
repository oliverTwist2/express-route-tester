import express from 'express';

const app = express();

app.use(express.json());

// Custom Middleware to validate request body
function validateRequestBody(req, res, next) {
  const { title, year } = req.body;
  if (!title || !year) {
    return res.status(400).send('Invalid request body');
  }
  next();
}

app.get('/movies', function getAllMovies(req, res) {
  res.send('All movies');
});

app.post('/movies', validateRequestBody, function createMovie(req, res) {
  res.send('Create movie');
});

// make another route with the same path and method to test conflict detection
app.post('/movies', function createAnotherMovie(req, res) {
  res.send('Create another movie');
});

export default app;
