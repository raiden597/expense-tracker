import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { Toaster, toast } from "react-hot-toast";
import { CurrencyProvider } from "./CurrencyContext";
import NotFound from "./pages/NotFound";
import EditExpenseModal from "./components/EditExpenseModal";

const App = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
    toast.success("Expense added!");
  };

  const deleteExpense = (id) => {
    const deleted = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));

    toast(
      (t) => (
        <span className="flex items-center gap-2">
          Deleted &ldquo;{deleted.title}&rdquo;
          <button
            onClick={() => {
              setExpenses((prev) => [deleted, ...prev]);
              toast.dismiss(t.id);
            }}
            className="underline text-blue-600 font-medium"
          >
            Undo
          </button>
        </span>
      ),
      { icon: "🗑️", duration: 5000 }
    );
  };

  const saveEditedExpense = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    toast.success("Expense updated!");
    setEditingExpense(null);
  };

  return (
    <CurrencyProvider>
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
                    onEdit={setEditingExpense}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>

        {editingExpense && (
          <EditExpenseModal
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onSave={saveEditedExpense}
          />
        )}
      </Router>
    </CurrencyProvider>
  );
};

export default App;
