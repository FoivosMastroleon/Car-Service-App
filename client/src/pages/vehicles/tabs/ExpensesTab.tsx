import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getExpenses, createExpense, deleteExpense } from "@/api/expenses";
import { createExpenseSchema, EXPENSE_CATEGORIES, type CreateExpenseFields } from "@/schemas/expense";
import type { Expense } from "@/types";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

const ExpensesTab = ({ vehicleId }: { vehicleId: string }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseFields>({
    resolver: zodResolver(createExpenseSchema),
  });

  const load = async () => {
    setLoading(true);
    setExpenses(await getExpenses(vehicleId));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [vehicleId]);

  const onSubmit = async (data: CreateExpenseFields) => {
    setError(null);
    try {
      await createExpense(vehicleId, data);
      reset();
      setShowAddModal(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(vehicleId, id);
    await load();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Expenses</h2>
          {expenses.length > 0 && (
            <p className="text-sm text-slate-500">Total: {total.toFixed(2)}</p>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Add Expense
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : expenses.length === 0 ? (
        <Card>
          <p className="text-slate-500 text-sm">No expenses logged yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expenses.map((expense) => (
            <Card key={expense.id}>
              <div className="flex items-start justify-between">
                <span className="capitalize font-medium text-slate-900">{expense.category}</span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-slate-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-lg font-semibold text-slate-900 mt-1">{expense.amount.toFixed(2)}</p>
              <p className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
              {expense.description && (
                <p className="text-sm text-slate-600 mt-2">{expense.description}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <Modal title="Add Expense" onClose={() => setShowAddModal(false)}>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Category</label>
              <select
                {...register("category")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm capitalize focus:outline-none focus:border-brand-500"
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
                />
                {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Description</label>
              <input
                {...register("description")}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ExpensesTab;
