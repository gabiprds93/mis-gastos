import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense } from './types'

type NewExpense = Omit<Expense, 'id' | 'createdAt'>

type ExpenseState = {
  expenses: Expense[]
  currency: string
  addExpense: (expense: NewExpense) => void
  updateExpense: (id: string, expense: NewExpense) => void
  removeExpense: (id: string) => void
  setCurrency: (currency: string) => void
  replaceAll: (expenses: Expense[]) => void
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [],
      currency: 'S/',
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            { ...expense, id: createId(), createdAt: new Date().toISOString() },
            ...state.expenses,
          ],
        })),
      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((item) =>
            item.id === id ? { ...item, ...expense } : item,
          ),
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((item) => item.id !== id),
        })),
      setCurrency: (currency) => set({ currency }),
      replaceAll: (expenses) => set({ expenses }),
    }),
    { name: 'gastos-store' },
  ),
)
