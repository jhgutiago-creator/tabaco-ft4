/*
  # Insert program weeks data

  1. Data Insertion
    - Insert all 12 weeks of program data
    - Include tasks, tips, and content for each week

  2. Content
    - Evidence-based tips for smoking cessation
    - Health milestones and recovery information
    - Practical strategies for each phase
*/

INSERT INTO program_weeks (
  week_number, title, theme, lesson, circle, activity, checkin, 
  task_title, task_description, tips
) VALUES 
(1, 'Autoconhecimento', 'Preparação e Consciência', 
 'Como o vício age no cérebro', 'Minha história com a substância', 
 'Diário de hábitos (horário, gatilho, sentimentos)', 'Consumo inicial',
 'Primeiros passos da libertação',
 'Na primeira semana, é comum sentir ansiedade, irritabilidade e fissura intensa. Seu corpo está começando a se adaptar à ausência da nicotina.',
 ARRAY[
   'Respiração 4-7-8: Inspire por 4 segundos, segure por 7, expire por 8. Repita 4 vezes quando sentir fissura.',
   'Hidratação: Beba água gelada quando sentir vontade de fumar. Ajuda a reduzir a ansiedade e limpa o organismo.',
   'Movimento: Faça 10 polichinelos ou uma caminhada rápida de 2 minutos para liberar endorfinas.',
   'Substitutos orais: Masque chicletes sem açúcar, palitos de dente ou cenoura para ocupar a boca.',
   'Marco de saúde: Em 20 minutos sem fumar, sua frequência cardíaca e pressão arterial já começam a normalizar.'
 ]),

(2, 'Motivação para mudança', 'Preparação e Consciência',
 'O impacto na saúde, família e vida', 'O que me motiva a mudar?',
 'Lista de motivos pessoais', 'Escala de motivação (0–10)',
 'Fortalecendo sua decisão',
 'Na segunda semana, a fissura física diminui, mas pode surgir ansiedade emocional. É normal questionar sua decisão - isso faz parte do processo.',
 ARRAY[
   'Lista de motivações: Releia sua lista de motivos 3x ao dia, especialmente nos momentos de fissura.',
   'Visualização: Imagine-se daqui a 1 ano, saudável e livre. Dedique 5 minutos diários a essa prática.',
   'Recompensas: Calcule quanto já economizou e planeje uma pequena recompensa para si mesmo.',
   'Apoio social: Conte para 3 pessoas próximas sobre sua decisão e peça apoio delas.',
   'Marco de saúde: Em 12 horas, o nível de monóxido de carbono no sangue normaliza completamente.'
 ]),

(3, 'Lidando com a abstinência', 'Preparação e Consciência',
 'Estratégias para crises e fissuras', 'Compartilhando técnicas que ajudam',
 'Testar respiração diafragmática', 'Registrar episódios de fissura',
 'Superando as crises',
 'Na terceira semana, os sintomas físicos diminuem, mas podem surgir fissuras psicológicas intensas. É comum sentir irritabilidade e dificuldade de concentração.',
 ARRAY[
   'Técnica 5-4-3-2-1: Identifique 5 coisas que vê, 4 que ouve, 3 que toca, 2 que cheira, 1 que saboreia para controlar ansiedade.',
   'Mudança de ambiente: Quando sentir fissura, mude imediatamente de local. Vá para outro cômodo ou saia de casa.',
   'Atividade física: 15 minutos de exercício liberam endorfinas que combatem naturalmente a fissura.',
   'Distração ativa: Tenha sempre uma lista de atividades de 5 minutos: ligar para alguém, fazer palavras cruzadas, organizar algo.',
   'Marco de saúde: Em 2 semanas, sua circulação melhora significativamente e o risco de ataque cardíaco diminui.'
 ]),

