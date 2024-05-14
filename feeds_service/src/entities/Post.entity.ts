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
import Share from "./Share.entity";
import Like from "./Like.entity";



@Entity("posts")

export default class Post {
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

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[]

  @OneToMany(() => Comment, (comment) => comment.post )
  comments: Comment[]

  @OneToMany(() => Share, (share) => share.post )
  shares: Share[]

  @Column({ nullable: true })
  userId: number


  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

}
