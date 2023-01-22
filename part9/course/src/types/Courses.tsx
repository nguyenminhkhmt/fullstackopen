export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
  description?: string;
}

interface CourseNormalPart extends CoursePartBase {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartBase {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseRequirementPart extends CoursePartBase {
  type: "special";
  requirements: string[];
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart | CourseRequirementPart;