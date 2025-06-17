import { useState } from "react";

const categories = [
  "General",
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Nashe",
];

const ExpenseForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;

    onAdd({
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    });

    setTitle("");
    setAmount("");
    setCategory(categories[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col sm:flex-row flex-wrap items-center gap-3"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full sm:flex-1 border border-slate-300 p-2 rounded bg-white text-slate-800 shadow-sm"
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full sm:w-32 border border-slate-300 p-2 rounded bg-white text-slate-800 shadow-sm"
        step="0.01"
        min="0.01"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full sm:w-auto border border-slate-300 p-2 rounded bg-white text-slate-800 shadow-sm"
      >
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        Add
      </button>
    </form>
  );
};

export default ExpenseForm;
