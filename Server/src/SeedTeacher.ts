import { faker } from "@faker-js/faker";

class Teacher<T> {
  Firstname: T;
  Lastname: T;
  Email: T;
  Image: T;
  PhoneNumber: T;
}

// creating radom teachers data
export const UseRandomTeacher = async (): Promise<Promise<Teacher<string>>> => {
  try {
    const Password = faker.internet.password(
      16,
      true,
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    );

    const result = await {
      Firstname: faker.name.firstName(),
      Lastname: faker.name.lastName(),
      Email: faker.internet.email(),
      Image: faker.internet.avatar(),
      PhoneNumber: faker.phone.number(),
    };

    return await result;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
