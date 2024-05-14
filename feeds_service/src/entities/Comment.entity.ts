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
import Post from "./Post.entity";


@Entity("comments")

export default class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  userId: number;
  
  @Column()
  postId: number;
  @ManyToOne(()=>Post , (post) => post.comments,{
    onDelete: "CASCADE"
  })
  post: Post;
  
  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
