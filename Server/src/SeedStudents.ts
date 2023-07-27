import { faker } from "@faker-js/faker";
import useNoteLevel from "./utils/NoteLevel";

type IStatus = "student" | "admin";
type ISchoolLevel = "kindergaten" | "primary school" | "secondary";
type IClass =
  | "1st grade"
  | "2nd grade"
  | "3th grade"
  | "4th grade"
  | "5th grade"
  | "6th grade"
  | "7th grade";

const status: IStatus = "student";
const SchoolLevel: ISchoolLevel[] = [
  "kindergaten",
  "primary school",
  "secondary",
];

const Class: IClass[] = [
  "1st grade",
  "2nd grade",
  "3th grade",
  "4th grade",
  "5th grade",
  "6th grade",
  "7th grade",
];

class Student<T> {
  Firstname: T;
  Lastname: T;
  Email?: T;
  Password: T;
  ConfirmPassword: T;
  Class: T;
  ClassName: T;
  SchoolLevel: T;
  NoteLevel: number;
  Image: T;
}

// student average
const NoteLevel: number = useNoteLevel(10, 100);

// create random students
export const UseRandomStudent = async (): Promise<Student<string>> => {
  try {
    const Password = await faker.internet.password(
      16,
      true,
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    );
    const ConfirmPassword = await faker.internet.password(
      16,
      true,
      undefined,
      Password
    );

    const result = {
      Firstname: faker.name.firstName(),
      Lastname: faker.name.lastName(),
      Email: faker.internet.email(),
      Password,
      ConfirmPassword,
      Class: faker.helpers.arrayElement(Class),
      ClassName: faker.name.fullName(),
      NoteLevel,
      Image: faker.internet.avatar(),
      SchoolLevel: faker.helpers.arrayElement(SchoolLevel),
    };
    return await result;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
