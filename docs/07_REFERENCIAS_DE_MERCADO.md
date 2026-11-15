# 07 — O que funciona nos produtos de estudo com resultado

> Pedido do Kaio (15/11/2026): "aumente a envergadura, avance com ferramentas de aprendizado ainda melhores e aprofunde o aprendizado; use referências e sugestões dos resultados visíveis no mercado". Este documento liga cada ferramenta do Domínio a uma evidência (pesquisa ou produto que a mede em escala) e define a ordem das próximas. Complementa o doc 04, que trata da base científica de cada decisão de ensino.

## 1. O que a pesquisa e o mercado concordam

| Técnica | Evidência | Quem usa em escala | No Domínio |
| --- | --- | --- | --- |
| **Prática espaçada** (estudar em dias separados, não de uma vez) | Uma das duas técnicas de "alta utilidade" na revisão de Dunlosky e colegas (2013), que avaliou dez técnicas de estudo | Anki, Duolingo (modelo de meia-vida, Settles e Meeder, 2016) | Revisão com o FSRS (seção 2) |
| **Testes de recuperação** (lembrar respondendo, não relendo) | A outra técnica de alta utilidade em Dunlosky (2013); Roediger e Karpicke (2006): testar rende mais retenção no longo prazo do que reestudar | Anki, Duolingo, bancos de questões de concurso | Perguntas corrigidas em toda etapa; revisão refaz o exercício, não mostra a resposta |
| **Revisar os próprios erros** | Duolingo criou a área de prática a partir de entrevistas sobre a frustração com erros repetidos; caderno de erros é o diagnóstico permanente do concurseiro | Duolingo (Erros), QConcursos (cadernos de erros) | Treino de erros (seção 3) |
| **Intercalar matérias** (misturar tipos de problema na prática) | Rohrer e colegas: em sala de aula, 61% contra 38% um mês depois (d = 0,83, ensaio pré-registrado com 54 turmas) | Brilliant, Khan Academy (desafios de unidade) | A fila do dia alterna as matérias, um cartão de cada vez |
| **Calibrar a confiança** (saber o que se sabe) | Quem acerta uma vez costuma achar que já sabe e para cedo; o treino de julgamento com retorno melhora a calibragem (Bjork, Dunlosky e Kornell, 2013; Hausman, Myers e Rhodes, 2018) | Plataformas de prova adaptativa | Painel "Sua confiança" (seção 4) |
| **Domínio por níveis** (avançar só depois de dominar) | Khan Academy: cada habilidade vale 100 pontos, em Familiar (50), Proficiente (80) e Dominado (100), e cai de nível quando o desempenho cai | Khan Academy | Próximo passo (seção 5) |
| **Passo a passo com uma ação por tela** | Carga cognitiva menor; é o formato dos apps de maior retenção diária | Mimo, Duolingo, Brilliant | A Entenda em telas com "Próximo" (seção 6) |

## 2. Revisão com o FSRS (entregue em 15/11/2026)

- **O que é:** o FSRS (Free Spaced Repetition Scheduler) é o algoritmo de revisão espaçada do Anki. No benchmark aberto do projeto, ele é o que melhor prevê quando uma lembrança vai ser esquecida, medido por perda logarítmica (*log loss*). A versão 6 com parâmetros por usuário vence o SM-2, o algoritmo clássico, na grande maioria das coleções testadas. A SuperMemo contesta a métrica do benchmark. Isso não muda a escolha: o FSRS é aberto, tem licença MIT e já estava previsto na stack (`ts-fsrs`).
- **Como funciona aqui:** cada exercício que não sai de primeira vira um cartão. O FSRS guarda a estabilidade da memória e marca o próximo encontro para quando a chance de lembrar cair a 90% (retenção desejada do doc 04, seção 6). A nota sai do que aconteceu, sem perguntar nada ao Kaio: de primeira é Bom; na segunda tentativa ou no chute, Difícil; o resto, Errei. Nada volta no mesmo dia.
- **Arquivos:** `apostila/vendor/ts-fsrs-4.7.1.mjs` (cópia sem alterações, para abrir sem internet), `apostila/licoes/fsrs.js` (a configuração) e `Motor.Revisao` em `licoes/motor.js`. Sem o módulo, a revisão cai nos intervalos fixos antigos (1, 3, 7, 14 e 30 dias). Os cartões antigos passam ao FSRS na primeira revisão.
- **Teste:** `tests/apostila-fsrs.test.ts` simula 30 dias de revisão. Os intervalos crescem com acertos (1, 3, 7, 18 dias), encolhem depois de um erro e voltam a crescer: é o critério de aceite da Fase 4.

## 3. Treino de erros (entregue em 15/11/2026)

Na página de revisão, o botão "Treinar meus erros" traz os dez exercícios mais errados, vencidos ou não, em ordem de quantos erros cada um teve. É a ação principal quando nada vence no dia. O link `licoes/REVISAR.html?modo=erros` abre direto nele.

## 4. Sua memória e sua confiança (entregue em 15/11/2026)

