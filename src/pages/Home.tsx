import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NewsItem } from "../services/newsService.interface";
import Loading from "../components/Loading";
import NewsService from "../services/newsService";
import CustomDateRangePicker from "../components/CustomDateRangePicker";

const Home = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      const news = await NewsService.getNewsTop(
        category,
        selectedLanguage,
        fromDate,
        toDate
      );

      setNewsData(news);
      setLoading(false);
    };

    fetchNews();
  }, [category, selectedLanguage, fromDate, toDate]);

  const handleSearch = async () => {
    setLoading(true);
    const news = await NewsService.getNewsSearch(
      search,
      selectedLanguage,
      fromDate,
      toDate
    );
    setNewsData(news);
    setLoading(false);
  };

  const convertToISO8601 = (dateString: string) => {
    return new Date(dateString).toISOString();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const onChangeLanguage = async (language: string) => {
    setSelectedLanguage(language);
    try {
      await i18next.changeLanguage(language);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const handleDateChange = (from: string, to: string) => {
    const formattedFromDate = convertToISO8601(from);
    const formattedToDate = convertToISO8601(to);
    setFromDate(formattedFromDate);
    setToDate(formattedToDate);
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex-1">
        <div className="w-full px-8 lg:px-16 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-indigo-700">News</h1>
            <select
              className="border px-3 py-1 border-indigo-700 text-indigo-700 
               font-semibold rounded-md transition-all duration-300 
               hover:bg-indigo-700 hover:text-white"
              onChange={(e) => onChangeLanguage(e.target.value)}
              value={selectedLanguage}
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-3 border border-indigo-500 rounded-lg w-full 
                  shadow-sm focus:ring-2 focus:ring-indigo-400 
                  transition-all duration-300 outline-none text-indigo-700 
                  h-12"
              />
              <button
                onClick={handleSearch}
                className="px-4 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-lg 
                hover:from-indigo-500 hover:to-indigo-700 transition-all duration-300 
                min-w-[100px] h-12 flex items-center justify-center"
              >
                {t("search")}
              </button>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 border border-indigo-500 rounded-lg w-full 
               shadow-sm focus:ring-2 focus:ring-indigo-400 
               transition-all duration-300 outline-none  text-indigo-700"
            >
              <option value="">{t("categories")}</option>
              <option value="general">General</option>
              <option value="world">World</option>
              <option value="nation">Nation</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="science">Science</option>
              <option value="health">Health</option>
            </select>
            <CustomDateRangePicker onDateChange={handleDateChange} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loading />
            </div>
          ) : (
            <>
              {currentNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentNews.map((news: NewsItem, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-5 shadow-lg bg-white transition-transform transform hover:scale-105"
                    >
                      <img
                        src={news.image}
                        alt="news"
                        className="w-full h-auto object-cover rounded-md aspect-[4/2]"
                      />
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(news.publishedAt).toLocaleString()}
                      </p>
                      <h2 className="font-bold text-lg text-gray-800">
                        {news.title}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        {news.description}
                      </p>
                      <p className="text-indigo-500 text-xs font-semibold mt-2">
                        {news.source.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No news available.</p>
              )}

              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-1 sm:space-x-0.5 overflow-x-auto whitespace-nowrap px-2 py-1">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`border border-indigo-700 px-4 py-2 rounded-md font-medium transition-all duration-300
                    sm:text-sm sm:px-2 sm:py-1  // Reduce size on small screens
                    ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                        : "bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                    }`}
                  >
                    ←
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`border border-indigo-700 px-4 py-2 rounded-md font-medium transition-all duration-300
                      sm:text-sm sm:px-2 sm:py-1  // Reduce size on small screens
                      ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-bold shadow-md"
                          : "text-indigo-700 bg-white hover:bg-indigo-100 hover:text-indigo-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`border border-indigo-700 px-4 py-2 rounded-md font-medium transition-all duration-300
                    sm:text-sm sm:px-2 sm:py-1  // Reduce size on small screens
                    ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                        : "bg-white text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
                    }`}
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
