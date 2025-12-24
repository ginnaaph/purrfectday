export const AppShell = (): React.JSX.Element => {
  return (
    <div className="flex h-full w-full flex-col bg-gray-100">
      <header className="h-12 w-full bg-white shadow-md flex items-center px-4">
        <h1 className="text-lg font-semibold text-gray-800">Purrfect Day</h1>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        {/* Main content goes here */}
      </main>
      <footer className="h-10 w-full bg-white shadow-inner flex items-center justify-center">
        <span className="text-sm text-gray-600">© 2024 Purrfect Day</span>
      </footer>
    </div>
  )
}