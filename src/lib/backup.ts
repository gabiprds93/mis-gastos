import { isValid, parseISO } from 'date-fns'
import type { Expense } from '../types'

const download = (filename: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export const exportJson = (expenses: Expense[]) =>
  download('gastos.json', JSON.stringify(expenses, null, 2), 'application/json')

// Prefijar los valores que una hoja de cálculo interpretaría como fórmula.
const escapeCsv = (value: string) => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export const exportCsv = (expenses: Expense[]) => {
  const header = ['fecha', 'monto', 'categoria', 'nota'].join(',')
  const rows = expenses.map((expense) =>
    [
      expense.date,
      expense.amount.toFixed(2),
      escapeCsv(expense.category),
      escapeCsv(expense.note),
    ].join(','),
  )
  download('gastos.csv', [header, ...rows].join('\n'), 'text/csv')
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const isValidDate = (date: string) => DATE_PATTERN.test(date) && isValid(parseISO(date))

export const parseBackup = (raw: string): Expense[] => {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('El archivo no es un JSON válido')
  }
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista de gastos')
  return parsed.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Registro inválido en la posición ${index + 1}`)
    }
    const candidate = item as Partial<Expense>
    if (
      typeof candidate.amount !== 'number' ||
      !Number.isFinite(candidate.amount) ||
      candidate.amount <= 0 ||
      typeof candidate.category !== 'string' ||
      typeof candidate.date !== 'string' ||
      !isValidDate(candidate.date)
    ) {
      throw new Error(`Registro inválido en la posición ${index + 1}`)
    }
    return {
      id: typeof candidate.id === 'string' ? candidate.id : `${Date.now()}-${index}`,
      amount: candidate.amount,
      category: candidate.category,
      note: typeof candidate.note === 'string' ? candidate.note : '',
      date: candidate.date,
      createdAt:
        typeof candidate.createdAt === 'string' ? candidate.createdAt : new Date().toISOString(),
    }
  })
}
