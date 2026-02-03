// ⚠️ MOCKADO - Backend será integrado por outra pessoa
import { PANIC_WORD } from '../utils/constants';

// Endpoint opcional para IA. Configure REACT_APP_AI_ENDPOINT no .env
const AI_ENDPOINT = process.env.REACT_APP_AI_ENDPOINT;

const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Sistema inteligente de respostas contextuais
const contextualResponses = {
  // EMERGÊNCIA CRÍTICA - Pensamentos suicidas
  suicide: [
    '🚨 VOCÊ NÃO ESTÁ SOZINHA E SUA VIDA TEM VALOR\n\n⚠️ AJUDA IMEDIATA:\n\n📞 SOS VOZ AMIGA: 21 354 45 45 / 91 280 26 69\n📞 TELEFONE DA AMIZADE: 228 323 535\n📞 SOS ESTUDANTE: 239 484 020\n📞 LINHA SNS24: 808 24 24 24\n\n💚 O que você está sentindo é resultado do trauma e abuso.\n💚 A dor passa. O suicídio é permanente.\n💚 Há pessoas que querem te ajudar AGORA.\n\nLigue para um desses números AGORA, por favor.\n\nVocê está sozinha neste momento? Há alguém que possa ficar com você?',
  ],
  
  // Saudações
  greeting: [
    'Olá! Este é um espaço seguro e confidencial. Estou aqui para ouvir você sem julgamentos. Como você está se sentindo neste momento?',
    'Bem-vinda! Você está num espaço protegido. Pode falar livremente. O que trouxe você aqui hoje?',
  ],
  
  // Crise/Perigo imediato
  danger: [
    '🚨 PERIGO IMEDIATO - PROTOCOLO DE SEGURANÇA:\n\n⚠️ SE ELE ESTÁ AÍ AGORA:\n   1. MINIMIZE esta janela IMEDIATAMENTE\n   2. Volte para a CALCULADORA\n   3. Aja com naturalidade\n\n📞 QUANDO ESTIVER A SÓS (mesmo que 1 minuto):\n   • 112 - Emergência (polícia)\n   • 116 006 - Apoio à vítima (24h)\n\n🏃 SE CONSEGUIR SAIR:\n   • Casa de vizinho/amigo\n   • Loja/supermercado (peça ajuda)\n   • PSP/GNR/Esquadra\n   • Hospital\n\n💡 ALERTA SILENCIOSO:\nUse o botão GPS da tela inicial para enviar sua localização aos contatos de confiança.\n\n❗ Responda APENAS se for 100% seguro.\n\nELE ESTÁ NA MESMA CASA agora?',
    '⚠️ RISCO IMEDIATO DETECTADO\n\n🔴 AVALIAÇÃO RÁPIDA (responda mentalmente):\n   • Ele está no mesmo local que você?\n   • Você consegue sair nos próximos 5 minutos?\n   • Tem alguém que possa te ajudar por perto?\n\n✅ SE ESTIVER SOZINHA AGORA:\n   • Use o botão "Ligar 116 006" da tela inicial\n   • Ou ligue 112 (polícia/emergência)\n   • Ou vá para a casa de alguém\n\n✅ SE ELE ESTIVER POR PERTO:\n   • FECHE o app (toque no X)\n   • Volte quando estiver a sós\n   • Use o código secreto da calculadora\n\n🛡️ SUA SEGURANÇA VEM PRIMEIRO\n\nVocê consegue responder agora ou precisa sair?',
    '🚨 ENTENDO QUE ESTÁ EM PERIGO\n\n⏱️ DECISÃO RÁPIDA:\n\nOPÇÃO 1 - ELE ESTÁ PERTO:\n   → MINIMIZE AGORA\n   → Volte depois\n\nOPÇÃO 2 - VOCÊ ESTÁ SÓ:\n   → Ligue 112 (fale baixo se precisar)\n   → Ou saia de casa AGORA\n   → Vá para local com pessoas\n\nOPÇÃO 3 - NÃO PODE LIGAR/SAIR:\n   → Envie SMS para 112 (funciona!)\n   → Ou use botão GPS de alerta\n   → Ou grite por vizinhos\n\n💪 Você está fazendo o certo ao buscar ajuda.\n\nO que consegue fazer AGORA (sem risco)?',
  ],
  
  // Medo/Ansiedade
  fear: [
    'É completamente normal sentir medo. Isso mostra que seu instinto de proteção está funcionando. Vamos respirar juntas:\n\n1. Inspire contando até 4\n2. Segure por 4\n3. Expire contando até 6\n\nFaça isso 3 vezes. Depois me conte: o que mais te assusta agora?',
    'Seu medo é válido e compreensível. Você está demonstrando muita coragem ao buscar ajuda.\n\nVamos focar no presente: Onde você está agora? Você está segura neste momento?',
  ],
  
  // Culpa/Vergonha
  guilt: [
    'Ouça com atenção: NADA do que aconteceu é culpa sua. Violência é SEMPRE responsabilidade de quem agride, nunca da vítima.\n\nVocê não provocou, não mereceu, não pediu. A única pessoa responsável é o agressor.\n\nComo posso ajudar você a se sentir mais acolhida?',
    'A vergonha que você sente não te pertence. É comum vítimas de violência sentirem isso, mas preciso que você saiba: você NÃO tem culpa.\n\nNinguém merece ser maltratado. Nem você, nem ninguém. Você quer falar sobre o que aconteceu?',
  ],
  
  // Dúvida sobre deixar ou não
  doubt: [
    'É normal ter dúvidas. Deixar um relacionamento abusivo é um processo, não um evento único.\n\nPerguntas importantes:\n• Você se sente respeitada?\n• Você tem medo dele?\n• Você consegue expressar suas opiniões?\n• Você se sente livre?\n\nNão precisa responder agora. Pense nisso.',
    'A decisão é sua e será respeitada. Mas vamos refletir:\n\n"Amor verdadeiro":\n✅ Respeita\n✅ Apoia\n✅ Não controla\n✅ Não agride\n✅ Não humilha\n\nSe falta isso, não é amor saudável. Você reconhece algum desses sinais no seu relacionamento?',
  ],
  
  // Isolamento
  isolation: [
    'Você NÃO está sozinha. Mesmo que sinta isso agora.\n\nEm Portugal há:\n📞 116 006 - Linha Apoio Vítima (24h)\n📞 112 - Emergências\n🏠 Casas de abrigo\n👥 APAV - apoio gratuito\n\nVocê tem algum amigo ou familiar em quem confia?',
    'O isolamento é uma tática comum de controle. Ele afastou você de amigos/família?\n\nReconectar com pessoas que te amam pode ser difícil, mas é importante. Elas vão entender.\n\nVamos pensar juntas: quem você gostaria de ter por perto?',
  ],
  
  // Plano de saída
  exitPlan: [
    '💡 Vamos criar um plano de saída seguro:\n\n📦 PREPARE:\n• Documentos (CC, certidões)\n• Dinheiro\n• Medicamentos\n• Roupa\n• Chaves extras\n\n📍 ONDE IR:\n• Casa de familiar/amigo\n• Casa de abrigo (144)\n\nVocê tem um lugar seguro para ir?',
    'Um plano bem preparado salva vidas. Passos importantes:\n\n1️⃣ Guarde documentos em local seguro\n2️⃣ Tenha dinheiro separado\n3️⃣ Identifique rotas de fuga\n4️⃣ Tenha contatos de emergência\n5️⃣ NÃO avise quando vai sair\n\nQuer ajuda para organizar isso?',
  ],
  
  // Depois de agressão
  afterViolence: [
    'Lamento muito pelo que você passou. Isso não deveria ter acontecido.\n\n✅ IMPORTANTE AGORA:\n1. Você precisa de atendimento médico?\n2. Você está segura?\n3. Você quer fazer queixa?\n\nFazer queixa é seu direito. Você tem 6 meses mas quanto antes, melhor. Posso orientar sobre isso.',
    'Você foi muito corajosa em compartilhar isso.\n\n🏥 SE HOUVER LESÕES:\n• Vá ao hospital/centro saúde\n• Peça relatório médico\n• Tire fotos das lesões\n\n👮 QUEIXA:\n• Qualquer esquadra PSP/GNR\n• Pode ser oral\n• Leve testemunhas se tiver\n\nVocê quer que eu explique melhor algum passo?',
  ],
  
  // Filhos envolvidos
  children: [
    'Proteger seus filhos é natural. Saiba que:\n\n👶 CRIANÇAS EXPOSTAS À VIOLÊNCIA:\n• Sofrem trauma mesmo só vendo\n• Precisam de proteção\n• Você pode pedir ajuda da CPCJ\n\nSair da situação é proteger eles E você. Você não está sendo egoísta, está sendo forte.\n\nComo estão as crianças?',
    'Seus filhos precisam de uma mãe segura. E você precisa de ajuda.\n\n✅ DIREITOS:\n• Apoio psicológico para crianças\n• Proteção através da CPCJ\n• Casas de abrigo aceitam mães com filhos\n\nVocê NÃO vai perder seus filhos por denunciar. Pelo contrário, está protegendo eles.\n\nQuantos filhos você tem?',
  ],
  
  // Questões financeiras
  financial: [
    '💰 Dependência financeira é real mas há soluções:\n\n✅ PORTUGAL OFERECE:\n• Rendimento Social de Inserção\n• Apoio habitacional\n• Apoio através da Segurança Social\n• Formação profissional gratuita\n\nVocê não precisa escolher entre segurança e sobrevivência. Há apoios disponíveis.\n\nVocê trabalha atualmente?',
    'Dinheiro não pode ser mais importante que sua vida.\n\nMAS entendo a preocupação. Há:\n\n🤝 Casas de abrigo (gratuito)\n💶 Subsídios governamentais\n👔 Programas de emprego\n⚖️ Pensão de alimentos (se separar)\n\nVocê não ficará desamparada. O sistema existe para proteger você.\n\nQue tipo de apoio financeiro você mais precisa?',
  ],
  
  // Ciclo da violência
  cycle: [
    'O que você descreve é o "Ciclo da Violência":\n\n1️⃣ TENSÃO: Ele fica irritado\n2️⃣ EXPLOSÃO: Violência acontece\n3️⃣ LUA DE MEL: Ele pede desculpas, promete mudar\n4️⃣ CALMA: Tudo "normal"\n\nE o ciclo recomeça. Mas com o tempo, a violência piora e a lua de mel diminui.\n\nVocê reconhece esse padrão?',
    'Promessas de mudança após agressão fazem parte do ciclo de abuso.\n\n⚠️ SINAIS QUE NÃO VAI MUDAR:\n• Culpa você\n• Minimiza ("foi sem querer")\n• Não busca ajuda profissional\n• Repete após prometer\n\nMudança real requer terapia especializada. Ele está fazendo isso?\n\nQuantas vezes ele já prometeu mudar?',
  ],
  
  // Empoderamento
  strength: [
    '💪 Você é MAIS FORTE do que imagina:\n\n✅ Sobreviveu até aqui\n✅ Buscou ajuda (isso é coragem!)\n✅ Está pensando em soluções\n\nVocê TEM o direito de:\n• Ser respeitada\n• Viver sem medo\n• Ser feliz\n• Recomeçar\n\nQual o primeiro passo que você gostaria de dar?',
    'Olhe o quanto você já percorreu:\n\n🌟 Reconheceu que algo está errado\n🌟 Buscou informação\n🌟 Está aqui conversando\n\nIsso não é fraqueza. É força pura.\n\nVocê merece uma vida tranquila. E vai conseguir. Um passo de cada vez.\n\nComo posso apoiar você nesse processo?',
  ],
  
  // Tristeza/Depressão
  sadness: [
    'Percebo que você está passando por um momento muito difícil. A tristeza que sente é uma resposta natural ao que está vivendo.\n\nVocê não está sozinha nessa dor. E a tristeza não define quem você é.\n\n💭 Quando começou a sentir esse vazio?\n💭 O que te fazia feliz antes?\n\nVamos conversar sobre isso.',
    'Essa exaustão emocional é real. Carregar tanto peso sozinha é desgastante.\n\n✨ Validar seus sentimentos:\n• Você TEM o direito de estar cansada\n• Não é fraqueza, é sobrecarga\n• Pedir ajuda é força, não desistência\n\nVocê tem dormido? Comido? Cuidado de si minimamente?',
  ],

  // Raiva
  anger: [
    'Sua raiva é válida e saudável. É um sinal de que você reconhece a injustiça.\n\nA raiva pode ser:\n✅ Motivadora para mudança\n✅ Protetora (te afasta do perigo)\n✅ Energizante\n\nMAS precisa ser canalizada com segurança.\n\nO que você gostaria de fazer com essa raiva?',
    'É justo você se sentir revoltada. Você ESTÁ sendo tratada injustamente.\n\nA raiva te dá clareza? Ou te confunde?\n\nÀs vezes precisamos da raiva para ter coragem de agir. Outras vezes, ela nos protege de sentir medo.\n\nO que sua raiva está tentando te dizer?',
  ],

  // Ameaças
  threat: [
    '🚨 Ameaças são CRIME e devem ser levadas a sério.\n\n✅ O QUE FAZER:\n1. Anote data, hora e o que foi dito\n2. Guarde mensagens/áudios como prova\n3. Conte para alguém de confiança\n4. Considere fazer queixa (PSP/GNR)\n\nAmeaças muitas vezes precedem violência real.\n\nQue tipo de ameaça ele fez? Você se sente em risco?',
    'Ameaças são uma forma de controle pelo medo. E são ILEGAIS.\n\n⚠️ SINAIS DE PERIGO:\n• Ameaças de morte\n• "Se você me deixar..."\n• Ameaças aos filhos\n• Ameaças de suicídio\n\nVocê acredita que ele pode concretizar a ameaça?\n\nSua percepção de risco é importante.',
  ],

  // Controle
  control: [
    'O que você descreve é CONTROLE COERCIVO - uma forma grave de abuso psicológico.\n\n🚩 SINAIS:\n• Isola de amigos/família\n• Controla dinheiro\n• Vigia celular/redes sociais\n• Decide sua roupa\n• Controla onde vai\n\nIsso NÃO é amor. É prisão.\n\nQuanto da sua liberdade você perdeu?',
    'Controle excessivo destrói a autoestima aos poucos. Você começa a duvidar de si mesma.\n\nPergunta importante:\n\n💭 Você consegue tomar decisões simples sem medo da reação dele?\n💭 Você se sente vigiada?\n💭 Você mudou quem você é para agradá-lo?\n\nEssas respostas te mostram o quanto ele controla você.',
  ],

  // Amor/Dúvida sobre sentimentos
  love: [
    'É possível amar alguém E reconhecer que o relacionamento é tóxico.\n\nAmor verdadeiro:\n✅ Te faz crescer, não diminuir\n✅ Te respeita, não te humilha\n✅ Te liberta, não te prende\n✅ Te protege, não te machuca\n\nVocê pode amar a pessoa que ele era (ou fingia ser).\nMas precisa proteger-se da pessoa que ele É.\n\nO que você ama nele é real ou é uma esperança?',
    'Amor e abuso NÃO coexistem.\n\nSe há:\n❌ Medo\n❌ Violência\n❌ Controle\n❌ Humilhação\n\nEntão NÃO é amor saudável.\n\nVocê pode ter vínculos emocionais (trauma bond), mas isso é diferente de amor.\n\nQuando você pensa em ficar com ele, sente: paz ou medo?',
  ],

  // Mudança/Promessas
  change: [
    'Mudança REAL requer:\n\n1️⃣ Reconhecimento total da culpa\n2️⃣ Terapia especializada (não é automática)\n3️⃣ Tempo (meses/anos)\n4️⃣ NUNCA repetir\n\nPromessas vazias:\n❌ "Foi sem querer"\n❌ "Você que me deixou nervoso"\n❌ "Não vai mais acontecer" (mas acontece)\n\nEle está em terapia especializada em agressores?\n\nQuantas vezes ele já prometeu mudar?',
    'Estatisticamente, agressores SÓ mudam com intervenção profissional prolongada.\n\nE mesmo assim, a taxa de reincidência é alta.\n\nVocê NÃO é responsável por mudá-lo.\nVocê NÃO pode amá-lo até ele melhorar.\n\nSua responsabilidade é com SUA segurança.\n\nVocê está esperando ele mudar há quanto tempo?',
  ],

  // Ajuda legal
  legalHelp: [
    '⚖️ FAZER QUEIXA - Passo a passo:\n\n1️⃣ ONDE: Qualquer PSP ou GNR (24h)\n2️⃣ COMO: Oral ou escrita\n3️⃣ O QUE LEVAR:\n   • Documentos\n   • Provas (fotos, mensagens)\n   • Testemunhas (se tiver)\n\n4️⃣ DEPOIS:\n   • Ordem de proteção\n   • Advogado gratuito (Estado)\n   • Acompanhamento APAV\n\nQueixa é seu DIREITO. Você quer orientação sobre algum passo específico?',
    '👮 SEUS DIREITOS LEGAIS:\n\n✅ Fazer queixa sem advogado\n✅ Pedir ordem de proteção imediata\n✅ Advogado gratuito (oficioso)\n✅ Acompanhamento PSP/GNR\n✅ Ser informada do processo\n✅ Proteção contra retaliação\n\n⏰ PRAZO: Até 6 meses, mas quanto antes melhor.\n\n💡 PROVAS ajudam muito:\n• Fotos de lesões\n• Relatórios médicos\n• Mensagens ameaçadoras\n\nVocê tem documentado as agressões?',
  ],

  // Minimização/Normalização
  minimization: [
    'Frases como "não foi tão grave" ou "foi só dessa vez" são sinais de minimização.\n\n⚠️ VERDADE:\n• QUALQUER violência é grave\n• Não existe "só um empurrão"\n• Você não está exagerando\n• Seus sentimentos são válidos\n\nNinguém tem direito de te machucar. NUNCA.\n\nVocê consegue descrever o que aconteceu sem minimizar?',
    'Percebo que você está diminuindo a gravidade do que viveu. Isso é normal, mas perigoso.\n\n🔍 TESTE DE REALIDADE:\nSe uma amiga contasse isso pra você, o que diria?\n\nVocê merece o mesmo cuidado que daria aos outros.\n\nO que REALMENTE aconteceu?',
  ],

  // Confusão/Gaslighting
  confusion: [
    'Se você se sente confusa sobre o que é real, pode estar sofrendo "gaslighting" - manipulação que faz você duvidar da própria memória.\n\n🚩 SINAIS:\n• "Você está louca"\n• "Isso nunca aconteceu"\n• "Você está exagerando"\n• "Foi culpa sua"\n\nSUA PERCEPÇÃO É REAL. Confie em si mesma.\n\nVocê tem conseguido confiar nas suas próprias memórias?',
    'A confusão que sente pode ser resultado de manipulação contínua.\n\n✅ RECONECTE COM A REALIDADE:\n• Escreva o que aconteceu logo após\n• Confie no seu primeiro instinto\n• Converse com pessoas neutras\n• Guarde provas (mensagens, fotos)\n\nVocê está certa. Você não está imaginando coisas.\n\nO que te faz duvidar de si mesma?',
  ],

  // Vergonha
  shame: [
    'Vergonha é uma das armas mais poderosas do abusador. Mas:\n\n💡 VERDADE:\n• Você NÃO causou isso\n• Não há vergonha em ser vítima\n• A culpa é DELE, não sua\n• Pedir ajuda é coragem\n\nVergonha nos mantém presas. Compartilhar liberta.\n\nVocê consegue identificar de onde vem essa vergonha?',
    'Muitas mulheres sentem vergonha de:\n• Não ter saído antes\n• "Ter escolhido" ele\n• Outras pessoas descobrirem\n• Precisar de ajuda\n\nMAS todas essas "culpas" são injustas.\n\nVocê fez o melhor que pôde com os recursos que tinha.\n\nO que você diria pra alguém que sentisse essa vergonha?',
  ],

  // Isolamento
  isolation: [
    'Sentir-se sozinha é parte da estratégia dele. Abusadores isolam para ter controle total.\n\n🔗 RECONECTAR:\n• Família e amigos ainda se importam\n• Nunca é tarde para retomar contatos\n• Você não precisa explicar tudo\n• Há grupos de apoio anônimos\n\nVocê tem ALGUÉM em quem confia, mesmo que não fale há tempos?',
    'Isolamento social é um dos sinais mais perigosos de abuso.\n\nEle:\n• Critica seus amigos/família?\n• Dificulta você sair sozinha?\n• Verifica suas mensagens?\n• Te faz sentir que ninguém te entende?\n\nIsso não é amor. É controle.\n\nQuem você costumava ver antes dele?',
  ],
  
  support: [
    'Estou aqui com você. Este é um espaço seguro onde você pode expressar o que sente.\n\n💚 Você pode:\n• Desabafar sem ser julgada\n• Fazer perguntas\n• Explorar suas opções\n• Simplesmente ser ouvida\n\nNão há pressa. Vamos no seu tempo.\n\nO que está pesando no seu coração agora?',
    'Obrigada por confiar em mim. Sua coragem ao buscar ajuda é admirável.\n\n🌸 Lembre-se:\n• Seus sentimentos são válidos\n• Você merece ser respeitada\n• Não há perguntas "bobas"\n• Você não está sozinha\n\nComo posso apoiar você melhor neste momento?',
    'Às vezes, o mais difícil é começar a falar. E você já deu esse passo.\n\n✨ Aqui você pode:\n• Compartilhar no seu ritmo\n• Mudar de assunto quando quiser\n• Fazer pausas\n• Voltar quando precisar\n\nEstou aqui para VOCÊ. O que você precisa agora?',
  ],
};

