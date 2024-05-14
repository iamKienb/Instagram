import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,

  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";




@Entity("follow")

export class Follow  {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  userFollowingId: number;

  @Column()
  userFollowedId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

}
