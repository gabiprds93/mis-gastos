# Mis gastos

Registro de gastos diarios, semanales y mensuales. Funciona 100% en el navegador: sin backend ni base de datos, los datos se guardan en `localStorage`.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Zustand (`persist`) para el estado y la persistencia en `localStorage`
- date-fns para agrupar por día / semana / mes
- Recharts para las gráficas

## Requisitos

Node.js 22 o superior (definido en `.nvmrc`).

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción
npm run lint     # oxlint
npm run preview  # previsualizar el build
```

## Funcionalidad

- Agregar, editar y eliminar gastos (monto, fecha, categoría y nota).
- Vistas por día, semana y mes, con navegación entre períodos.
- Total del período, desglose por categoría y gráfica de evolución.
- Respaldo: exportar a JSON o CSV e importar desde JSON.
