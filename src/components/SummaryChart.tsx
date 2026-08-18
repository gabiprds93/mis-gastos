import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Props = {
  data: { label: string; total: number }[]
  currency: string
}

export function SummaryChart({ data, currency }: Props) {
  if (data.length === 0) return null

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-medium tracking-wide text-neutral-500 uppercase">Evolución</h2>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
            <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" width={48} />
            <Tooltip
              formatter={(value) => `${currency} ${Number(value).toFixed(2)}`}
              labelStyle={{ fontSize: 12 }}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="total" fill="#171717" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
