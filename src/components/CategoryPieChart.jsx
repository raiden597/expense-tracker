import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6", "#6B7280", "#EC4899"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
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
