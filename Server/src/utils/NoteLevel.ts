import __ from "lodash";

type returnType = number;

const useNoteLevel = <T extends returnType>(
  average: T,
  totalpoint: T
): returnType => {
  const startingPoint: number = 48;
  const result: number[] = [];
  for (let i = startingPoint; i < totalpoint; i++) {
    result.push(i);
  }
  // determine randomly which note the student gets before calculate the average
  const studentPoint: number | undefined = __.sample(result);

  const Point: number | undefined = studentPoint ?? 0;
  // at instant calculate the student average
  const NoteLevel: returnType = (average * Point) / totalpoint;
  return NoteLevel;
};

export default useNoteLevel;

// this method is used to fake a student average as we don't really work on an industry-level product
