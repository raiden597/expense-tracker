import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import { subDays, format } from "date-fns";
import { useState } from "react";
import { useCurrency } from "../CurrencyContext";

const DailyHeatmap = ({ expenses }) => {
  const { symbol } = useCurrency();
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const sixMonthsAgo = subDays(today, 180);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [view, setView] = useState("month"); // 'month' or 'range'

  const categories = [
    "All",
    ...Array.from(new Set(expenses.map((e) => e.category || "General"))),
  ];

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter(
          (e) => (e.category || "General") === selectedCategory
        );

  const dateMap = filteredExpenses.reduce((acc, e) => {
    const dateStr = format(new Date(e.date), "yyyy-MM-dd");
    acc[dateStr] = (acc[dateStr] || 0) + e.amount;
    return acc;
  }, {});

  const startDate = view === "month" ? startOfMonth : sixMonthsAgo;
  const totalDays =
    Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const heatmapData = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = format(date, "yyyy-MM-dd");
    return {
      date: dateStr,
      count: dateMap[dateStr] || 0,
    };
  });

  return (
    <div className="w-full overflow-x-auto">
      <h3 className="text-lg font-medium text-slate-700 mb-2">
        Daily Expense Heatmap
      </h3>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="text-sm text-slate-600">Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-slate-300 rounded px-2 py-1 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={() => setView(view === "month" ? "range" : "month")}
          className="ml-auto bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1 text-sm rounded"
        >
          View: {view === "month" ? "Current Month" : "Last 6 Months"}
        </button>
      </div>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={heatmapData}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count < 100) return "color-scale-1";
          if (value.count < 1000) return "color-scale-2";
          if (value.count < 5000) return "color-scale-3";
          return "color-scale-4";
        }}
        tooltipDataAttrs={(value) =>
          value.count
            ? {
                "data-tooltip-id": "heatmap-tooltip",
                "data-tooltip-content": `${value.date} - ${symbol}${value.count.toFixed(2)}`,
              }
            : {}
        }
        showWeekdayLabels
      />
      <Tooltip id="heatmap-tooltip" />

      {/* Color Legend */}
      <div className="flex gap-2 items-center justify-center text-xs mt-4 text-slate-500">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-200 rounded" /> 0
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-200 rounded" /> 1–99
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-400 rounded" /> 100-999
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-600 rounded" /> 1k-4.9k
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-800 rounded" /> 5k+
        </div>
      </div>
    </div>
  );
};

export default DailyHeatmap;
