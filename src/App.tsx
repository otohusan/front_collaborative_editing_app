import { useEffect, useState } from "react";
import getUserData from "./api/getUserData";
import { User } from "../type/user.type";

function App() {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData("1"); // 例: ユーザーID 1 のデータを取得
      setUserData(data);
    };

    fetchData();
  }, []);

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
    </div>
  );
}

export default App;
