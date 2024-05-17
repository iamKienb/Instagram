import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Chat from "./Chat.entity";
@Entity("messages")
export default class Message {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat;
  
    @Column()
    chatId: number;
  
    @Column()
    senderId: number;
  
    @Column()
    text: string;
  
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
  }