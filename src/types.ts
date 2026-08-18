export type Expense = {
  id: string
  amount: number
  category: string
  note: string
  date: string // yyyy-MM-dd
  createdAt: string
}

export type Period = 'day' | 'week' | 'month'

export const CATEGORIES = [
  'Comida',
  'Transporte',
  'Hogar',
  'Salud',
  'Ocio',
  'Educación',
  'Otros',
] as const
