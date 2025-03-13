import { useState } from "react";
import { format, isBefore, getYear, getMonth, isSameDay } from "date-fns";
import { useTranslation } from "react-i18next";

interface CustomDateRangePickerProps {
  onDateChange: (fromDate: string, toDate: string) => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  onDateChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(getMonth(new Date()));
  const [currentYear, setCurrentYear] = useState(getYear(new Date()));
  const { t } = useTranslation();

  const handleDateClick = (date: Date) => {
    let newStartDate = tempStartDate;
    let newEndDate = tempEndDate;

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      newStartDate = date;
      newEndDate = null;
    } else if (isBefore(tempStartDate, date)) {
      newEndDate = date;
    } else {
      newEndDate = tempStartDate;
      newStartDate = date;
    }

    setTempStartDate(newStartDate);
    setTempEndDate(newEndDate);
  };

  const handleConfirm = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange(
        format(tempStartDate, "yyyy-MM-dd"),
        format(tempEndDate, "yyyy-MM-dd")
      );
    }
    setShowCalendar(false);
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateChange("", ""); // Clear parent state
  };

  const handleTodayClick = () => {
    const today = new Date();
    setTempStartDate(today);
    setTempEndDate(today);
  };

  const years = Array.from(
    { length: getYear(new Date()) - 1989 },
    (_, i) => 1990 + i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="relative w-full">
      <div
        className="p-3 border border-indigo-500 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-400 
                   transition-all duration-300 outline-none text-indigo-700 cursor-pointer"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {tempStartDate && tempEndDate
          ? `${format(tempStartDate, "yyyy-MM-dd")} - ${format(
              tempEndDate,
              "yyyy-MM-dd"
            )}`
          : t("dateRange")}
      </div>

      {showCalendar && (
        <div
          className="absolute top-full mt-2 left-0 bg-white border border-indigo-500 
                        rounded-lg shadow-lg p-4 z-50 w-full"
        >
          <div className="flex justify-between items-center mb-3">
            <select
              className="border p-2 rounded-md bg-white text-indigo-700"
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              onClick={handleTodayClick}
              className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white rounded-lg 
             hover:from-indigo-500 hover:to-indigo-700 transition-all duration-300"
            >
              Today
            </button>

            <select
              className="border p-2 rounded-md bg-white text-indigo-700"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-indigo-700 font-semibold">
                {day}
              </div>
            ))}

            {[...Array(42)].map((_, index) => {
              const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
              const startDay = firstDayOfMonth.getDay();
              const day = new Date(
                currentYear,
                currentMonth,
                index - startDay + 1
              );
              const isSelected =
                tempStartDate &&
                tempEndDate &&
                day >= tempStartDate &&
                day <= tempEndDate;
              const isStart = tempStartDate && isSameDay(tempStartDate, day);
              const isEnd = tempEndDate && isSameDay(tempEndDate, day);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={index}
                  className={`p-2 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-300 to-blue-200 text-black"
                        : "hover:bg-gray-100"
                    }
                    ${
                      isStart
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-black font-bold"
                        : ""
                    }
                    ${
                      isEnd
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-400 text-black font-bold"
                        : ""
                    }
                    ${isToday ? "border border-blue-500" : ""}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleConfirm}
            className="mt-3 w-full bg-gradient-to-r from-indigo-700 to-indigo-500 text-white px-4 py-2 rounded-md 
                       hover:bg-indigo-600 transition-all duration-300"
          >
            Confirm
          </button>

          <button
            onClick={handleClear}
            className="mt-3 w-full border border-indigo-700 text-indigo-700 px-4 py-2 rounded-md 
             bg-transparent transition-all duration-300 
             hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-500 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
