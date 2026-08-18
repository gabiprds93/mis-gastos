import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { Expense, Period } from '../types'

export type Range = { start: Date; end: Date }

export const rangeFor = (period: Period, reference: Date): Range => {
  if (period === 'day') {
    return { start: startOfDay(reference), end: endOfDay(reference) }
  }
  if (period === 'week') {
    return {
      start: startOfWeek(reference, { weekStartsOn: 1 }),
      end: endOfWeek(reference, { weekStartsOn: 1 }),
    }
  }
  return { start: startOfMonth(reference), end: endOfMonth(reference) }
}

export const shiftReference = (period: Period, reference: Date, direction: number): Date => {
  if (period === 'day') return addDays(reference, direction)
  if (period === 'week') return addWeeks(reference, direction)
  return addMonths(reference, direction)
}

export const rangeLabel = (period: Period, reference: Date): string => {
  const { start, end } = rangeFor(period, reference)
  if (period === 'day') return format(start, "EEEE d 'de' MMMM yyyy", { locale: es })
  if (period === 'week') {
    return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`
  }
  return format(start, 'MMMM yyyy', { locale: es })
}

export const filterByRange = (expenses: Expense[], range: Range): Expense[] =>
  expenses.filter((expense) =>
    isWithinInterval(parseISO(expense.date), { start: range.start, end: range.end }),
  )

export const sumAmounts = (expenses: Expense[]): number =>
  expenses.reduce((total, expense) => total + expense.amount, 0)

export const totalsByCategory = (expenses: Expense[]) => {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export const totalsByDate = (expenses: Expense[]) => {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.date, (totals.get(expense.date) ?? 0) + expense.amount)
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({
      date,
      label: format(parseISO(date), 'd MMM', { locale: es }),
      total,
    }))
}

export const todayISO = () => format(new Date(), 'yyyy-MM-dd')
