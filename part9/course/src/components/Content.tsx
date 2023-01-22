import { v4 as uuidv4 } from 'uuid';
import { CoursePart } from '../types/Courses';

const Details = ({ course }: { course: CoursePart }) => {
  switch (course.type) {
    case "normal":
      return null;
    case "groupProject":
      return <span>project exercises {course.groupProjectCount}</span>;
    case "submission":
      return <span>submit to <a href={course.exerciseSubmissionLink}>{course.exerciseSubmissionLink}</a></span>;
    case "special":
      return <span>required skills: {course.requirements.join(',')}</span>;
    default:
      return (null);
  }
};

const Part = ({ course }: { course: CoursePart }) => {
  return (
    <p>
      <b>{course.name} {course.exerciseCount}</b><br/>
      {course.description ? <span><i>course.description</i><br/></span> : null}
      <Details course={course} />
    </p>
  );
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map(course => <Part key={uuidv4()} course={course} />)}
    </div>
  )
};

export default Content;