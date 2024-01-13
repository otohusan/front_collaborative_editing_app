import { Article } from "./article.type";

export type User = {
  id: number;
  user_name: string;
  hobby: string;
  articles: Article[];
};
