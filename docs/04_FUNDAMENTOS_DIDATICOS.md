# 04 · Fundamentos didáticos do DOMÍNIO

> Para que serve: a base científica das decisões de ensino do app. Cada decisão aponta a fonte; quando a evidência é fraca ou mista, isso está escrito.
> Todas as referências têm DOI conferido no Crossref em 11/10/2026. Fatos técnicos (SQLite, PostgreSQL, FSRS) vêm da documentação oficial.
> Este documento amplia o blueprint (seção 2) e o DESIGN; não substitui nenhum dos dois.

Força da evidência usada abaixo:

- **Forte**: meta-análise ou revisão ampla, com efeito consistente.
- **Moderada**: experimentos controlados, mas poucos ou em contextos específicos.
- **Limitada**: poucos estudos, resultados mistos ou estudo qualitativo.
- **Técnica**: documentação oficial (não é pesquisa em educação, é como a ferramenta funciona).

---

## 1. As decisões, em uma tabela

| # | Decisão no DOMÍNIO | Por quê | Força | Fase |
|---|---|---|---|---|
| 1 | O **desafio** vira uma pré-pergunta curta (1 item, 1 minuto) sobre exatamente o conceito da lição. Errar é esperado e não pesa. | Perguntar antes ajuda a aprender **o que foi perguntado** (g = 0,54), quase nada além disso (g = 0,04) [St. Hilaire et al., 2024]. Resolver problemas antes da instrução funciona quando há conhecimento prévio suficiente e uma consolidação depois [Sinha & Kapur, 2021]. Iniciantes aprendem melhor com exemplo resolvido do que com problema aberto [Sweller et al., 2019]. | Forte | 2 |
| 2 | Todo **exemplo resolvido** mostra os passos com **subobjetivos rotulados** ("de onde vêm as linhas", "quais linhas entram", "como agrupar"...). | Exemplos resolvidos reduzem a carga para iniciantes [Atkinson et al., 2000]. Rótulos de subobjetivo melhoraram desempenho e transferência em programação [Margulieux et al., 2012]. | Forte | 2 |
| 3 | Dentro do exemplo, uma **autoexplicação** de baixo esforço: escolher, entre 3 opções, o porquê de um passo. O "explicar em 3 linhas" continua no fechamento. | Induzir autoexplicação tem efeito médio (g = 0,55, 69 efeitos) [Bisra et al., 2018]; classificada como técnica de utilidade moderada [Dunlosky et al., 2013]. | Forte | 2 |
| 4 | **Apoio que some**: exemplo completo → completar uma lacuna → Parsons → escrever do zero. Quem acerta de primeira **pula** o degrau seguinte. | O que ajuda o iniciante atrapalha quem já sabe (efeito de reversão da expertise) [Kalyuga et al., 2003]. | Forte | 2 (fixo) e 4 (adaptativo) |
| 5 | **Parsons** é o degrau antes de escrever do zero; os distratores vêm do catálogo de erros (seção 4). | Mesmo ganho de aprendizagem em menos tempo que corrigir ou escrever código [Ericson et al., 2017]; revisão ampla em [Ericson et al., 2022]. | Moderada | 2 |
| 6 | Nos itens de código, a sequência **PRIMM**: prever → rodar → investigar → modificar → criar. | Turmas com PRIMM (13 escolas, 493 alunos) foram melhor no pós-teste que o grupo controle [Sentance et al., 2019]. | Moderada | 2 e 3 |
| 7 | **Feedback em três partes**: o que já está certo, o erro exato (cláusula ou linha) e um próximo passo. Nunca só "errado". | Feedback tem efeito médio (d = 0,48), maior quanto mais informação útil carrega [Wisniewski et al., 2020]; deve ser específico, oportuno e não avaliativo [Shute, 2008]; responde "para onde vou, como estou, o que vem a seguir" [Hattie & Timperley, 2007]. | Forte | 2, 3 e 6 |
| 8 | Para erros comuns, **texto de refutação**: "Muita gente pensa X. Na verdade, Y, porque Z." | Textos que nomeiam e refutam a concepção errada aumentam a transferência [Beker et al., 2019]; erros de SQL de iniciantes vêm de concepções previsíveis [Miedema et al., 2021]. | Moderada | 2 e 3 |
| 9 | No laboratório, **"ver passo a passo"**: a tabela intermediária de cada cláusula, na ordem lógica (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY). | SQL é declarativo e não dá para "rastrear" como um programa; iniciantes tratam o banco como caixa-preta, e os autores indicam visualizar resultados intermediários [Miedema et al., 2021]. | Limitada | 3 |
| 10 | **Revisão espaçada** com retenção desejada de 0,90 e recuperação ativa (lembrar, não reler). | Testes de prática superam reestudo [Adesope et al., 2017; Roediger & Karpicke, 2006]; espaçar supera concentrar, e o intervalo ideal cresce com o tempo até a prova [Cepeda et al., 2006]. | Forte | 4 |
| 11 | **Intercalar** na revisão conceitos parecidos que precisam ser diferenciados (WHERE × HAVING, COUNT(*) × COUNT(coluna), INNER × LEFT JOIN, lista × tupla). A lição nova continua em bloco. | Intercalar tem efeito moderado (g = 0,42), maior quando as categorias se parecem e é preciso discriminá-las [Brunmair & Richter, 2019]. | Forte | 4 |
| 12 | **Tutor com trilhos**: recebe a solução correta, dá pistas em degraus e nunca entrega a resposta antes da tentativa. | IA sem trilhos piorou a prova sem IA em 17%; com trilhos (pistas, sem respostas) o dano sumiu [Bastani et al., 2025]. Tutor com solução pré-escrita e passos guiados superou aula ativa (cerca de 0,63 DP) [Kestin et al., 2025]. | Moderada | 6 |
| 13 | Nos itens Certo/Errado, perguntar a **confiança** antes de mostrar a resposta, e treinar a nota no estilo Cebraspe. | Erros cometidos com alta confiança são os mais corrigidos depois do feedback (hipercorreção) [Butterfield & Metcalfe, 2001]. Na Cebraspe, o erro costuma descontar um acerto; o edital de cada concurso confirma a regra. | Moderada | 9 |
| 14 | **Hábito**: no Hoje, um "quando e onde vou estudar" opcional; sequência com congelamento e dia mínimo. | Intenções de implementação ("quando X, faço Y") têm efeito médio a grande (d = 0,65) [Gollwitzer & Sheeran, 2006]. O hábito leva tempo variável (mediana de 66 dias) e um dia perdido não zera o progresso [Lally et al., 2010]. | Forte (intenções) e Limitada (hábito) | 9 |
| 15 | **Gamificação mínima**: sequência e progresso, sem pontos nem medalhas por enquanto. | Efeitos pequenos; em motivação e comportamento, instáveis nos estudos mais rigorosos [Sailer & Homner, 2020]. | Moderada | toda |
| 16 | **Domínio antes de avançar**, e no futuro estimar o domínio pelo histórico em vez da regra fixa "3 acertos em 2 dias". | Aprendizagem para o domínio tem efeitos positivos consistentes [Kulik et al., 1990; Bloom, 1984]; knowledge tracing estima o domínio a cada tentativa [Corbett & Anderson, 1995]. | Forte (domínio) | 7 (avaliar) |
| 17 | **Mensagens de erro reescritas** para iniciante: o que houve, onde, e uma pista. | Mensagens de erro de compiladores e bancos atrapalham iniciantes; recomenda-se reduzir a carga, dar contexto e pistas [Becker et al., 2019]. | Moderada | 3 e 8 |
| 18 | Texto e diagrama lado a lado, lição em segmentos curtos, nada decorativo. | Princípios de aprendizagem multimídia: coerência, sinalização, contiguidade, segmentação [Mayer, 2021]. Já está no DESIGN. | Forte | toda |

