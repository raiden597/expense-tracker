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
  Line,
  Legend,
} from "recharts";
import { useState } from "react";
import { useCurrency } from "../CurrencyContext"; // ⬅️ Import context

const MonthlyBarChart = ({ expenses, monthlyBudget = 10000 }) => {
  const { currency, symbol } = useCurrency(); // ⬅️ Use currency and symbol from context
  const [view, setView] = useState("total");

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const rawData = Array.from({ length: 12 }, (_, i) => {
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

  let cumulative = 0;
  const data = rawData.map((d, i) => {
    cumulative += d.total;
    const prev = rawData[i - 1]?.total || 0;
    const change = prev > 0 ? ((d.total - prev) / prev) * 100 : 0;
    return { ...d, cumulative, change };
  });

  const filtered = data.filter((d) => d.total > 0);
  const average =
    view === "total"
      ? filtered.reduce((sum, d) => sum + d.total, 0) / filtered.length || 0
      : filtered.reduce((sum, d) => sum + d.count, 0) / filtered.length || 0;

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

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={filtered}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis
            stroke="#6B7280"
            tickFormatter={(value) =>
              view === "total" ? formatter.format(value) : value
            }
          />
          <Tooltip
            formatter={(value, name, props) => {
              const entry = props.payload;
              const formatted =
                view === "total" ? formatter.format(value) : `${value} txns`;
              const extra =
                view === "total"
                  ? `MoM: ${entry.change?.toFixed(1)}%`
                  : "";
              return [formatted, view === "total" ? `Total (${extra})` : "Transactions"];
            }}
            wrapperStyle={{ fontSize: "14px" }}
          />
          <Legend />
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
          {view === "total" && (
            <>
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#6366F1"
                dot={{ r: 3 }}
                strokeWidth={2}
              />
              <ReferenceLine
                y={monthlyBudget}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{
                  value: `Budget (${formatter.format(monthlyBudget)})`,
                  position: "insideTopRight",
                  fill: "#EF4444",
                  fontSize: 12,
                }}
              />
            </>
          )}
          <ReferenceLine
            y={average}
            stroke="#F59E0B"
            strokeDasharray="4 4"
            label={{
              value: "Avg",
              position: "insideTopRight",
              fill: "#F59E0B",
              fontSize: 12,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
