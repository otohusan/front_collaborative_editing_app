import axios from "axios";

async function getArticlesData() {
  try {
    const response = await axios.get(`http://localhost:3000/articles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null; // またはエラーハンドリングに適した他のアクション
  }
}

export default getArticlesData;