---

## 2. A lição, revisada

A ordem do CLAUDE.md continua valendo (desafio → conceito → exemplo resolvido → prática → explicar em 3 linhas). Muda o conteúdo de cada passo:

```
0. Mapa            5 s    "Hoje: GROUP BY e HAVING. No fim, você filtra grupos."
1. Desafio         1 min  pré-pergunta sobre o conceito-alvo; errar é esperado; não pesa
2. Conceito        1 min  a regra em uma frase + um diagrama ao lado
3. Exemplo         2 min  passos com subobjetivos rotulados + 1 autoexplicação (escolha)
4. Prática         3 min  degraus: completar → Parsons → prever/rodar → escrever do zero
                          + 1 item de discriminação com o conceito vizinho
5. Fechamento      1 min  explicar em 3 linhas → tutor avalia → itens viram cartas
```

### Exemplo: GROUP BY e HAVING, com o schema da Apostila Viva

**Desafio (pré-pergunta, Certo ou Errado).** A consulta abaixo lista as disciplinas com mais de 5 questões difíceis.

```sql
SELECT disciplina_id
FROM questoes
WHERE dificuldade >= 4 AND COUNT(*) > 5
GROUP BY disciplina_id;
```

Gabarito: **Errado**. Função de agregação (`COUNT`) não pode ficar no WHERE, porque o WHERE filtra linhas antes de existir qualquer grupo. Filtro de grupo vai no HAVING.

