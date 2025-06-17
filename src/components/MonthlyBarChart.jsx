import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
