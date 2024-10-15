import { Timestamp } from "firebase/firestore";

export interface Thought {
  id: string;
  content: string;
  username: string;
  twitter?: string;
  votes: {
    like: number;
    heart: number;
    mind_blown: number;
    poop: number;
  };
  bgColor: string;
  createdAt: Timestamp;
}
