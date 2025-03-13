import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      search: "Search",
      categories: "Categories",
      dateRange: "Select Date Range",
    },
  },
  zh: {
    translation: {
      search: "搜索",
      categories: "类别",
      dateRange: "選擇日期範圍",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
