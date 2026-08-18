import type { Expense } from '../types'

const download = (filename: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const exportJson = (expenses: Expense[]) =>
  download('gastos.json', JSON.stringify(expenses, null, 2), 'application/json')

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`

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

export const parseBackup = (raw: string): Expense[] => {
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista de gastos')
  return parsed.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Registro inválido en la posición ${index + 1}`)
    }
    const candidate = item as Partial<Expense>
    if (
      typeof candidate.amount !== 'number' ||
      typeof candidate.date !== 'string' ||
      typeof candidate.category !== 'string'
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
