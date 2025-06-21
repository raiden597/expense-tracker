import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6", "#6B7280", "#EC4899",
  "#10B981", "#F97316", "#0EA5E9", "#A855F7"
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    percent > 0.04 && (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  );
};

const CategoryPieChart = ({ expenses, symbol = "₹" }) => {
  const data = Object.entries(
    expenses.reduce((acc, e) => {
      const cat = e.category || "General";
      acc[cat] = (acc[cat] || 0) + e.amount;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const topCategory = data[0]?.name || null;

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-slate-500">
        No expenses to display.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <div className="text-center mb-2">
        <h3 className="text-slate-700 font-semibold">
          Total Spent: {symbol}{total.toFixed(2)}
        </h3>
        {topCategory && (
          <p className="text-sm text-emerald-700 mt-1">
            Highest spending: <strong>{topCategory}</strong>
          </p>
        )}
      </div>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => {
              const percent = ((value / total) * 100).toFixed(1);
              return [`${symbol}${value.toFixed(2)} (${percent}%)`, name];
            }}
            wrapperStyle={{ fontSize: "14px" }}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (
              <span className="text-slate-600 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