**Exemplo resolvido, com subobjetivos na ordem em que o banco pensa:**

```sql
SELECT disciplina_id, COUNT(*) AS dificeis   -- 5. o que mostrar
FROM questoes                                -- 1. de onde vêm as linhas
WHERE dificuldade >= 4                       -- 2. quais linhas entram
GROUP BY disciplina_id                       -- 3. como agrupar
HAVING COUNT(*) > 5                          -- 4. quais grupos ficam
ORDER BY dificeis DESC;                      -- 6. em que ordem
```

**Autoexplicação (escolha o porquê):** por que `dificuldade >= 4` fica no WHERE e `COUNT(*) > 5` fica no HAVING?

- (a) O WHERE filtra linhas antes de agrupar; o HAVING filtra grupos depois. **Correta.**
- (b) Tanto faz; é questão de estilo.
- (c) O HAVING é mais rápido.

Note o `HAVING COUNT(*) > 5`, e não `HAVING dificeis > 5`: o PostgreSQL não aceita o apelido no HAVING, embora o SQLite aceite. A lição ensina a forma que funciona nos dois.

---

## 3. Feedback e pistas

**Certo:** uma frase com o porquê, que reforça o princípio ("O HAVING filtrou os grupos depois de contar."). Elogio raro e específico (DESIGN 7).

**Errado, em três partes:**

1. O que já está certo: "Você agrupou por `disciplina_id`, isso está certo."
2. O erro exato: "O `COUNT(*) > 5` está no WHERE."
3. O próximo passo, como pergunta: "Esse filtro é sobre uma linha ou sobre um grupo?"

**Escada de pistas** (itens e tutor usam a mesma):

| Degrau | O que mostra | Exemplo |
|---|---|---|
| 1 | Pista conceitual | "Filtro de grupo acontece antes ou depois de agrupar?" |
| 2 | Onde está o problema | "Olhe a linha do WHERE." |
| 3 | Um exemplo parecido, com outros dados | a mesma ideia em `respostas`, agrupando por `usuario_id` |
| 4 | A solução, explicada | só depois de 2 tentativas |

Registro: tentativa com pista conta como "usou dica" (não vale para os "3 acertos sem ajuda"); com a solução mostrada, a carta volta como **Errei** no FSRS; com pista, como **Difícil**.

---

## 4. Catálogo de erros de SQL

Ponto de partida para itens "ache o erro", distratores dos Parsons e mensagens do corretor. Vem de estudos com universitários [Miedema et al., 2021; Taipalus et al., 2018; Ahadi et al., 2015] e do seu erro conhecido (aspas). O código de cada erro é o `erro_tipo` gravado na tabela `tentativa`. O seu histórico no app vai mostrar quais aparecem mais para você.

