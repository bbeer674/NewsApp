import axios from "axios";

const API_KEY = "ba2025537d18bcb7b92d22d46b487572";
const BASE_URL = "https://gnews.io/api/v4";

class NewsService {
  static async getNewsSearch(
    search: string,
    lang: string,
    fromDate: string,
    toDate: string
  ) {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: search,
          lang: lang,
          sortby: "publishedAt",
          token: API_KEY,
          from: fromDate,
          to: toDate,
        },
      });

      return response.data.articles;
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }
  static async getNewsTop(
    category: string,
    lang: string,
    fromDate: string,
    toDate: string
  ) {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          category,
          lang: lang,
          sortby: "publishedAt",
          token: API_KEY,
          from: fromDate,
          to: toDate,
        },
      });

      return response.data.articles;
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }
}

export default NewsService;