// Técnica de Grounding para crises (5-4-3-2-1)
const groundingResponse = `🌿 TÉCNICA DE ANCORAGEM (5-4-3-2-1)

Vamos trazer você para o momento presente. Respire fundo e observe ao seu redor:

👁️ Nomeie 5 COISAS que você VÊ
✋ Toque 4 COISAS e sinta a textura
👂 Escute 3 SONS ao redor
👃 Perceba 2 CHEIROS
👅 Note 1 SABOR na boca

Faça devagar, respirando entre cada item.
Isso acalma seu sistema nervoso.

Você está mais calma agora?`;

// Detecta intenção da mensagem do usuário com análise mais profunda
const detectIntent = (message) => {
  const msg = message.toLowerCase();
  
  // Avaliação de risco imediato - PRIORIDADE MÁXIMA
  if (/(está aqui|vai chegar|vai me|tá chegando|ele está|escondida|me esconder|socorro|help|ajuda urgente|perigo|me ajuda|preciso de ajuda agora|ele vai|vai fazer|está chegando|estou com medo agora|agora mesmo)/.test(msg)) {
    return 'danger';
  }
  
  // Detecta pensamentos suicidas ou desespero extremo
  if (/(suicid|me matar|morrer|acabar com|não quero mais viver|melhor morrer)/.test(msg)) {
    return 'suicide';
  }
  
  // Palavras-chave para cada categoria com contexto psicológico
  const patterns = {
    greeting: /^(oi|olá|ola|hey|bom dia|boa tarde|boa noite|alguém|tem alguém|preciso falar)/,
    
    // Estados emocionais
    fear: /(medo|assustada|com medo|apavorada|terror|pânico|nervosa|ansiosa|tensa|tremendo)/,
    sadness: /(triste|deprimida|vazio|sem esperança|não aguento|cansada|exausta)/,
    guilt: /(culpa|minha culpa|mereci|provoquei|vergonha|envergonhada|errei)/,
    anger: /(raiva|ódio|revoltada|injusto|não é justo)/,
    shame: /(vergonha|envergonhada|humilhada|ninguém pode saber|segredo|esconder)/,
    
    // Situações específicas
    afterViolence: /(bateu|agrediu|machucou|violência|apanhar|soco|empurr|estrangul|chut|agredida|espancada)/,
    threat: /(ameaça|ameaçou|vai fazer|disse que vai)/,
    control: /(controla|não deixa|proíbe|vigia|mexe no celular|checa|segue)/,
    
    // Padrões psicológicos
    minimization: /(não foi tão grave|foi só|apenas|não foi nada|exagero|sensível demais)/,
    confusion: /(confusa|não sei mais|será que imaginei|ele disse que não|estou louca|aconteceu mesmo)/,
    isolation: /(sozinha|ninguém entende|sem amigos|sem família|isolada|não posso contar)/,
    
    // Dúvidas e decisões
    doubt: /(dúvida|não sei|será que|vale a pena|confusa|o que faço)/,
    love: /(ama|ainda amo|amo ele|gosta de mim|amor)/,
    change: /(vai mudar|pode mudar|mudou|diferente|promete)/,
    
    // Ação e planejamento
    exitPlan: /(sair|fugir|ir embora|deixar|terminar|separar|plano|como sair|preparar)/,
    legalHelp: /(queixa|denúncia|polícia|advogado|direitos|lei|processo)/,
    
    // Contexto social
    isolation: /(sozinha|ninguém|sem amigos|sem família|isolada|não tenho ninguém)/,
    children: /(filho|filha|criança|bebê|crianças|filhos|meu filho|minha filha)/,
    financial: /(dinheiro|trabalho|emprego|financeira|grana|pagar|casa|sustentar)/,
    
    // Ciclo do abuso
    cycle: /(promete|vai mudar|mudou|pede desculpa|arrependido|não vai mais|primeira vez|nunca mais)/,
    
    // Recursos pessoais
    strength: /(conseguir|força|coragem|fraca|incapaz|não consigo)/,
  };
  
  // Busca por padrões de risco específicos
  for (const [intent, pattern] of Object.entries(patterns)) {
    if (pattern.test(msg)) {
      return intent;
    }
  }
  
  return 'support'; // fallback empático
};

