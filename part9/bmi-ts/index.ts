import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  console.log(req.query);
  const height = Number(req.query.height as string);
  const weight = Number(req.query.weight as string);
  if (height && weight) {
    const bmiValue = calculateBmi(height, weight);
    const result = {
      weight,
      height,
      bmi: bmiValue
    };
    res.json(result);
  } else {
    res.status(400).json({
      error: "malformatted parameters"
    });
  }
});

app.post('/exerciseCalculator', (request, response) => {
  if (!request.body) {
    response.status(400).json({
      error: "parameters missing"
    });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = request.body;
  if (daily_exercises && target) {
    const result = calculateExercises(daily_exercises as number[], target as number);
    response.json(result);
  } else {
    response.status(400).json({
      error: "malformatted parameters"
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});