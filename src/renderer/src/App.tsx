import { AppShell } from './AppShell'
import { queryClient } from './libs/QueryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router'
import { TodayPg } from './features/dashboards/pages/TodayPg'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
        <Routes>
          <Route index element={<TodayPg />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
