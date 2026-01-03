import { AppShell } from './AppShell'
import { queryClient } from './libs/QueryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router'
import { TodayPg } from './features/dashboards/pages/TodayPg'
import { TasksPg } from './features/productivity/pages/TasksPg'
import { ProjectPg } from './features/productivity/pages/ProjectPg'
import { PomodoroPg } from './features/productivity/pages/PomodoroPg'
import { GoalsPg } from './features/productivity/pages/GoalsPg'
import { OverviewPg } from './features/dashboards/pages/OverviewPg'
import { JournalPg } from './features/recharge/journal/pages/JournalPg'


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<TodayPg />} />
            <Route path="/journal" element={<JournalPg />} />
            <Route path="/tasks" element={<TasksPg />} />
            <Route path="/projects" element={<ProjectPg />} />
            <Route path="/pomodoro" element={<PomodoroPg />} />
            <Route path="/goals" element={<GoalsPg />} />
            <Route path="/overview" element={<OverviewPg />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
