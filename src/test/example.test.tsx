import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Exemplo de teste unitário — substitua com seus componentes reais
describe('Fundação de testes', () => {
  it('vitest está configurado e funcionando', () => {
    expect(true).toBe(true)
  })

  it('renderiza um elemento React básico', () => {
    render(<p>PulePule</p>)
    expect(screen.getByText('PulePule')).toBeInTheDocument()
  })
})
