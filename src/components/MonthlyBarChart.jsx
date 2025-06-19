import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  ReferenceLine,
} from "recharts";
import { useState } from "react";

const MonthlyBarChart = ({ expenses, currency = "INR" }) => {
  const [view, setView] = useState("total");

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const data = Array.from({ length: 12 }, (_, i) => {
    const monthExpenses = expenses.filter(
      (e) => new Date(e.date).getMonth() === i
    );
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = monthExpenses.length;
    return {
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      total,
      count,
    };
  });

  const filteredData = data.filter((d) => d.total > 0);
  const average =
    view === "total"
      ? filteredData.reduce((sum, d) => sum + d.total, 0) / filteredData.length || 0
      : filteredData.reduce((sum, d) => sum + d.count, 0) / filteredData.length || 0;

  return (
    <div className="w-full h-auto">
      <div className="flex justify-end mb-2 gap-2 text-sm">
        <button
          onClick={() => setView("total")}
          className={`px-3 py-1 rounded-full border ${
            view === "total"
              ? "bg-emerald-500 text-white"
              : "bg-white text-emerald-700 border-emerald-300"
          }`}
        >
          Amount
        </button>
        <button
          onClick={() => setView("count")}
          className={`px-3 py-1 rounded-full border ${
            view === "count"
              ? "bg-emerald-500 text-white"
              : "bg-white text-emerald-700 border-emerald-300"
          }`}
        >
          Count
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis
            stroke="#6B7280"
            tickFormatter={(value) =>
              view === "total" ? formatter.format(value) : value
            }
          />
          <Tooltip
            formatter={(value, name, props) => [
              view === "total" ? formatter.format(value) : `${value} txns`,
              view === "total" ? "Total" : "Transactions",
            ]}
            wrapperStyle={{ fontSize: "14px" }}
          />
          <Bar
            dataKey={view}
            fill="#10B981"
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
          >
            <LabelList
              dataKey={view}
              position="top"
              formatter={(value) =>
                view === "total" ? formatter.format(value) : value
              }
              style={{ fill: "#374151", fontSize: 12 }}
            />
          </Bar>
          <ReferenceLine
            y={average}
            stroke="#F59E0B"
            strokeDasharray="4 4"
            label={{ value: "Avg", position: "insideTopRight", fill: "#F59E0B" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;