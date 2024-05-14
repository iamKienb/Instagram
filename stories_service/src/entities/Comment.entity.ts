import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import Story from "./Story.entity";



@Entity("comments")

export default class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  userId: number;
  
  @Column()
  storyId: number;
  @ManyToOne(()=>Story , (story) => story.comments,{
    onDelete: "CASCADE"
  })
  story: Story;
  
  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
