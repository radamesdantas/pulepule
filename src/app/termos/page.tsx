import Link from 'next/link'

export const metadata = {
  title: 'Termos de Uso — Pule Pule',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-teen-purple hover:text-white text-sm transition-colors mb-8 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="text-3xl font-black text-white font-outfit mb-2">Termos de Uso</h1>
        <p className="text-gray-500 text-sm mb-10">Última atualização: março de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-3">1. Aceitação dos termos</h2>
            <p>
              Ao criar uma conta e utilizar o Pule Pule, você concorda com estes Termos de Uso. Se
              você é responsável por um adolescente, a aceitação dos termos também se aplica ao uso
              do menor sob sua responsabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">2. Sobre a plataforma</h2>
            <p>
              O Pule Pule é uma plataforma educacional gamificada que oferece uma jornada de 12
              meses para o desenvolvimento de liderança e autonomia em jovens, através de
              comportamentos práticos, missões e acompanhamento por mentores.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">3. Perfis de usuário</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-gray-300">Adolescente:</strong> acessa a jornada, realiza
                comportamentos, envia evidências e acumula XP.
              </li>
              <li>
                <strong className="text-gray-300">Pai / Mãe:</strong> acompanha o progresso do
                adolescente vinculado à sua conta.
              </li>
              <li>
                <strong className="text-gray-300">Mentor:</strong> avalia as entregas do adolescente
                e fornece feedback.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">4. Responsabilidades do usuário</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Manter suas credenciais de acesso em segurança</li>
              <li>Fornecer informações verdadeiras no cadastro</li>
              <li>Utilizar a plataforma de forma respeitosa e ética</li>
              <li>Não compartilhar conteúdo inadequado, ofensivo ou falso como evidência</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">5. Propriedade intelectual</h2>
            <p>
              Todo o conteúdo da plataforma — textos, comportamentos, missões, metodologia, design e
              marca — é de propriedade exclusiva do Pule Pule e protegido por direitos autorais. É
              vedada a reprodução, distribuição ou uso comercial sem autorização prévia e escrita.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">
              6. Conteúdo enviado pelo usuário
            </h2>
            <p>
              As evidências enviadas (textos e arquivos) permanecem de propriedade do usuário. Ao
              enviar, você concede ao Pule Pule licença limitada para exibir esse conteúdo aos
              responsáveis e mentores vinculados à sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">7. Suspensão e cancelamento</h2>
            <p>
              Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos. O
              usuário pode solicitar o cancelamento da conta a qualquer momento pelo nosso{' '}
              <Link href="/contato" className="text-teen-purple hover:text-white transition-colors">
                canal de contato
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">
              8. Limitação de responsabilidade
            </h2>
            <p>
              O Pule Pule é uma ferramenta de apoio ao desenvolvimento. Os resultados dependem do
              comprometimento do jovem, da família e do mentor. Não garantimos resultados
              específicos decorrentes do uso da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">9. Alterações nos termos</h2>
            <p>
              Podemos atualizar estes termos a qualquer momento. Alterações relevantes serão
              comunicadas com antecedência mínima de 15 dias. O uso continuado após a vigência das
              alterações implica aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-3">10. Contato</h2>
            <p>
              Dúvidas sobre os termos?{' '}
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
