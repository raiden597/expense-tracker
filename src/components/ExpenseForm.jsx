import { useState } from "react";

const ExpenseForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAdd({
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    });

    setTitle("");
    setAmount("");
    setCategory("General");
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
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full sm:w-32 border border-slate-300 p-2 rounded bg-white text-slate-800 shadow-sm"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full sm:w-auto border border-slate-300 p-2 rounded bg-white text-slate-800 shadow-sm"
      >
        <option>General</option>
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
        <option>Shopping</option>
        <option>Nashe</option>
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
