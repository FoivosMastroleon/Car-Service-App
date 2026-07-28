import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  uploadExpenseReceipt,
} from "@/api/expenses";
import { createExpenseSchema, EXPENSE_CATEGORIES, type CreateExpenseFields } from "@/schemas/expense";
import type { Expense } from "@/types";
import Card from "@/components/Card";
import Modal from "@/components/Modal";

const ExpensesTab = ({ vehicleId }: { vehicleId: string }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const receiptTargetId = useRef<string | null>(null);

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

  const openAddModal = () => {
    reset({ category: "fuel", amount: 0, date: "", description: "" });
    setEditingExpense("new");
  };

  const openEditModal = (expense: Expense) => {
    reset({
      category: expense.category,
      amount: expense.amount,
      date: expense.date.slice(0, 10),
      description: expense.description,
    });
    setEditingExpense(expense);
  };

  const onSubmit = async (data: CreateExpenseFields) => {
    setError(null);
    try {
      if (editingExpense && editingExpense !== "new") {
        await updateExpense(vehicleId, editingExpense.id, data);
      } else {
        await createExpense(vehicleId, data);
      }
      setEditingExpense(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save expense");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(vehicleId, id);
    await load();
  };

  const triggerReceiptUpload = (id: string) => {
    receiptTargetId.current = id;
    receiptInputRef.current?.click();
  };

  const handleReceiptSelected = async (file: File) => {
    const id = receiptTargetId.current;
    if (!id) return;
    setUploadingId(id);
    try {
      await uploadExpenseReceipt(vehicleId, id, file);
      await load();
    } finally {
      setUploadingId(null);
    }
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
          onClick={openAddModal}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + Add Expense
        </button>
      </div>

      <input
        ref={receiptInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptSelected(file);
          e.target.value = "";
        }}
      />

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
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => openEditModal(expense)}
                    className="text-slate-400 hover:text-brand-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-900 mt-1">{expense.amount.toFixed(2)}</p>
              <p className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
              {expense.description && (
                <p className="text-sm text-slate-600 mt-2">{expense.description}</p>
              )}

              <div className="flex items-center gap-3 mt-2">
                {expense.receiptUrl && (
                  <a
                    href={expense.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand-600 hover:underline"
                  >
                    View receipt
                  </a>
                )}
                <button
                  onClick={() => triggerReceiptUpload(expense.id)}
                  disabled={uploadingId === expense.id}
                  className="text-sm text-slate-500 hover:text-brand-600 disabled:opacity-50"
                >
                  {uploadingId === expense.id
                    ? "Uploading..."
                    : expense.receiptUrl
                      ? "Replace receipt"
                      : "Add receipt"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editingExpense && (
        <Modal
          title={editingExpense === "new" ? "Add Expense" : "Edit Expense"}
          onClose={() => setEditingExpense(null)}
        >
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
              {isSubmitting ? "Saving..." : editingExpense === "new" ? "Add Expense" : "Save Changes"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ExpensesTab;
