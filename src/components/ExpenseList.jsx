import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors = {
  Food: "bg-red-100 text-red-700",
  Travel: "bg-blue-100 text-blue-700",
  Bills: "bg-yellow-100 text-yellow-700",
  Shopping: "bg-purple-100 text-purple-700",
  General: "bg-gray-100 text-gray-700",
  Nashe: "bg-pink-100 text-pink-700",
};

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

const ExpenseList = ({ expenses, onDelete, currency }) => {
  if (expenses.length === 0)
    return (
      <p className="text-center text-slate-500 mt-6">
        No expenses added yet.
      </p>
    );

  const grouped = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const cat = expense.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(expense);
      return acc;
    }, {});
  }, [expenses]);

  const sortedCategories = useMemo(() => {
    return Object.entries(grouped).sort((a, b) => {
      const totalA = a[1].reduce((sum, e) => sum + e.amount, 0);
      const totalB = b[1].reduce((sum, e) => sum + e.amount, 0);
      return totalB - totalA;
    });
  }, [grouped]);

  const [collapsed, setCollapsed] = useState({});

  const toggleCategory = (category) => {
    setCollapsed((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const symbol = currencySymbols[currency] || "₹";

  return (
    <div className="space-y-6">
      {sortedCategories.map(([category, items]) => {
        const total = items.reduce((sum, e) => sum + e.amount, 0);
        const isCollapsed = collapsed[category];
        const badgeColor =
          categoryColors[category] || "bg-slate-100 text-slate-700";

        return (
          <div
            key={category}
            className="border border-slate-200 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full flex justify-between items-center px-4 py-3 ${badgeColor}`}
              aria-expanded={!isCollapsed}
              aria-controls={`section-${category}`}
            >
              <div>
                <h3 className="text-lg font-semibold">{category}</h3>
                <p className="text-sm">
                  Total: {symbol}
                  {total.toFixed(2)}
                </p>
              </div>
              <span className="text-xl font-bold">
                {isCollapsed ? "▶" : "▼"}
              </span>
            </button>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.ul
                  id={`section-${category}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 pt-2 space-y-2"
                >
                  {items.map((expense) => (
                    <motion.li
                      key={expense.id}
                      className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-md shadow-sm"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {expense.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {symbol}
                          {expense.amount.toFixed(2)} •{" "}
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                        aria-label={`Delete ${expense.title}`}
                      >
                        ×
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
