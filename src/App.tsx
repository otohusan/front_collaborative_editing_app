import { SetStateAction, useEffect, useState } from "react";
import getUserData from "./api/getUserData";
import getArticlesData from "./api/getArticles";
import { User } from "../type/user.type";
import { Article } from "../type/article.type";

function App() {
  const [userData, setUserData] = useState<User | null>(null);
  const [articlesData, setArticlesData] = useState<Article[] | null>(null);
  const [articleText, setArticleText] = useState<string | undefined>(undefined);
  const [seleArticleId, setSeleArticleId] = useState<number | null>(null);

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

  const updateArticleText = (selectedArticleId: number | null) => {
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
                setSeleArticleId(article.id);
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
            updateArticleText(seleArticleId);
          }}
        >
          更新
        </button>
      </div>
    </div>
  );
}

export default App;
