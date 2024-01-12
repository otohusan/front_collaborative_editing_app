import axios from "axios";

async function getUserData(userId: string) {
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null; // またはエラーハンドリングに適した他のアクション
  }
}

export default getUserData;
