import { CoursePart } from '../types/Courses'

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </div>
  )
};

export default Total;