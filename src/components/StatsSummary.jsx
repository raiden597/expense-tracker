import { format } from "date-fns";
import { useCurrency } from "../CurrencyContext";

const StatsSummary = ({ expenses }) => {
  const { symbol } = useCurrency();

  if (!expenses.length) return null;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const dayTotals = expenses.reduce((acc, e) => {
    const date = e.date.slice(0, 10);
    acc[date] = (acc[date] || 0) + e.amount;
    return acc;
  }, {});

  const mostExpensiveDay = Object.entries(dayTotals).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["", 0]
  );

  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || "General";
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["", 0]
  );

  const uniqueDates = Object.keys(dayTotals);
  const avgDaily = total / uniqueDates.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-6">
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