| Código | O erro | Exemplo (schema da Apostila Viva) | O que o app diz |
|---|---|---|---|
| `aspas` | Texto sem aspas, coluna entre aspas simples ou texto entre aspas duplas | `WHERE banca = Cebraspe` · `SELECT 'nome' FROM usuarios` · `WHERE banca = "Cebraspe"` | "É aquele erro das aspas de novo: texto vai entre aspas simples; nome de coluna, sem aspas." |
| `having_vs_where` | Agregação no WHERE | `WHERE COUNT(*) > 5` | "O WHERE filtra linhas, antes dos grupos existirem. Filtro de grupo vai no HAVING." |
| `coluna_solta` | Coluna no SELECT que não está no GROUP BY nem em agregação | `SELECT disciplina_id, enunciado, COUNT(*) FROM questoes GROUP BY disciplina_id` | "Cada grupo tem vários enunciados; qual deles mostrar? Agrupe por ela ou use uma agregação." |
| `join_sem_condicao` | Duas tabelas sem condição de junção (produto cartesiano) | `FROM respostas, questoes WHERE questoes.dificuldade = 5` | "Faltou dizer como as tabelas se ligam: `respostas.questao_id = questoes.id`." |
| `self_join` | Tentar formar pares com a tabela uma vez só | pares de usuários criados no mesmo dia | "Para comparar uma linha com outra da mesma tabela, a tabela entra duas vezes, com apelidos." |
| `virgula_no_where` | Vírgula no lugar de AND | `WHERE correta = 1, usuario_id = 7` | "No WHERE, condições se juntam com AND ou OR, não com vírgula." |
| `operador_de_outra_linguagem` | `==`, `IS NOT 'valor'` ou `≠` | `WHERE banca == 'FGV'` | "Em SQL, igual é `=` e diferente é `<>` (ou `!=`)." |
| `palavra_incompleta` | Palavra-chave sem a segunda parte, ou inventada | `GROUP disciplina_id` · `JOIN questoes` sem ON · `SORT BY` | "É `GROUP BY`, `JOIN ... ON` e `ORDER BY`." |
| `distinct_primeiro` | Usar DISTINCT para "pegar o primeiro" | `SELECT DISTINCT ...` esperando uma linha só | "DISTINCT tira repetidos; não escolhe o primeiro. Para um valor só, use MIN, MAX ou LIMIT." |
| `apelido` | Apelido do lado errado ou usado sem definir | `SELECT nome u FROM usuarios u` | "Define-se `tabela AS apelido` no FROM e usa-se `apelido.coluna` no SELECT." |
| `group_by_para_ordenar` | GROUP BY quando só queria ordenar | `GROUP BY nome ORDER BY nome` | "Para só ordenar, basta ORDER BY; o GROUP BY junta linhas e muda o resultado." |
| `count_coluna` | Confundir `COUNT(*)` com `COUNT(coluna)` | `COUNT(resposta)` com respostas em branco | "`COUNT(*)` conta linhas; `COUNT(coluna)` ignora NULL." |

Concepções que estão por trás desses erros, segundo Miedema et al. (2021): levar regras da matemática e de programação para o SQL (`≠`, `==`), aplicar um "modelo" de consulta que já funcionou sem entender por quê, ler o SQL como português (`IS NOT`, `SORT BY`) e tratar o banco como caixa-preta. Por isso, cada erro vem com o porquê, não só com a correção.

---

## 5. O laboratório e as diferenças entre SQLite e PostgreSQL

O curso usa PostgreSQL e MySQL como apoio (01_MAPA), e o Supabase é PostgreSQL. O `sql.js` é SQLite, que **aceita** coisas que o PostgreSQL rejeita. Sem cuidado, o laboratório ensinaria a errar:

