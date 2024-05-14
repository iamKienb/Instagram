
declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}
export interface AuthRequest  {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  coverPicture: string;
  liveIn: string;
  about: string;
  dateOfBirth: string;
  gender: GENDER;
}

export interface UserType  {
  username: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  coverPicture: string;
  liveIn: string;
  about: string;
  dateOfBirth: string;
  gender: GENDER;
}

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
export enum Roles {
  ADMIN = "admin",
  USER = "user",
}