(4, 'Primeiras conquistas', 'Preparação e Consciência',
 'Alimentação e sono como aliados', 'Vitórias da semana',
 'Desafio 72h sem uso', 'Autoavaliação semanal',
 'Celebrando as vitórias',
 'No final do primeiro mês, você pode sentir mais energia e melhora no paladar. Algumas pessoas relatam ganho de peso - isso é normal e temporário.',
 ARRAY[
   'Alimentação equilibrada: Coma frutas e vegetais para combater a ansiedade. Evite açúcar em excesso.',
   'Sono reparador: Estabeleça uma rotina de sono. A nicotina afetava seu ciclo do sono, agora ele está se normalizando.',
   'Celebração consciente: Comemore cada dia livre com algo saudável - um banho relaxante, música favorita.',
   'Controle de peso: Se houver ganho de peso, foque em atividades físicas leves. É temporário.',
   'Marco de saúde: Em 1 mês, sua capacidade pulmonar aumenta em até 30% e a tosse diminui significativamente.'
 ]),

(5, 'Reorganizando a rotina', 'Fortalecimento e Mudança',
 'Substituição de hábitos destrutivos', 'Atividades que me ajudam a esquecer o vício',
 'Criar rotina saudável diária', 'Comparar evolução com semana 1',
 'Construindo novos hábitos',
 'No segundo mês, a dependência física praticamente desaparece. O desafio agora é psicológico - quebrar associações mentais com o cigarro.',
 ARRAY[
   'Rotina matinal: Substitua o cigarro matinal por 10 minutos de alongamento ou meditação.',
   'Pausas ativas: No trabalho, substitua as pausas para fumar por caminhadas ou exercícios de respiração.',
   'Novos rituais: Crie novos hábitos para momentos que antes fumava - chá após refeições, música no carro.',
   'Ambiente livre: Remova todos os objetos relacionados ao cigarro de casa e carro.',
   'Marco de saúde: Em 6 semanas, o risco de infecções respiratórias diminui drasticamente.'
 ]),

(6, 'Apoio social', 'Fortalecimento e Mudança',
 'Como pedir ajuda a familiares e amigos', 'Quem é minha rede de apoio?',
 'Conversar com 1 pessoa de confiança', 'Relatar experiência',
 'Fortalecendo vínculos',
 'Nesta fase, você pode sentir necessidade de reconexão social. Algumas pessoas evitavam situações sociais por causa do cigarro.',
 ARRAY[
   'Comunicação clara: Explique para família e amigos como eles podem ajudar - evitar oferecer cigarros, apoiar nos momentos difíceis.',
   'Novas atividades sociais: Explore ambientes livres de fumo - cinemas, museus, parques.',
   'Grupo de apoio: Participe ativamente das rodas de conversa. Compartilhar experiências fortalece a decisão.',
   'Relacionamentos saudáveis: Identifique pessoas que apoiam sua mudança e passe mais tempo com elas.',
   'Marco de saúde: Em 2 meses, sua energia física aumenta significativamente e a respiração melhora.'
 ]),

(7, 'Saúde física e mental', 'Fortalecimento e Mudança',
 'Exercícios e práticas para reduzir ansiedade', 'Práticas de alongamento e respiração em grupo',
 'Caminhada 20 min/dia', 'Relatar disposição física',
 'Cuidando do corpo e mente',
 'Aos 2 meses, muitas pessoas relatam melhora significativa na disposição física. É um ótimo momento para estabelecer rotinas de exercício.',
 ARRAY[
   'Exercício regular: 20-30 minutos de caminhada diária melhoram humor e reduzem ansiedade naturalmente.',
   'Respiração consciente: Pratique respiração diafragmática 3x ao dia para controlar ansiedade residual.',
   'Alongamento: 10 minutos de alongamento pela manhã ajudam a relaxar e começar o dia positivamente.',
   'Mindfulness: 5 minutos de meditação ou atenção plena reduzem o estresse e fortalecem o autocontrole.',
   'Marco de saúde: Em 2 meses, sua circulação melhora drasticamente e o risco de doenças cardíacas diminui.'
 ]),

(8, 'Superando recaídas', 'Fortalecimento e Mudança',
 'Entendendo gatilhos e recaídas', 'Já recaí, e agora?',
 'Plano pessoal de prevenção', 'Revisar diário de hábitos',
 'Prevenindo recaídas',
 'Nesta fase, é importante estar preparado para situações de risco. Identificar gatilhos específicos é fundamental para manter-se livre.',
 ARRAY[
   'Mapeamento de gatilhos: Identifique situações, pessoas e emoções que despertam vontade de fumar.',
   'Plano de emergência: Tenha sempre 3 estratégias prontas para momentos de crise intensa.',
   'Rede de apoio: Tenha o número de 2 pessoas para ligar em momentos difíceis.',
   'Autocompaixão: Se houver recaída, não se culpe. Analise o que aconteceu e retome imediatamente.',
   'Marco de saúde: Em 3 meses, sua função pulmonar melhora em até 30% e a tosse praticamente desaparece.'
 ]),

