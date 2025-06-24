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
import { useCurrency } from "../CurrencyContext";
import { categoryColors, defaultColors } from "../assets/categoryColors";


const MonthlyBarChart = ({ expenses }) => {
  const { currency, symbol } = useCurrency();
  const [view, setView] = useState("stacked");
  const [highlight, setHighlight] = useState("All");

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const categories = Array.from(
    new Set(expenses.map((e) => e.category || "General"))
  );

  const groupedData = Array.from({ length: 12 }, (_, i) => {
    const monthExpenses = expenses.filter(
      (e) => new Date(e.date).getMonth() === i
    );
    const categorySums = {};
    let total = 0;

    categories.forEach((cat) => {
      const sum = monthExpenses
        .filter((e) => (e.category || "General") === cat)
        .reduce((s, e) => s + e.amount, 0);

      categorySums[cat] = sum;
      total += sum;
    });

    return {
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      total,
      ...categorySums,
    };
  });

  const nonZeroMonths = groupedData.filter((d) => d.total > 0);
  const avg =
    nonZeroMonths.reduce((sum, d) => sum + d.total, 0) / nonZeroMonths.length || 0;

  const catAvg =
    highlight !== "All"
      ? nonZeroMonths.reduce((sum, d) => sum + (d[highlight] || 0), 0) / nonZeroMonths.length
      : null;

  return (
    <div className="w-full h-auto">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2 text-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === "stacked" ? "simple" : "stacked")}
            className="px-3 py-1 rounded-full border bg-white text-emerald-700 border-emerald-300"
          >
            View: {view === "stacked" ? "Category" : "Simple"}
          </button>

          <select
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-sm"
          >
            <option value="All">Highlight: All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={groupedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis stroke="#6B7280" tickFormatter={(v) => formatter.format(v)} />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || !payload.length) return null;
              return (
                <div className="bg-white shadow-md border p-3 rounded text-sm space-y-1">
                  <div className="font-semibold text-slate-700">
                    Month: {label}
                  </div>
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}:</span>
                      <span className="ml-auto font-medium">
                        {symbol}
                        {entry.value.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />

          {/* Bars */}
          {view === "stacked"
            ? categories.map((cat, index) => {
                const color =
                  categoryColors[cat] || defaultColors[index % defaultColors.length];
                const isDim = highlight !== "All" && highlight !== cat;

                return (
                  <Bar
                    key={cat}
                    dataKey={cat}
                    stackId="a"
                    fill={color}
                    fillOpacity={isDim ? 0.3 : 1}
                  />
                );
              })
            : (
              <Bar
                dataKey="total"
                fill="#10B981"
                fillOpacity={highlight !== "All" ? 0.3 : 1}
              >
                <LabelList
                  dataKey="total"
                  position="top"
                  formatter={(v) => `${symbol}${v.toFixed(0)}`}
                  style={{ fontSize: 12, fill: "#374151" }}
                />
              </Bar>
            )}

          {/* Avg Lines */}
          {view === "simple" && (
            <ReferenceLine
              y={avg}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{
                value: `Avg (${formatter.format(avg)})`,
                position: "insideTopRight",
                fill: "#F59E0B",
                fontSize: 12,
              }}
            />
          )}
          {view === "stacked" && highlight !== "All" && catAvg > 0 && (
            <ReferenceLine
              y={catAvg}
              stroke={categoryColors[highlight] || "#3B82F6"}
              strokeDasharray="4 2"
              label={{
                value: `Avg (${highlight}): ${formatter.format(catAvg)}`,
                position: "insideTopRight",
                fill: categoryColors[highlight] || "#3B82F6",
                fontSize: 12,
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