let mockMessageId = 1;

export const chatAPI = {
  connect: async (userId) => {
    await simulateDelay(500);
    console.log('Mock: Conectado ao chat', userId);
    
    return {
      connected: true,
      sessionId: `mock-session-${Date.now()}`,
    };
  },
  
  disconnect: async () => {
    console.log('Mock: Desconectado do chat');
  },
  
  sendMessage: async (message, history = []) => {
    if (detectPanicWord(message)) {
      console.warn('⚠️ PALAVRA DE PÂNICO DETECTADA:', PANIC_WORD);
    }

    // Se configurado, usa backend de IA via endpoint
    if (AI_ENDPOINT) {
      try {
        const res = await fetch(AI_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Falha no endpoint IA: ${res.status} ${text}`);
        }

        const data = await res.json();
        // Espera-se formato { reply: string }
        return {
          id: mockMessageId++,
          text: data.reply || 'Desculpe, não consegui responder agora.',
          sender: 'assistant',
          timestamp: Date.now(),
          isAI: true,
        };
      } catch (err) {
        console.error('Erro ao consultar IA:', err);
        // Fallback para mock em caso de erro
      }
    }

    // Sistema inteligente de respostas contextuais
    await simulateDelay(1500);
    
    // Detecta intenção da mensagem
    const intent = detectIntent(message);
    
    // Detecta níveis de emergência
    const isSuicide = /\b(suicid|me matar|morrer|acabar com|não quero mais viver|melhor morrer)\b/i.test(message);
    const isPanic = /\b(não consigo|vou morrer|vai me matar|desesperad[oa]|pânico|não aguento mais|quer me matar|me ajuda)\b/i.test(message);
    const isImmediateDanger = intent === 'danger';
    
    // Seleciona resposta apropriada
    const responses = contextualResponses[intent] || contextualResponses.support;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Para suicídio, NÃO adiciona grounding (precisa de intervenção humana urgente)
    // Para perigo imediato, mantém resposta focada em segurança
    // Para pânico sem perigo imediato, adiciona técnica de grounding
    let finalResponse = randomResponse;
    
    if (isPanic && !isSuicide && !isImmediateDanger) {
      finalResponse = randomResponse + '\n\n' + groundingResponse;
    }
    
    // Log de segurança para monitoramento
    if (isSuicide || isImmediateDanger) {
      console.error('⚠️ ALERTA DE SEGURANÇA CRÍTICA:', {
        type: isSuicide ? 'SUICÍDIO' : 'PERIGO IMEDIATO',
        timestamp: new Date().toISOString(),
        message: message.substring(0, 50) + '...',
      });
    }
    
    return {
      id: mockMessageId++,
      text: finalResponse,
      sender: 'assistant',
      timestamp: Date.now(),
      isAI: true,
    };
  },
  
  requestHumanSupport: async () => {
    await simulateDelay(2000);
    console.log('Mock: Solicitado apoio humano');
    
    return {
      success: true,
      message: 'Estamos conectando você com um membro da nossa equipe. Por favor, aguarde.',
      estimatedWaitTime: 180,
    };
  },
  
  sendSilentAlert: async (location, contacts) => {
    await simulateDelay(1000);
    console.log('Mock: Alerta silencioso enviado', {
      location,
      contacts: contacts.length,
    });
    
    return {
      success: true,
      alertId: `alert-${Date.now()}`,
      notifiedContacts: contacts.length,
    };
  },
  
  getHistory: async (limit = 50) => {
    await simulateDelay(500);
    console.log('Mock: Buscando histórico');
    return [];
  },
  
  reportMessage: async (messageId, reason) => {
    await simulateDelay(500);
    console.log('Mock: Mensagem reportada', messageId, reason);
    return { success: true };
  },
};

export const detectPanicWord = (message) => {
  if (!message) return false;
  return message.toLowerCase().includes(PANIC_WORD);
};

export const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
};

export default chatAPI;
