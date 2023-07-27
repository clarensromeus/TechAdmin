import { faker } from "@faker-js/faker";

type ILevelStatus =
  | "Administrator"
  | "Supervisor"
  | "Supervisor Assistant"
  | "Secretary"
  | "General Inspector"
  | "Director";

const LevelStatus: ILevelStatus[] = [
  "Administrator",
  "Supervisor",
  "Supervisor Assistant",
  "Secretary",
  "General Inspector",
  "Director",
];

class Admin<T> {
  Firstname: T;
  Lastname: T;
  Email: T;
  Password: T;
  ConfirmPassword: T;
  Image: T;
  LevelStatus: T;
  PromoCode: T;
}

export const UseRandomAdmin = async (): Promise<Promise<Admin<string>>> => {
  try {
    const Password = faker.internet.password(
      16,
      true,
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    );
    const ConfirmPassword = faker.internet.password(
      16,
      true,
      undefined,
      Password
    );

    const fullName = faker.name.fullName;
    const random: number = Math.floor(Math.random() * 1000);
    const PromoCode: string = `${fullName}${random}`;

    const result = await {
      Firstname: faker.name.firstName(),
      Lastname: faker.name.lastName(),
      Email: faker.internet.email(),
      Password,
      ConfirmPassword,
      LevelStatus: faker.helpers.arrayElement(LevelStatus),
      PromoCode,
      Image: faker.internet.avatar(),
    };

    return await result;
  } catch (error) {
    throw new Error(`${error}`);
  }
};
