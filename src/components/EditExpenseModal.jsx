import { useState, useEffect } from "react";

const EditExpenseModal = ({ expense, onClose, onSave }) => {
  const [formData, setFormData] = useState(expense);

  useEffect(() => {
    if (expense) setFormData(expense);
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!expense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Title"
            required
          />
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Amount"
            required
          />
          <input
            name="date"
            type="date"
            value={formData.date.slice(0, 10)}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded px-3 py-2"
>
  <option value="Food">Food</option>
  <option value="Travel">Travel</option>
  <option value="Bills">Bills</option>
  <option value="Shopping">Shopping</option>
  <option value="Substances">Substances</option>
  <option value="General">General</option>
</select>


          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
