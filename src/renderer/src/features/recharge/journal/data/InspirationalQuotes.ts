type ZenQuote = { q: string; a: string; h?: string }

const url = 'https://zenquotes.io/api/random'
export async function fetchInspirationalQuotes(): Promise<ZenQuote[] | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = (await response.json()) as ZenQuote[]
    return data
  } catch (error) {
    console.error('Error fetching inspirational quotes:', error)
    return null
  }
}
