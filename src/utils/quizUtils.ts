import type { Country } from '../services/countriesApi'

export type Question = {
  id: string
  country: Country
  prompt: string
  options: string[]
  answer: string
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

export function createQuestions(countries: Country[], amount = 6): Question[] {
  const selectedCountries = shuffle(countries).slice(0, amount)

  return selectedCountries.map((country, index) => {
    const wrongAnswers = shuffle(
      countries.filter((item) => item.name !== country.name).map((item) => item.name),
    ).slice(0, 3)

    return {
      id: `${country.name}-${index}`,
      country,
      prompt: `Que pais tiene como capital a ${country.capital}?`,
      options: shuffle([country.name, ...wrongAnswers]),
      answer: country.name,
    }
  })
}

export function getAnswerState(answer: string, correctAnswer: string) {
  return answer === correctAnswer ? 'correct' : 'wrong'
}
