import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import Dashboard from "./pages/Dashboard"; 
import NavBar from "./components/NavBar"; 
import { Toaster, toast } from "react-hot-toast";

const App = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
    toast.success("Expense added!");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast("Deleted", { icon: "🗑️" });
  };

  return (
    <Router>
      <Toaster />
      <div className="min-h-screen bg-emerald-50 text-black px-4 py-6 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-4 sm:p-6">

          <NavBar />

          <Routes>
            <Route path="/" element={<ExpenseForm onAdd={addExpense} />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  expenses={expenses}
                  onDelete={deleteExpense}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
