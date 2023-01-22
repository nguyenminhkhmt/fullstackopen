type Rating = 1 | 2 | 3;

type Result = {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: Rating,
  ratingDescription: string,
  target: number,
  average: number
};

interface ExercisesValues {
  exerciseHours: number[],
  target: number
}

const parseExercisesArguments = (args: Array<string>): ExercisesValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const [, command, target, ...other] = args;
  const exerciseHours = other.map(str => Number(str));
  console.log(command, target, exerciseHours);

  if (!isNaN(Number(target))) {
    return {
      target: Number(target),
      exerciseHours
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateExercises = (exerciseHours: number[], target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter(num => num > 0).length;

  const reducer = (sum: number, num: number) => sum + num;
  const average = exerciseHours.reduce(reducer, 0) / periodLength;
  const success = average >= target;
  const percentAllow = 0.2;

  let rating: Rating = 1;
  let ratingDescription = 'too bad';
  if (average < target - target * percentAllow) {
    rating = 1;
  } else if (average < target + target * percentAllow) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'well done!';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// const exerciseHours = [3, 0, 2, 4.5, 0, 3, 1];
// const target = 2;
// console.log(calculateExercises(exerciseHours, target));

try {
  const { exerciseHours, target } = parseExercisesArguments(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;