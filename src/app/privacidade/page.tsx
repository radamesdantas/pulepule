import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Pule Pule',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-teen-purple hover:text-white text-sm transition-colors mb-8 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="text-3xl font-black text-white font-outfit mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: março de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Quem somos</h2>
            <p>
              O Pule Pule é uma plataforma educacional gamificada de desenvolvimento de liderança
              para jovens, operada pela equipe Pule Pule. Nosso compromisso é proteger a privacidade
              e os dados de todos os usuários, especialmente de menores de idade.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Dados que coletamos</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Nome e endereço de e-mail (fornecidos no cadastro)</li>
              <li>Perfil de acesso: adolescente, pai/mãe ou mentor</li>
              <li>Progresso na jornada: missões concluídas, XP acumulado e nível</li>
              <li>Evidências enviadas (textos e arquivos) no cumprimento de comportamentos</li>
              <li>Dados de uso da plataforma (navegação e interações)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Como usamos os dados</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Personalizar a experiência de aprendizado do jovem</li>
              <li>Permitir que pais e mentores acompanhem o progresso</li>
              <li>Enviar notificações relacionadas à jornada</li>
              <li>Melhorar continuamente a plataforma</li>
            </ul>
            <p className="mt-3">
              Não vendemos, alugamos nem compartilhamos dados pessoais com terceiros para fins
              comerciais.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Dados de menores</h2>
            <p>
              O cadastro de adolescentes requer a participação de um responsável (pai, mãe ou
              mentor) que vincula o perfil do jovem à plataforma. Os responsáveis têm acesso total
              ao progresso do adolescente e podem solicitar a exclusão dos dados a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Armazenamento e segurança</h2>
            <p>
              Os dados são armazenados de forma segura na infraestrutura Supabase, com criptografia
              em trânsito (HTTPS) e em repouso. Aplicamos controles de acesso rigorosos via
              políticas de segurança em nível de linha (RLS).
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">6. Seus direitos</h2>
            <p>Você pode, a qualquer momento:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mt-2">
              <li>Solicitar acesso aos seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão da sua conta e dados</li>
              <li>Revogar consentimentos previamente fornecidos</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um desses direitos, entre em{' '}
              <Link href="/contato" className="text-teen-purple hover:text-white transition-colors">
                contato conosco
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">7. Cookies</h2>
            <p>
              Utilizamos cookies estritamente necessários para autenticação e funcionamento da
              plataforma. Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">8. Alterações nesta política</h2>
            <p>
              Qualquer alteração relevante será comunicada por e-mail ou notificação na plataforma
              com antecedência mínima de 15 dias.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">9. Contato</h2>
            <p>
              Dúvidas sobre privacidade?{' '}
              <Link href="/contato" className="text-teen-purple hover:text-white transition-colors">
                Fale conosco pelo WhatsApp
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
