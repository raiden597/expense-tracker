import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6", "#6B7280", "#EC4899"];

const RADIAN = Math.PI / 180;

// Custom label to show percentage inside pie slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryPieChart = ({ expenses }) => {
  const data = Object.entries(
    expenses.reduce((acc, e) => {
      const cat = e.category || "General";
      acc[cat] = (acc[cat] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

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
            formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
            wrapperStyle={{ fontSize: "14px" }}
          />
          
          <Legend 
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="text-slate-600 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
