import { IsEmail, Length } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { GENDER, Roles } from "../typings/types";

@Entity("users")

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  @Length(6)
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(9)
  password: string;

  @Column()
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "enum", enum: Roles, default: "user" })
  role: string;

  @Column()
  profilePicture: string;

  @Column()
  coverPicture: string;

  @Column()
  liveIn: string;

  @Column({default: null})
  about: String;

  @Column({ type: "enum", enum: GENDER })
  gender: GENDER;

  @Column({ default: 0 })
  followingCount: number;

  @Column({ default: 0 })
  followerCount: number;

  @Column()
  dateOfBirth: String;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
