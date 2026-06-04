export type Country = {
  name: string
  capital: string
  flag: string
  region: string
}

export type CountriesResult = {
  countries: Country[]
  source: 'remote' | 'fallback'
  message?: string
}

type RestCountry = {
  name: { common: string }
  capital?: string[]
  flags: { svg?: string; png?: string }
  region: string
}

const fallbackCountries: Country[] = [
  { name: 'Colombia', capital: 'Bogota', flag: 'https://flagcdn.com/co.svg', region: 'Americas' },
  { name: 'Japan', capital: 'Tokyo', flag: 'https://flagcdn.com/jp.svg', region: 'Asia' },
  { name: 'France', capital: 'Paris', flag: 'https://flagcdn.com/fr.svg', region: 'Europe' },
  { name: 'Brazil', capital: 'Brasilia', flag: 'https://flagcdn.com/br.svg', region: 'Americas' },
  { name: 'Canada', capital: 'Ottawa', flag: 'https://flagcdn.com/ca.svg', region: 'Americas' },
  { name: 'Morocco', capital: 'Rabat', flag: 'https://flagcdn.com/ma.svg', region: 'Africa' },
  { name: 'Australia', capital: 'Canberra', flag: 'https://flagcdn.com/au.svg', region: 'Oceania' },
  { name: 'Italy', capital: 'Rome', flag: 'https://flagcdn.com/it.svg', region: 'Europe' },
]

export async function getCountries(): Promise<CountriesResult> {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,capital,flags,region',
    )

    if (!response.ok) {
      throw new Error('No se pudieron cargar los paises.')
    }

    const data = (await response.json()) as RestCountry[]
    const countries = data
      .filter((country) => country.capital?.[0] && country.flags.svg)
      .map((country) => ({
        name: country.name.common,
        capital: country.capital?.[0] ?? '',
        flag: country.flags.svg ?? country.flags.png ?? '',
        region: country.region,
      }))

    if (countries.length >= 4) {
      return {
        countries,
        source: 'remote',
      }
    }

    return {
      countries: fallbackCountries,
      source: 'fallback',
      message: 'Usamos paises de respaldo porque la API no devolvio suficientes resultados.',
    }
  } catch {
    return {
      countries: fallbackCountries,
      source: 'fallback',
      message: 'No pudimos cargar la API en este momento. El quiz sigue disponible con datos locales.',
    }
  }
}
