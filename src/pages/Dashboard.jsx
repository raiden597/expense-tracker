import { useState } from "react";
import ExpenseList from "../components/ExpenseList";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import { useCurrency } from "../CurrencyContext";
import DailyHeatmap from "../components/DailyHeatmap"; 

const currencySymbols = {
  INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥",
};

const Dashboard = ({ expenses, onDelete, onEdit }) => {
  const [month, setMonth] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const { currency, setCurrency } = useCurrency();

  const filteredExpenses = month
    ? expenses.filter((e) => new Date(e.date).getMonth() + 1 === parseInt(month))
    : expenses;

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    return new Date(b.date) - new Date(a.date);
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const downloadCSV = () => {
    const headers = ["Title", "Amount", "Category", "Date"];
    const rows = expenses.map((e) => [
      e.title,
      e.amount,
      e.category || "",
      new Date(e.date).toLocaleDateString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "expenses.csv";
    link.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1 text-center">Dashboard</h1>
      <h2 className="text-xl font-medium text-center mb-6 text-emerald-700">
        Total: {currencySymbols[currency]}{total.toFixed(2)}
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-4 justify-center">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full sm:w-auto border border-slate-300 p-2 rounded bg-white text-slate-700 shadow-sm"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto border border-slate-300 p-2 rounded bg-white text-slate-700 shadow-sm"
        >
          <option value="date">Newest</option>
          <option value="amount">Highest Amount</option>
        </select>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full sm:w-auto border border-slate-300 p-2 rounded bg-white text-slate-700 shadow-sm"
        >
          {Object.entries(currencySymbols).map(([code, symbol]) => (
            <option key={code} value={code}>
              {symbol} {code}
            </option>
          ))}
        </select>

        <button
          onClick={downloadCSV}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded shadow"
        >
          Export CSV
        </button>
      </div>

      <ExpenseList
        expenses={sortedExpenses}
        onDelete={onDelete}
        currency={currency}
        onEdit={onEdit}
      />

      {filteredExpenses.length > 0 && (
        <div className="mt-10 space-y-8">
          <h2 className="text-2xl font-semibold text-center text-emerald-800">
            Expense Insights
          </h2>

          <div className="bg-white p-4 rounded-xl shadow space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Spending by Category</h3>
              <CategoryPieChart expenses={filteredExpenses} symbol={currencySymbols[currency]} />
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Spending by Month</h3>
              <MonthlyBarChart expenses={expenses} symbol={currencySymbols[currency]} />
            </div>
            <div>
  <DailyHeatmap expenses={filteredExpenses} symbol={currencySymbols[currency]} />
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
