interface AppShellProps {
  children?: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="h-12 w-full bg-white shadow-md flex items-center px-4">
        <h1 className="text-heading">Purrfect Day</h1>
      </header>
      <main className="flex-1 p-4 overflow-auto">{children}</main>
      <footer className="h-10 w-full bg-white shadow-inner flex items-center justify-center"></footer>
    </div>
  )
}
