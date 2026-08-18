import { useMemo, useRef, useState } from 'react'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { SummaryChart } from './components/SummaryChart'
import { exportCsv, exportJson, parseBackup } from './lib/backup'
import {
  filterByRange,
  rangeFor,
  rangeLabel,
  shiftReference,
  sumAmounts,
  totalsByCategory,
  totalsByDate,
} from './lib/period'
import { useExpenseStore } from './store'
import type { Expense, Period } from './types'

const PERIODS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
]

export default function App() {
  const expenses = useExpenseStore((state) => state.expenses)
  const currency = useExpenseStore((state) => state.currency)
  const addExpense = useExpenseStore((state) => state.addExpense)
  const updateExpense = useExpenseStore((state) => state.updateExpense)
  const removeExpense = useExpenseStore((state) => state.removeExpense)
  const replaceAll = useExpenseStore((state) => state.replaceAll)

  const [period, setPeriod] = useState<Period>('day')
  const [reference, setReference] = useState(() => new Date())
  const [editing, setEditing] = useState<Expense | null>(null)
  const [importError, setImportError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  const visible = useMemo(() => {
    const range = rangeFor(period, reference)
    return filterByRange(expenses, range).sort((a, b) => b.date.localeCompare(a.date))
  }, [expenses, period, reference])

  const total = sumAmounts(visible)
  const byCategory = useMemo(() => totalsByCategory(visible), [visible])
  const chartData = useMemo(
    () =>
      period === 'day'
        ? byCategory.map((item) => ({ label: item.category, total: item.total }))
        : totalsByDate(visible),
    [byCategory, period, visible],
  )

  const handleImport = async (file: File) => {
    try {
      replaceAll(parseBackup(await file.text()))
      setImportError('')
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'No se pudo leer el archivo')
    }
  }

  return (
    <div className="min-h-full bg-neutral-50 text-neutral-900">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Mis gastos</h1>
            <p className="text-sm text-neutral-500">
              Registro local, sin cuentas ni base de datos.
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => exportJson(expenses)}
              className="rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-100"
            >
              Exportar JSON
            </button>
            <button
              type="button"
              onClick={() => exportCsv(expenses)}
              className="rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-100"
            >
              Exportar CSV
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="rounded-lg border border-neutral-300 px-3 py-2 hover:bg-neutral-100"
            >
              Importar JSON
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleImport(file)
                event.target.value = ''
              }}
            />
          </div>
        </header>

        {importError && <p className="mt-4 text-xs text-red-600">{importError}</p>}

        <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-lg bg-neutral-100 p-1">
              {PERIODS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={`rounded-md px-3 py-1.5 text-sm ${
                    period === value ? 'bg-white font-medium shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                aria-label="Período anterior"
                onClick={() => setReference((current) => shiftReference(period, current, -1))}
                className="rounded-lg border border-neutral-300 px-2 py-1 hover:bg-neutral-100"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setReference(new Date())}
                className="rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-100"
              >
                Hoy
              </button>
              <button
                type="button"
                aria-label="Período siguiente"
                onClick={() => setReference((current) => shiftReference(period, current, 1))}
                className="rounded-lg border border-neutral-300 px-2 py-1 hover:bg-neutral-100"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs text-neutral-500 capitalize">{rangeLabel(period, reference)}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {currency} {total.toFixed(2)}
              </p>
            </div>
            <p className="text-xs text-neutral-500">
              {visible.length} {visible.length === 1 ? 'gasto' : 'gastos'}
            </p>
          </div>

          {byCategory.length > 0 && (
            <ul className="mt-5 space-y-2">
              {byCategory.map(({ category, total: categoryTotal }) => (
                <li key={category}>
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>{category}</span>
                    <span className="tabular-nums">
                      {currency} {categoryTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-neutral-100">
                    <div
                      className="h-1.5 rounded-full bg-neutral-900"
                      style={{ width: `${total === 0 ? 0 : (categoryTotal / total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-6 grid gap-6">
          <ExpenseForm
            key={editing?.id ?? 'new'}
            editing={editing}
            onCancelEdit={() => setEditing(null)}
            onSubmit={(values) => {
              if (editing) {
                updateExpense(editing.id, values)
                setEditing(null)
              } else {
                addExpense(values)
              }
            }}
          />
          <SummaryChart data={chartData} currency={currency} />
          <ExpenseList
            expenses={visible}
            currency={currency}
            onEdit={setEditing}
            onRemove={removeExpense}
          />
        </div>
      </main>
    </div>
  )
}
