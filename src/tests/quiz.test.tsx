import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeToggle from '../components/ui/ThemeToggle'
import QuizPage from '../pages/QuizPage'
import type { Country } from '../services/countriesApi'
import { createQuestions } from '../utils/quizUtils'
import { getHighScore, saveHighScore } from '../utils/storage'

vi.mock('../services/countriesApi', () => ({
  getCountries: vi.fn(() => new Promise(() => undefined)),
}))

const countries: Country[] = [
  { name: 'Colombia', capital: 'Bogota', flag: 'co.svg', region: 'Americas' },
  { name: 'Japan', capital: 'Tokyo', flag: 'jp.svg', region: 'Asia' },
  { name: 'France', capital: 'Paris', flag: 'fr.svg', region: 'Europe' },
  { name: 'Brazil', capital: 'Brasilia', flag: 'br.svg', region: 'Americas' },
]

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ''
})

describe('country quiz', () => {
  it('crea preguntas con cuatro opciones y respuesta correcta', () => {
    const questions = createQuestions(countries, 2)

    expect(questions).toHaveLength(2)
    expect(questions[0].options).toHaveLength(4)
    expect(questions[0].options).toContain(questions[0].answer)
  })

  it('guarda solamente el puntaje mas alto', () => {
    saveHighScore(3)
    saveHighScore(1)

    expect(getHighScore()).toBe(3)
  })

  it('cambia entre modo claro y oscuro', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: /cambiar tema/i }))

    expect(document.documentElement).toHaveClass('dark')
  })

  it('muestra estado de carga mientras prepara los paises', () => {
    render(
      <MemoryRouter>
        <QuizPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/cargando paises/i)).toBeInTheDocument()
  })
})
