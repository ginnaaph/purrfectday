type ZenQuote = { q: string; a: string; h?: string }

const url = 'https://zenquotes.io/api/random'

export type QuoteFetchResult = {
  data: ZenQuote[] | null
  error: string | null
}

export async function fetchInspirationalQuotes(): Promise<QuoteFetchResult> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { data: null, error: `HTTP error! status: ${response.status}` }
    }
    const data = (await response.json()) as ZenQuote[]
    if (!data?.length) {
      return { data: null, error: 'No quote available.' }
    }
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching inspirational quotes:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to load quote from API.'
    }
  }
}
