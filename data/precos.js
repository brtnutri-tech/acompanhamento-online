/* ============================================================
   TABELA DE PREÇOS — Diogo Brito Nutricionista
   ============================================================

   ESTE É O ARQUIVO QUE VOCÊ EDITA QUANDO PRECISAR MUDAR PREÇO,
   PARCELA, ITEM OU TEXTO DA TABELA. NÃO precisa mexer no resto.

   Como funciona:
   - Cada cartão tem um bloco aqui embaixo.
   - Mude só o que está DENTRO DAS ASPAS.
   - Pra adicionar item na lista, copie uma linha inteira (com vírgula no final)
     e cole logo abaixo. Pra tirar item, apague a linha inteira.
   - Depois de salvar, rode a página /tabela.html e baixe a imagem nova.

   ITENS EM NEGRITO: use o formato  { texto: 'Texto aqui', negrito: true }
   ITENS SIMPLES: use só a string   'Texto aqui'

   Dúvida? Pergunte ao Claude que ele te ajuda.
   ============================================================ */

window.PRECOS_TABELA = {

  // ============================================================
  // CARTÃO 1 — SESSÃO DE DIRECIONAMENTO
  // ============================================================
  consultoria: {
    tag: 'SESSÃO DE DIRECIONAMENTO',
    titulo: 'Consultoria Estratégica',
    subtitulo: 'Videochamada de 1 hora com o nutri',
    preco: 'R$500',
    recorrencia: '1x no cartão ou Pix',
    subPreco: '',
    itens: [
      'Análise completa do seu caso na sessão de 1 hora',
      'Plano alimentar inicial personalizado',
      'Diagnóstico Estratégico do seu Caso em PDF',
      '7 dias de suporte via WhatsApp',
      'Protocolo de suplementação, quando indicado',
      // O <strong> deixa "Cashback de R$200" em negrito dentro do item
      '<strong>Cashback de R$200</strong>, válido pra abater em qualquer um dos planos em até 10 dias após a consulta'
    ]
  },

  // ============================================================
  // CARTÃO 2 — PLANO CONSISTÊNCIA  (com selo "MAIS ESCOLHIDO")
  // ============================================================
  consistencia: {
    tag: 'PLANO CONSISTÊNCIA',
    titulo: '180 dias de acompanhamento',
    subtitulo: 'Pra quem quer emagrecer e aprender a sustentar o resultado depois.',
    preco: '6× R$199',
    recorrencia: 'Recorrência mensal, não compromete o limite do cartão',
    subPreco: 'ou R$1.150 à vista no Pix',
    selo: 'MAIS ESCOLHIDO',
    itens: [
      'Plano alimentar personalizado',
      'Suporte semanal',
      '6 Check-ins de evolução (peso, medidas e avanços)',
      '3 Videochamadas + 4 Botões SOS',
      '10 Avaliações físicas no período',
      '+ 2 Av. Físicas pra você presentear alguém',
      'Prescrição de treino com a personal da equipe'
    ]
  },

  // ============================================================
  // CARTÃO 3 — PLANO ESSENCIAL
  // ============================================================
  essencial: {
    tag: 'PLANO ESSENCIAL',
    titulo: '90 dias de acompanhamento',
    subtitulo: 'Pra começar com estrutura real, com suporte semanal desde o primeiro dia.',
    preco: '3× R$269',
    recorrencia: 'Recorrência mensal, não compromete o limite do cartão',
    subPreco: 'ou R$780 à vista no Pix',
    itens: [
      'Plano alimentar personalizado',
      'Suporte semanal',
      '3 Check-ins de evolução (peso, medidas e avanços)',
      '2 Videochamadas + 1 Botão SOS',
      '3 Avaliações físicas no período'
    ],
    // Itens RISCADOS: mostram o que NÃO está incluído nesse plano.
    itensRiscados: [
      '+ 2 pra você presentear quem quiser',
      'Prescrição de treino com a personal da equipe'
    ]
  },

  // ============================================================
  // RODAPÉ DA PEÇA
  // Linha 1: texto principal. Linha 2: nota menor embaixo.
  // ============================================================
  rodape: {
    linha1: 'Acompanhamento online sustentável para quem já cansou de recomeçar sozinho.',
    linha2: 'Tabela vigente até julho/2026'
  }

};
