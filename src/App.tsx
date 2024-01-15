import { SetStateAction, useEffect, useState } from "react";
import getUserData from "./api/getUserData";
import getArticlesData from "./api/getArticles";
import { User } from "../type/user.type";
import { Article } from "../type/article.type";
import axios from "axios";
import io from "socket.io-client";

function App() {
  const [userData, setUserData] = useState<User | null>(null);
  const [articlesData, setArticlesData] = useState<Article[] | null>(null);
  const [articleText, setArticleText] = useState<string | undefined>(undefined);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    const handleArticleUpdated = (articleData: {
      article_id: number;
      article_text: string;
    }) => {
      console.log(`Received 'articleUpdated' event`, articleData);
      setArticlesData((prevArticlesData) => {
        if (!prevArticlesData) {
          return prevArticlesData;
        }

        return prevArticlesData.map((article) =>
          article.id === articleData.article_id
            ? { ...article, text: articleData.article_text || "" } // null の場合は空の文字列を使用
            : article
        );
      });
    };

    socket.on("articleUpdated", handleArticleUpdated);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      socket.off("articleUpdated", handleArticleUpdated);
    };
  }, []); // 空の依存配列を指定して、マウント時のみ実行

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData("3"); // 例: ユーザーID 1 のデータを取得
      setUserData(data);
    };

    const fetchArticlesData = async () => {
      const data = await getArticlesData();
      setArticlesData(data);
    };

    fetchUserData();
    fetchArticlesData();
  }, []);

  const handleArticleClick = (clickedText: string) => {
    setArticleText(clickedText);
  };

  const articleChange = (event: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    setArticleText(event.target.value);
  };

  const updateArticleText = async (selectedArticleId: number | null) => {
    setArticlesData((prevArticlesData) => {
      if (!prevArticlesData) {
        return prevArticlesData;
      }

      return prevArticlesData.map((article) =>
        article.id === selectedArticleId
          ? { ...article, text: articleText || "" } // null の場合は空の文字列を使用
          : article
      );
    });

    if (!selectedArticle) {
      return;
    }
    await axios.put(`http://localhost:3000/articles/${selectedArticle.id}`, {
      text: articleText || "",
    });
  };

  return (
    <div>
      {userData ? (
        <div>
          <h1>{userData.user_name}</h1>
          <p>{userData.hobby}</p>
          {/* その他のユーザー情報を表示 */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {articlesData ? (
        articlesData.map((article) => (
          <div key={article.id}>
            <p
              onClick={() => {
                handleArticleClick(article.text);
                setSelectedArticle(article);
              }}
            >
              {article.text}
            </p>
          </div>
        ))
      ) : (
        <></>
      )}

      <div>
        <textarea
          value={articleText}
          onChange={articleChange}
          style={{ width: "200px", height: "50px" }}
          placeholder="記事編集スペース"
        />
        <button
          onClick={() => {
            if (!selectedArticle) {
              return;
            }
            updateArticleText(selectedArticle.id);
          }}
        >
          更新
        </button>
      </div>
    </div>
  );
}

export default App;
