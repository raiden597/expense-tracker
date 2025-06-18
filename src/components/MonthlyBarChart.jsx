import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const MonthlyBarChart = ({ expenses }) => {
  const data = Array.from({ length: 12 }, (_, i) => {
    const monthExpenses = expenses.filter(
      (e) => new Date(e.date).getMonth() === i
    );
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      total,
    };
  });

  // Optional: Remove months with total = 0 to keep chart clean
  const filteredData = data.filter((d) => d.total > 0);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis
            stroke="#6B7280"
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => [`₹${value.toFixed(2)}`, "Total"]}
            wrapperStyle={{ fontSize: "14px" }}
          />
          <Bar dataKey="total" fill="#10B981" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="total"
              position="top"
              formatter={(value) => `₹${value.toFixed(0)}`}
              style={{ fill: "#374151", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
