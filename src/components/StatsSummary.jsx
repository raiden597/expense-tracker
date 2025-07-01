import { format } from "date-fns";
import { useCurrency } from "../CurrencyContext";

const StatsSummary = ({ expenses, allExpenses }) => {
  const { symbol } = useCurrency();

  if (!expenses.length) return null;

  // ─── Total Spend ─────────────────────────────────────────────
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ─── Avg Daily Spend ─────────────────────────────────────────
  const dayTotals = expenses.reduce((acc, e) => {
    const date = e.date.slice(0, 10);
    acc[date] = (acc[date] || 0) + e.amount;
    return acc;
  }, {});
  const uniqueDates = Object.keys(dayTotals);
  const avgDaily = total / uniqueDates.length;

  // ─── Top Category ────────────────────────────────────────────
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || "General";
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["", 0]
  );

  // ─── Most Expensive Day ──────────────────────────────────────
  const mostExpensiveDay = Object.entries(dayTotals).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["", 0]
  );

  // ─── Month-over-Month Change ─────────────────────────────────
  const monthlyTotals = allExpenses.reduce((acc, e) => {
    const date = new Date(e.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    acc[monthKey] = (acc[monthKey] || 0) + e.amount;
    return acc;
  }, {});

  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthTotal = monthlyTotals[currentMonthKey] || 0;
  const previousMonthTotal = monthlyTotals[previousMonthKey] || 0;

  const delta = currentMonthTotal - previousMonthTotal;
  const percentChange = previousMonthTotal > 0
    ? ((delta / previousMonthTotal) * 100).toFixed(1)
    : "N/A";

  const changeColor = delta >= 0 ? "text-lime-800 bg-lime-100" : "text-red-800 bg-red-100";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-6">
      <div className={`p-4 rounded-lg shadow-sm ${changeColor}`}>
        <p className="text-slate-500 text-sm">Month-over-Month Change</p>
        <h2 className={`text-xl font-bold ${delta >= 0 ? "text-lime-800" : "text-red-800"}`}>
          {symbol}{Math.abs(delta).toFixed(2)} {delta >= 0 ? "↑" : "↓"}{" "}
          {percentChange !== "N/A" && `(${Math.abs(percentChange)}%)`}
        </h2>
      </div>

      <div className="bg-emerald-100 p-4 rounded-lg shadow-sm">
        <p className="text-slate-500 text-sm">Total Spent</p>
        <h2 className="text-xl font-bold text-emerald-800">{symbol}{total.toFixed(2)}</h2>
      </div>

      <div className="bg-sky-100 p-4 rounded-lg shadow-sm">
        <p className="text-slate-500 text-sm">Avg Daily Spend</p>
        <h2 className="text-xl font-bold text-sky-800">{symbol}{avgDaily.toFixed(2)}</h2>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
        <p className="text-slate-500 text-sm">Top Category</p>
        <h2 className="text-xl font-bold text-yellow-800">
          {topCategory[0]} – {symbol}{topCategory[1].toFixed(2)}
        </h2>
      </div>

      <div className="bg-rose-100 p-4 rounded-lg shadow-sm">
        <p className="text-slate-500 text-sm">Most Expensive Day</p>
        <h2 className="text-xl font-bold text-rose-800">
          {format(new Date(mostExpensiveDay[0]), "dd MMM yyyy")} – {symbol}{mostExpensiveDay[1].toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default StatsSummary;
