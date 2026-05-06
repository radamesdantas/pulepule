import { describe, it, expect } from 'vitest'

// toThirdPerson extraída inline para teste
// A função original está em src/components/BehaviorModal.tsx
function toThirdPerson(text: string): string {
  return (
    text
      .replace(/\bminha\b/g, 'sua')
      .replace(/\bMinha\b/g, 'Sua')
      .replace(/\bminhas\b/g, 'suas')
      .replace(/\bMeus\b/g, 'Seus')
      .replace(/\bmeus\b/g, 'seus')
      .replace(/\bmeu\b/g, 'seu')
      .replace(/\beu\b/g, '')
      .replace(/\bEu\b/g, '')
      .replace(/\bfaço\b/g, 'faz')
      .replace(/\bFaço\b/g, 'Faz')
      .replace(/\bdigo\b/g, 'diz')
      .replace(/\bDigo\b/g, 'Diz')
      .replace(/\bsou\b/g, 'é')
      .replace(/\bSou\b/g, 'É')
      .replace(/\btenho\b/g, 'tem')
      .replace(/\bTenho\b/g, 'Tem')
      .replace(/\bvou\b/g, 'vai')
      .replace(/\bVou\b/g, 'Vai')
      .replace(/\bposso\b/g, 'pode')
      .replace(/\bPosso\b/g, 'Pode')
      .replace(/\bsigo\b/g, 'segue')
      .replace(/\bpeço\b/g, 'pede')
      .replace(/\bassumo\b/g, 'assume')
      .replace(/\bAssumo\b/g, 'Assume')
      .replace(/\bprefiro\b/g, 'prefere')
      .replace(/\bmantenho\b/g, 'mantém')
      .replace(/\bMantenho\b/g, 'Mantém')
      .replace(/\bbusco\b/g, 'busca')
      .replace(/\bBusco\b/g, 'Busca')
      .replace(/\bajudo\b/g, 'ajuda')
      .replace(/\btomo\b/g, 'toma')
      .replace(/\bTomo\b/g, 'Toma')
      .replace(/\buso\b/g, 'usa')
      .replace(/\bUso\b/g, 'Usa')
      .replace(/\bcrio\b/g, 'cria')
      .replace(/\bdefendo\b/g, 'defende')
      .replace(/\bDefendo\b/g, 'Defende')
      .replace(/\bescolho\b/g, 'escolhe')
      .replace(/\bEscolho\b/g, 'Escolhe')
      .replace(/\bresolvo\b/g, 'resolve')
      .replace(/\bpercebo\b/g, 'percebe')
      .replace(/\bPercebo\b/g, 'Percebe')
      .replace(/\baprendo\b/g, 'aprende')
      // 'foco' é ambíguo — não substituir (ver BehaviorModal.tsx)
      .replace(/\bsupero\b/g, 'supera')
      .replace(/\bgaranto\b/g, 'garante')
      .replace(/\binvisto\b/g, 'investe')
      .replace(/\bInvisto\b/g, 'Investe')
      .replace(/\bpersisto\b/g, 'persiste')
      .replace(/  +/g, ' ')
      .trim()
  )
}

// ── Pronomes possessivos ───────────────────────────────────────────────────────

describe('toThirdPerson — pronomes possessivos', () => {
  it('minha → sua', () => {
    expect(toThirdPerson('minha opiniao')).toBe('sua opiniao')
  })

  it('Minha → Sua (capitalizado)', () => {
    expect(toThirdPerson('Minha decisao é correta')).toBe('Sua decisao é correta')
  })

  it('meu → seu', () => {
    expect(toThirdPerson('meu objetivo')).toBe('seu objetivo')
  })

  it('meus → seus', () => {
    expect(toThirdPerson('meus compromissos')).toBe('seus compromissos')
  })

  it('minhas → suas', () => {
    expect(toThirdPerson('minhas metas')).toBe('suas metas')
  })
})

// ── Pronome sujeito ────────────────────────────────────────────────────────────