(9, 'Propósito de vida', 'Consolidação e Nova Vida',
 'Encontrando sentido além da substância', 'O que quero conquistar no futuro?',
 'Escrever carta para si daqui 1 ano', 'Compartilhar metas',
 'Redescobrindo propósitos',
 'No terceiro mês, muitas pessoas relatam uma sensação de "renascimento". É comum questionar prioridades e buscar novos significados.',
 ARRAY[
   'Visão de futuro: Escreva detalhadamente como você se vê daqui a 1 ano, livre e saudável.',
   'Novos hobbies: Explore atividades que sempre quis fazer mas o cigarro limitava.',
   'Metas tangíveis: Defina 3 objetivos específicos que só são possíveis sendo livre do cigarro.',
   'Gratidão diária: Liste 3 coisas pelas quais é grato todos os dias - fortalece a positividade.',
   'Marco de saúde: Em 3 meses, o risco de infarto diminui significativamente e a energia física se estabiliza.'
 ]),

(10, 'Trabalho e produtividade', 'Consolidação e Nova Vida',
 'Reconstruindo a vida profissional', 'Histórias de superação',
 'Definir micro-objetivos semanais', 'Relatar progresso',
 'Reconstruindo a produtividade',
 'Nesta fase, muitas pessoas notam melhora na concentração e produtividade. O cérebro está se adaptando a funcionar sem nicotina.',
 ARRAY[
   'Foco aprimorado: Use técnicas de pomodoro (25 min focado, 5 min pausa) para maximizar a concentração.',
   'Pausas saudáveis: Substitua pausas para fumar por caminhadas, alongamentos ou conversas positivas.',
   'Objetivos claros: Defina metas semanais pequenas e alcançáveis no trabalho.',
   'Energia renovada: Aproveite o aumento de energia para projetos que estavam parados.',
   'Marco de saúde: Em 4 meses, sua capacidade de concentração melhora significativamente.'
 ]),

(11, 'Relacionamentos', 'Consolidação e Nova Vida',
 'Reconstruindo confiança com família e amigos', 'Como meus vícios afetam meus relacionamentos',
 'Ação de reparação (pequeno gesto de reconciliação)', 'Compartilhar experiência',
 'Reparando vínculos',
 'Aos 5-6 meses, é comum sentir necessidade de reparar relacionamentos que foram afetados pelo vício. É um sinal de maturidade emocional.',
 ARRAY[
   'Conversas honestas: Tenha conversas abertas sobre como o cigarro afetou seus relacionamentos.',
   'Gestos de reparação: Faça pequenas ações que demonstrem sua mudança - mais presença, atenção.',
   'Qualidade do tempo: Dedique tempo de qualidade para pessoas importantes, sem distrações.',
   'Perdão próprio: Perdoe-se pelos erros do passado. Foque no presente e futuro.',
   'Marco de saúde: Em 6 meses, o risco de câncer de boca e garganta diminui em 50%.'
 ]),

(12, 'Celebração e continuação', 'Consolidação e Nova Vida',
 'Como manter a mudança a longo prazo', 'Minha jornada até aqui',
 'Ritual de celebração (escrever depoimento ou gravar vídeo)', 'Compartilhar experiência',
 'Celebrando a transformação',
 'Parabéns! Você completou 12 semanas de transformação. Agora o foco é manter os hábitos saudáveis conquistados.',
 ARRAY[
   'Ritual de celebração: Crie um momento especial para celebrar sua conquista - jantar especial, viagem, presente.',
   'Depoimento inspirador: Escreva ou grave sua história para inspirar outras pessoas.',
   'Plano de manutenção: Defina estratégias para manter-se livre a longo prazo.',
   'Rede de apoio contínua: Mantenha contato com o grupo e continue participando das atividades.',
   'Marco de saúde: Em 1 ano, o risco de doença cardíaca diminui pela metade comparado a quando fumava.'
 ])
ON CONFLICT (week_number) DO NOTHING;