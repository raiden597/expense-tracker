import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useCurrency } from "../CurrencyContext"; // Use the symbol from context

const COLORS = [
  "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6",
  "#6B7280", "#EC4899", "#10B981", "#F97316",
  "#0EA5E9", "#A855F7"
];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.04) return null; // Hide small slices
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
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
  );
};

const CategoryPieChart = ({ expenses }) => {
  const { symbol } = useCurrency(); // Get selected currency symbol

  const categoryData = expenses.reduce((acc, e) => {
    const cat = e.category || "General";
    acc[cat] = acc[cat] || { value: 0, count: 0 };
    acc[cat].value += e.amount;
    acc[cat].count += 1;
    return acc;
  }, {});

  const entries = Object.entries(categoryData)
    .map(([name, { value, count }]) => ({ name, value, count }))
    .sort((a, b) => b.value - a.value);

  const top = entries.slice(0, 5);
  const others = entries.slice(5);
  const totalOthers = others.reduce((sum, item) => sum + item.value, 0);
  const totalOthersCount = others.reduce((sum, item) => sum + item.count, 0);

  const data =
    others.length > 0
      ? [...top, { name: "Others", value: totalOthers, count: totalOthersCount }]
      : top;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-slate-500">
        No expenses to display.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
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
              const count = data.find(d => d.name === name)?.count || 0;
              return [`${symbol}${value.toFixed(2)} (${percent}%) • ${count} txns`, name];
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