| O SQLite aceita | Consequência para quem aprende | Fonte |
|---|---|---|
| Aspas duplas como texto, quando não existe coluna com aquele nome | `WHERE banca = "Cebraspe"` "funciona", e um nome de coluna digitado errado entre aspas duplas vira texto, sem erro. Isso esconde justamente o erro das aspas. | [SQLite: Quirks](https://www.sqlite.org/quirks.html) |
| Colunas soltas numa consulta com GROUP BY | Devolve um valor de uma linha qualquer do grupo, sem avisar. | [SQLite: Quirks](https://www.sqlite.org/quirks.html) |
| `==` como igualdade e `IS NOT` com qualquer valor | Hábitos de Python passam como certos. | [SQLite: expressões](https://www.sqlite.org/lang_expr.html) |
| Tipos flexíveis (texto em coluna INTEGER, por exemplo) | Dados errados entram sem reclamar. | [SQLite: Quirks](https://www.sqlite.org/quirks.html) |
| Apelido de coluna no HAVING (`HAVING dificeis > 5`) | Funciona aqui e dá erro no PostgreSQL. | teste abaixo |

Testado em 11/10/2026 com o SQLite 3.50.4: todos os casos acima foram aceitos sem erro. Uma coluna digitada errada entre aspas duplas (`SELECT "nmoe" FROM disciplinas`) devolveu o próprio texto `nmoe` em cada linha. Agregação no WHERE dá erro nos dois bancos. Com a tabela criada como `STRICT`, texto em coluna INTEGER passou a dar erro.

Dois caminhos para a Fase 3:

- **A. Manter o `sql.js`** e acrescentar verificações próprias: desligar as aspas duplas como texto (o SQLite tem a configuração `SQLITE_DBCONFIG_DQS_DML`, se o `sql.js` a expuser), detectar colunas soltas, `==` e `IS NOT valor`, e criar as tabelas como `STRICT` ([SQLite: STRICT](https://www.sqlite.org/stricttables.html)).
- **B. Trocar pelo PGlite**: PostgreSQL de verdade compilado para rodar no navegador (menos de 3 MB compactado, licença Apache 2.0 e PostgreSQL) ([pglite.dev](https://pglite.dev/)). Já se comporta como o banco do curso e do Supabase, e as diferenças acima somem. Já estava listado no doc 03.

Recomendação: **B**, porque o laboratório passaria a dar o mesmo erro que a prova e o Supabase dariam. Precisa da sua aprovação, porque muda a stack definida no CLAUDE.md.

---

## 6. Revisão espaçada e intercalação (Fase 4)

- **Modelo do FSRS:** cada carta tem dificuldade (1 a 10), estabilidade (o intervalo em que a chance de lembrar cai para 90%) e recuperabilidade (a chance de lembrar agora). Com retenção desejada de 0,90, o próximo intervalo é igual à estabilidade; meta maior encurta os intervalos e aumenta o número de revisões ([FSRS: o algoritmo](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm)). Começar com **0,90**.
- **Notas:** Errei, Difícil, Bom e Fácil (as quatro do FSRS). Pista usada = Difícil; solução mostrada = Errei.
- **Aquecimento:** até 12 cartas (blueprint 3.1), misturando disciplinas.
- **Intercalação dirigida:** a revisão aproxima pares que se confundem (decisão 11). Na lição nova, o conceito é trabalhado em bloco.
- **Antes de uma AP:** avaliar subir a retenção desejada só das cartas daquela disciplina (mais revisões, mais segurança). Fica para o modo prova (Fase 9).

---

## 7. O tutor (Fase 6): acréscimos ao prompt da seção 5.1 do blueprint

O prompt atual continua valendo. Os estudos com tutores de IA [Bastani et al., 2025; Kestin et al., 2025] sustentam estes acréscimos:

1. O tutor recebe a solução correta e o critério do item, para conferir com segurança; não mostra a solução antes de duas tentativas.
2. As pistas seguem a escada da seção 3, um degrau por vez.
3. A resposta do tutor informa qual degrau de pista usou (`"pista": 0 a 4` no JSON), para o app registrar "usou dica".
4. Um passo por vez: se o erro tem duas causas, trata a primeira e espera.

---

## 8. TDAH: o que a evidência diz e o que o app faz

A pesquisa sobre técnicas de estudo em pessoas com TDAH ainda é pequena. O que existe:

- Em dois estudos, a recuperação ativa ajudou universitários com TDAH tanto quanto os demais (listas de palavras e definições) [Knouse et al., 2016, 2020]. Em um estudo com textos em prosa, o benefício não apareceu [Dudukovic et al., 2015].
- A recuperação ajuda, mas não compensa um primeiro contato fraco com o conteúdo [Minear et al., 2023].

O que o app faz com isso:

- Exemplo resolvido bom **antes** de pedir para lembrar (decisões 2 e 3).
- Itens curtos, feedback imediato, uma ação por tela, linhas de até 64 caracteres (DESIGN).
- Sessão base de 25 minutos e dia mínimo de 10 (blueprint 3.1).
- Intenção de implementação opcional no Hoje (decisão 14).

---

## 9. Concurso: Certo/Errado com calibração (Fase 9)

- A nota mais comum da Cebraspe é +1 para acerto, −1 para erro e 0 para item em branco, mas há editais sem desconto. O modo C/E mostra a nota líquida e lembra de conferir a regra no edital do seu concurso.
- Antes da resposta, a confiança: "tenho certeza", "acho que sim" ou "chute" [Butterfield & Metcalfe, 2001]. Depois de algumas sessões, o app mostra a sua calibração por assunto: em que tipo de item o chute costuma errar, e quando vale deixar em branco.
- Justificativa em todo item C/E continua obrigatória (CLAUDE.md, regra 6).

---

## 10. Fontes de conteúdo confiáveis

Para escrever lições, nesta ordem:

1. **Slides e planos de ensino da UFMS**: fonte primária (CLAUDE.md, regra 4).
2. **Documentação oficial:** [PostgreSQL](https://www.postgresql.org/docs/current/), [SQLite](https://www.sqlite.org/docs.html) (o banco do `sql.js`), [Tutorial oficial do Python em português](https://docs.python.org/pt-br/3/tutorial/), [pandas](https://pandas.pydata.org/docs/).
3. **Livros abertos de autores reconhecidos:** [OpenIntro Statistics](https://www.openintro.org/book/os/) (estatística, gratuito), [Python for Data Analysis, 3ª ed.](https://wesmckinney.com/book/) (Wes McKinney, criador do pandas, versão aberta), [Think Python, 3ª ed.](https://allendowney.github.io/ThinkPython/) (Allen Downey).
4. **Lei seca:** só o texto oficial ([planalto.gov.br](https://www.planalto.gov.br/)); nunca resumida nem inventada (CLAUDE.md, regra 5).
5. **Estilo de prova:** provas anteriores no [site do Cebraspe](https://www.cebraspe.org.br/).

---

## 11. Movimento e sensação de jogo (revisão de experiência, 11/10/2026)

O que a pesquisa diz sobre deixar o app "vivo" sem atrapalhar o estudo:

- **"Suco" na medida.** "Suco" (juiciness) é a reação visual a mais para cada ação do jogador. Em estudos controlados, deixou todos os jogos testados mais atraentes, mas só mudou a sensação de competência em situações específicas [Hicks et al., 2019]. Num experimento com quatro níveis de reação (nenhum, médio, alto e extremo), os níveis médio e alto superaram tanto o nenhum quanto o extremo em experiência, motivação e tempo de jogo [Kao, 2020].
- **Reação ligada ao acerto, não enfeite.** Num estudo posterior, a reação que dependia do sucesso do jogador aumentou a motivação; a que só amplificava tudo reduziu [Kao et al., 2024, versão aberta]. No DOMÍNIO, o movimento acompanha a resposta: o painel sobe, o ícone acende e o progresso enche.
- **Nada decorativo dentro do conteúdo.** Detalhes interessantes mas desnecessários atrapalham a aprendizagem [Rey, 2012]. Por isso, nenhuma animação de enfeite dentro da lição.
- **Progresso visível perto da meta motiva.** Quanto mais perto da meta, maior o esforço para chegar (efeito do gradiente da meta) [Kivetz et al., 2006]. É o motivo da meta da semana com os dias e do "6 de 7" bem à vista.
- **Vibração, para depois.** Vibrações curtas como reação melhoraram a experiência em jogos [Singhal & Schneider, 2021]. Fica como opção futura, desligável, só no Android (o navegador do iPhone não vibra).
- **Durações.** Seguem o guia de transições do Next.js: saída rápida (150 ms), entrada mais suave (210 ms) e deslocamento curto (até 400 ms). O detalhe está no DESIGN, seção 5.1.

---

## Referências

Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research, 87*(3), 659–701. https://doi.org/10.3102/0034654316689306

Ahadi, A., Prior, J., Behbood, V., & Lister, R. (2015). A quantitative study of the relative difficulty for novices of writing seven different types of SQL queries. In *Proceedings of ITiCSE 2015* (pp. 201–206). ACM. https://doi.org/10.1145/2729094.2742620

Atkinson, R. K., Derry, S. J., Renkl, A., & Wortham, D. (2000). Learning from examples: Instructional principles from the worked examples research. *Review of Educational Research, 70*(2), 181–214. https://doi.org/10.3102/00346543070002181

Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. *Proceedings of the National Academy of Sciences, 122*(26), e2422633122. https://doi.org/10.1073/pnas.2422633122

Becker, B. A., Denny, P., Pettit, R., Bouchard, D., Bouvier, D. J., Harrington, B., Kamil, A., Karkare, A., McDonald, C., Osera, P.-M., Pearce, J. L., & Prather, J. (2019). Compiler error messages considered unhelpful: The landscape of text-based programming error message research. In *Proceedings of the Working Group Reports on ITiCSE* (pp. 177–210). ACM. https://doi.org/10.1145/3344429.3372508

Beker, K., Kim, J., Van Boekel, M., van den Broek, P., & Kendeou, P. (2019). Refutation texts enhance spontaneous transfer of knowledge. *Contemporary Educational Psychology, 56*, 67–78. https://doi.org/10.1016/j.cedpsych.2018.11.004

Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. *Educational Psychology Review, 30*, 703–725. https://doi.org/10.1007/s10648-018-9434-x

Bloom, B. S. (1984). The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring. *Educational Researcher, 13*(6), 4–16. https://doi.org/10.3102/0013189X013006004

Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. *Psychological Bulletin, 145*(11), 1029–1052. https://doi.org/10.1037/bul0000209

Butterfield, B., & Metcalfe, J. (2001). Errors committed with high confidence are hypercorrected. *Journal of Experimental Psychology: Learning, Memory, and Cognition, 27*(6), 1491–1494. https://doi.org/10.1037/0278-7393.27.6.1491

Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin, 132*(3), 354–380. https://doi.org/10.1037/0033-2909.132.3.354

Corbett, A. T., & Anderson, J. R. (1995). Knowledge tracing: Modeling the acquisition of procedural knowledge. *User Modeling and User-Adapted Interaction, 4*(4), 253–278. https://doi.org/10.1007/BF01099821

Dudukovic, N. M., Gottshall, J. L., Cavanaugh, M. M., et al. (2015). Diminished testing benefits in young adults with attention-deficit hyperactivity disorder. *Memory, 23*(8), 1264–1276. https://doi.org/10.1080/09658211.2014.977921

Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology. *Psychological Science in the Public Interest, 14*(1), 4–58. https://doi.org/10.1177/1529100612453266

Ericson, B. J., Margulieux, L. E., & Rick, J. (2017). Solving Parsons problems versus fixing and writing code. In *Proceedings of the 17th Koli Calling International Conference on Computing Education Research* (pp. 20–29). ACM. https://doi.org/10.1145/3141880.3141895

Ericson, B. J., Denny, P., Prather, J., et al. (2022). Parsons problems and beyond: Systematic literature review and empirical study designs. In *Proceedings of the 2022 Working Group Reports on ITiCSE* (pp. 191–234). ACM. https://doi.org/10.1145/3571785.3574127

Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. *Advances in Experimental Social Psychology, 38*, 69–119. https://doi.org/10.1016/S0065-2601(06)38002-1

Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112. https://doi.org/10.3102/003465430298487

Hicks, K., Gerling, K., Dickinson, P., & Vanden Abeele, V. (2019). Juicy game design: Understanding the impact of visual embellishments on player experience. In *Proceedings of the Annual Symposium on Computer-Human Interaction in Play (CHI PLAY '19)* (pp. 185–197). ACM. https://doi.org/10.1145/3311350.3347171

Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist, 38*(1), 23–31. https://doi.org/10.1207/S15326985EP3801_4

Kao, D. (2020). The effects of juiciness in an action RPG. *Entertainment Computing, 34*, 100359. https://doi.org/10.1016/j.entcom.2020.100359

Kao, D., Ballou, N., Breitsohl, J., Gerling, K., & Deterding, S. (2024). *How does juicy game feedback motivate? Testing curiosity, competence, and effectance* [versão aberta]. PsyArXiv. https://doi.org/10.31234/osf.io/f83dp

Kestin, G., Miller, K., Klales, A., Milbourne, T., & Ponti, G. (2025). AI tutoring outperforms in-class active learning: An RCT introducing a novel research-based design in an authentic educational setting. *Scientific Reports, 15*, 17458. https://doi.org/10.1038/s41598-025-97652-6

Knouse, L. E., Rawson, K. A., Vaughn, K. E., & Dunlosky, J. (2016). Does testing improve learning for college students with attention-deficit/hyperactivity disorder? *Clinical Psychological Science, 4*(1), 136–143. https://doi.org/10.1177/2167702614565175

Knouse, L. E., Rawson, K. A., & Dunlosky, J. (2020). How much do college students with ADHD benefit from retrieval practice when learning key-term definitions? *Learning and Instruction, 68*, 101330. https://doi.org/10.1016/j.learninstruc.2020.101330

Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The goal-gradient hypothesis resurrected: Purchase acceleration, illusionary goal progress, and customer retention. *Journal of Marketing Research, 43*(1), 39–58. https://doi.org/10.1509/jmkr.43.1.39

Kulik, C.-L. C., Kulik, J. A., & Bangert-Drowns, R. L. (1990). Effectiveness of mastery learning programs: A meta-analysis. *Review of Educational Research, 60*(2), 265–299. https://doi.org/10.3102/00346543060002265

Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology, 40*(6), 998–1009. https://doi.org/10.1002/ejsp.674

Margulieux, L. E., Guzdial, M., & Catrambone, R. (2012). Subgoal-labeled instructional material improves performance and transfer in learning to develop mobile applications. In *Proceedings of the Ninth Annual International Conference on International Computing Education Research* (pp. 71–78). ACM. https://doi.org/10.1145/2361276.2361291

Mayer, R. E. (2021). Cognitive theory of multimedia learning. In R. E. Mayer & L. Fiorella (Eds.), *The Cambridge handbook of multimedia learning* (3rd ed.). Cambridge University Press. https://doi.org/10.1017/9781108894333.008

Miedema, D., Aivaloglou, E., & Fletcher, G. (2021). Identifying SQL misconceptions of novices: Findings from a think-aloud study. In *Proceedings of the 17th ACM Conference on International Computing Education Research* (pp. 355–367). ACM. https://doi.org/10.1145/3446871.3469759

Minear, M., Coane, J. H., Cooney, S., Boland, S., & Serrano, A. (2023). Is practice good enough? Retrieval benefits students with ADHD but does not compensate for poor encoding in unmedicated students. *Frontiers in Psychology, 14*, 1186566. https://doi.org/10.3389/fpsyg.2023.1186566

Qian, Y., & Lehman, J. (2017). Students' misconceptions and other difficulties in introductory programming: A literature review. *ACM Transactions on Computing Education, 18*(1), 1–24. https://doi.org/10.1145/3077618

Rey, G. D. (2012). A review of research and a meta-analysis of the seductive detail effect. *Educational Research Review, 7*(3), 216–237. https://doi.org/10.1016/j.edurev.2012.05.003

Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x

Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. *Educational Psychology Review, 32*(1), 77–112. https://doi.org/10.1007/s10648-019-09498-w

Sentance, S., Waite, J., & Kallia, M. (2019). Teaching computer programming with PRIMM: A sociocultural perspective. *Computer Science Education, 29*(2–3), 136–176. https://doi.org/10.1080/08993408.2019.1608781

Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research, 78*(1), 153–189. https://doi.org/10.3102/0034654307313795

Singhal, T., & Schneider, O. (2021). Juicy haptic design: Vibrotactile embellishments can improve player experience in games. In *Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems* (pp. 1–11). ACM. https://doi.org/10.1145/3411764.3445463

Sinha, T., & Kapur, M. (2021). When problem solving followed by instruction works: Evidence for productive failure. *Review of Educational Research, 91*(5), 761–798. https://doi.org/10.3102/00346543211019105

St. Hilaire, K. J., Chan, J. C. K., & Ahn, D. (2024). Guessing as a learning intervention: A meta-analytic review of the prequestion effect. *Psychonomic Bulletin & Review, 31*(2), 411–441. https://doi.org/10.3758/s13423-023-02353-8

Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. *Educational Psychology Review, 31*, 261–292. https://doi.org/10.1007/s10648-019-09465-5

Taipalus, T., Siponen, M., & Vartiainen, T. (2018). Errors and complications in SQL query formulation. *ACM Transactions on Computing Education, 18*(3), Article 15. https://doi.org/10.1145/3231712

Wisniewski, B., Zierer, K., & Hattie, J. (2020). The power of feedback revisited: A meta-analysis of educational feedback research. *Frontiers in Psychology, 10*, 3087. https://doi.org/10.3389/fpsyg.2019.03087

Ye, J., Su, J., & Cao, Y. (2022). A stochastic shortest path algorithm for optimizing spaced repetition scheduling. In *Proceedings of the 28th ACM SIGKDD Conference on Knowledge Discovery and Data Mining* (pp. 4381–4390). ACM. https://doi.org/10.1145/3534678.3539081

Documentação técnica consultada: guia "View transitions" do Next.js 16.4 (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`) · [SQLite: Quirks](https://www.sqlite.org/quirks.html) · [SQLite: expressões](https://www.sqlite.org/lang_expr.html) · [SQLite: tabelas STRICT](https://www.sqlite.org/stricttables.html) · [PGlite](https://pglite.dev/) · [FSRS: o algoritmo](https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm).