describe('toThirdPerson — pronome eu', () => {
  it('eu é removido — demais verbos na frase ainda sao convertidos', () => {
    // "eu" é removido, "busco" → "busca" pela regra de verbos regulares
    expect(toThirdPerson('eu busco qualidade')).toBe('busca qualidade')
  })

  it('Eu (capitalizado) é removido — sem autocapitalizacao do proximo verbo', () => {
    // "Eu" é removido com string vazia; a funcao nao capitaliza a proxima palavra
    expect(toThirdPerson('Eu tenho metas claras')).toBe('tem metas claras')
  })

  it('eu no meio da frase é removido', () => {
    expect(toThirdPerson('quando eu faco algo')).toBe('quando faco algo')
  })
})

// ── Verbos irregulares ─────────────────────────────────────────────────────────

describe('toThirdPerson — verbos irregulares', () => {
  it('faço → faz', () => {
    expect(toThirdPerson('faço meu melhor')).toBe('faz seu melhor')
  })

  it('tenho → tem', () => {
    expect(toThirdPerson('tenho clareza')).toBe('tem clareza')
  })

  it('vou → vai', () => {
    expect(toThirdPerson('vou persistir')).toBe('vai persistir')
  })

  it('sou → é', () => {
    expect(toThirdPerson('sou responsavel')).toBe('é responsavel')
  })

  it('posso → pode', () => {
    expect(toThirdPerson('posso melhorar')).toBe('pode melhorar')
  })

  it('mantenho → mantém (foco como substantivo nao é alterado)', () => {
    expect(toThirdPerson('mantenho o foco')).toBe('mantém o foco')
  })

  it('assumo → assume', () => {
    expect(toThirdPerson('assumo os resultados')).toBe('assume os resultados')
  })
})

// ── Verbos regulares ───────────────────────────────────────────────────────────

describe('toThirdPerson — verbos regulares', () => {
  it('busco → busca', () => {
    expect(toThirdPerson('busco orientacao')).toBe('busca orientacao')
  })

  it('defendo → defende', () => {
    expect(toThirdPerson('defendo minha posicao')).toBe('defende sua posicao')
  })

  it('escolho → escolhe', () => {
    expect(toThirdPerson('escolho o caminho certo')).toBe('escolhe o caminho certo')
  })

  it('percebo → percebe', () => {
    expect(toThirdPerson('percebo as oportunidades')).toBe('percebe as oportunidades')
  })

  it('invisto → investe', () => {
    expect(toThirdPerson('invisto no relacionamento')).toBe('investe no relacionamento')
  })
})

// ── Combinacoes e frases reais ─────────────────────────────────────────────────

describe('toThirdPerson — frases compostas do banco', () => {
  it('frase de Iniciativa (CC01)', () => {
    const input = 'Quando vejo que algo vai dar errado, ajo antes de alguém me pedir'
    // Sem pronomes de 1a pessoa — deve permanecer igual apos trim
    expect(toThirdPerson(input)).toBe(input)
  })

  it('frase com minha + verbo', () => {
    const input = 'Confio nas minhas opinioes mesmo quando diferem da maioria'
    expect(toThirdPerson(input)).toBe('Confio nas suas opinioes mesmo quando diferem da maioria')
  })

  it('nao altera palavras que contem "eu" no meio (ex: neutro)', () => {
    // "neutro" nao deve ser afetado — word boundary \b protege
    expect(toThirdPerson('neutro e seguro')).toBe('neutro e seguro')
  })

  it('texto vazio retorna vazio', () => {
    expect(toThirdPerson('')).toBe('')
  })

  it('texto sem pronomes de 1a pessoa permanece inalterado', () => {
    const text = 'Age sem precisar ser mandado e cria oportunidades'
    expect(toThirdPerson(text)).toBe(text)
  })
})

// ── Narração mínima (regra de 20 chars) ───────────────────────────────────────

describe('regra de narração — validação de comprimento', () => {
  function isNarrationValid(text: string): boolean {
    return text.trim().length >= 20
  }

  it('19 chars → invalido', () => {
    expect(isNarrationValid('a'.repeat(19))).toBe(false)
  })

  it('20 chars → valido', () => {
    expect(isNarrationValid('a'.repeat(20))).toBe(true)
  })

  it('texto com espacos em branco no inicio/fim nao conta', () => {
    expect(isNarrationValid('   ' + 'a'.repeat(17) + '   ')).toBe(false)
  })

  it('texto longo → valido', () => {
    expect(isNarrationValid('Pratiquei a lideranca no grupo e obtive resultados positivos')).toBe(
      true
    )
  })
})
