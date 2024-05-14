import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,

  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import Comment from "./Comment.entity";

import Like from "./Like.entity";



@Entity("story")

export default class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  captions: string;
  
  @Column("text", { array: true })
  images: string[];

  @Column({ type: "int", default: 0 })
  likeCounts: number;

  @Column({ type: "int", default: 0 })
  commentCounts: number;

  @OneToMany(() => Like, (like) => like.story)
  likes: Like[]

  @OneToMany(() => Comment, (comment) => comment.story )
  comments: Comment[]



  @Column({ nullable: true })
  userId: number


  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

}