A página de revisão abre com um painel:
- **Força das lembranças:** quantas estão frágeis (estabilidade de até 3 dias), em formação (até 3 semanas) e firmes (3 semanas ou mais). Cada cartão mostra a chance estimada de lembrar hoje, pela curva de esquecimento do FSRS.
- **Calibragem:** quando o Kaio marca "Certeza" num Certo ou Errado, quanto ele acerta. Se for menos de 80%, o painel avisa que a certeza está alta demais. Se os chutes acertam muito, avisa que ele sabe mais do que acha. Os dados vêm da confiança que as lições já guardavam (`dominio:ce:v1`) e que até aqui não apareciam em lugar nenhum.

## 5. Próximas ferramentas, em ordem

1. **Domínio por níveis em cada conceito** (Khan Academy): Visto, Praticado (exercícios de primeira), Retido (cartão com estabilidade de 3 semanas ou mais) e Dominado (retido em todos os exercícios do conceito). O mapa e a matéria passam a contar domínio pela memória, e não só pela pergunta final. O nível pode cair, como na Khan.
2. **Simulado por banca, à parte das lições** (cadernos e simulados dos sites de questões de concurso): Certo ou Errado no estilo Cebraspe, com tempo e com o saldo de +1 e −1 só ali. O saldo saiu das lições em 27/10/2026 porque confundia o estudo. Os erros do simulado entram no treino de erros.
3. **Pares que se confundem** (intercalação dirigida do doc 04, seção 6): WHERE × HAVING, COUNT(*) × COUNT(coluna), INNER × LEFT JOIN, lista × tupla, média × mediana. A revisão força o contraste, com um de cada lado.
4. **Projeto guiado de ponta a ponta** (os projetos dos cursos de dados no navegador): uma pergunta de negócio respondida com o banco de estudo, do SQL ao gráfico e ao recado para o gestor, usando o Centro de Dados e o "Faça no Python" que já existem.
5. **Meta do dia e resumo da semana** (Duolingo): um treino de 10 minutos que junta a revisão vencida, um conceito novo e um exercício do laboratório. O resumo da semana mostra o que ficou firme e o que ficou frágil.
6. **Explique para o tutor** (Fase 6): o Kaio explica o conceito em três linhas e o Claude, socrático, aponta a lacuna exata. É a autoexplicação do doc 04 com retorno de verdade.

## 6. A Entenda em telas (entregue em 15/11/2026)

Pedido do Kaio: "esses passos do tocar não são entendidos rapidamente; coloque em formato de próximo, próximo".
- **A etapa Entenda de cada conceito virou telas, uma por bloco:** o desafio, a ideia com o dia a dia, a animação, o comando em Python ou a bancada, e o exemplo resolvido. Cada tela mostra "Parte 2 de 5" no alto, e o botão de baixo diz "Próximo 2 de 5" até a última, que leva aos exercícios. O Voltar desfaz uma tela por vez, e a tela em que se parou fica guardada.
- **As animações:** saem os três botões lado a lado (Voltar, Tocar, Passo). Fica Anterior e Próximo, com a contagem dentro do Próximo e os pontos só como indicação. Nada anima sozinho. No último passo, o mesmo botão vira "Ver de novo". Os desenhos de planta seguem o mesmo par (Anterior e Próximo).

## Fontes

- Dunlosky, J. et al. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1). Resumo das notas de utilidade: https://texasldcenter.org/?p=346
- Roediger, H. L. e Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3), 249–255. Revisão posterior: https://pmc.ncbi.nlm.nih.gov/articles/PMC10381660
- Benchmark de algoritmos de revisão espaçada (FSRS, SM-2 e outros): https://expertium.github.io/Benchmark.html e a história do FSRS no Anki: https://www.lesswrong.com/posts/G7fpGCi8r7nCKXsQk/the-history-of-fsrs-for-anki
- Objeção da SuperMemo ao benchmark: https://supermemo.com/en/blog/supermemo-is-better-than-fsrs-by-far
- Settles, B. e Meeder, B. (2016). A trainable spaced repetition model for language learning. ACL: https://preview.aclanthology.org/fix_video/P16-1174.pdf
- Duolingo, como trabalha com os aprendizes (origem da área de prática e dos Erros): https://blog.duolingo.com/how-duolingo-works-with-learners/ e formas de praticar: https://blog.duolingo.com/ways-to-practice-in-duolingo
- Khan Academy, níveis de domínio: https://support.khanacademy.org/hc/en-us/articles/115002552631
- Intercalação em matemática (Rohrer e colegas): https://retrievalpractice.org/archive/2017/interleaving e https://ies.ed.gov/use-work/awards/interleaved-mathematics-practice
- Bjork, R. A., Dunlosky, J. e Kornell, N. (2013). Self-regulated learning: beliefs, techniques, and illusions: https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/RBjork_Dunlosky_Kornell_2012.pdf
- Hausman, Myers e Rhodes (2018), metacognição em sala de aula: https://escholarship.org/content/qt9zd141fk/qt9zd141fk.pdf?t=rs9zd7
- Caderno de erros para concurso (Estratégia Concursos): https://www.estrategiaconcursos.com.br/blog/caderno-de-erros-para-concurso/amp/
