import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BarraProgressoSegmentada } from "@/components/ui/barra-progresso-segmentada";
import { BotaoTatil } from "@/components/ui/botao-tatil";
import { Chip } from "@/components/ui/chip";
import {
  ChipConceito,
  ESTADOS_CONCEITO,
  NOME_ESTADO,
  type EstadoConceito,
} from "@/components/ui/chip-conceito";
import { Painel } from "@/components/ui/painel";
import { PainelFeedback } from "@/components/ui/painel-feedback";
import { lerTokensDeCor, type TokenDeCor } from "@/lib/design/tokens";
import { DISCIPLINAS, NOME_DISCIPLINA, type Disciplina } from "@/lib/disciplinas";
import { cn } from "@/lib/utils";

import { DemoFeedback, DemoSeletorDisciplina } from "./demos";

export const metadata: Metadata = {
  title: "Sistema de design",
};

const USO_DO_TOKEN: Record<string, string> = {
  "--fundo": "Fundo do app",
  "--placa": "Superfície 1: painéis, cartão de lição",
  "--placa-alta": "Superfície 2: elevados, feedback",
  "--trilha-apagada": "Trilhas e bordas inativas",
  "--texto": "Texto principal",
  "--texto-2": "Texto secundário, legendas",
  "--corrente": "Ação principal e foco",
  "--sobre-corrente": "Texto sobre o botão ciano",
  "--acerto": "Resposta certa",
  "--erro": "Resposta errada",
  "--aviso": "AP chegando, sequência em risco",
  "--corrente-base": "Base do botão primário",
  "--erro-base": "Base do botão de perigo",
};

const PAPEIS_DE_TEXTO = [
  {
    papel: "Número de destaque",
    medida: "40 / 48 px · 700",
    classe: "text-destaque",
    exemplo: "12 dias",
  },
  {
    papel: "Título de tela",
    medida: "26 / 32 px · 700",
    classe: "text-titulo",
    exemplo: "Missão de hoje",
  },
  {
    papel: "Título de cartão",
    medida: "20 / 22 px · 600",
    classe: "text-titulo-cartao",
    exemplo: "SQL · GROUP BY e HAVING",
  },
  {
    papel: "Corpo da lição",
    medida: "17 / 18 px · 400",
    classe: "text-corpo",
    exemplo:
      "Quantas questões cada disciplina tem? Agrupe as linhas pela disciplina e conte cada grupo.",
  },
  {
    papel: "Secundário",
    medida: "14 / 15 px · 400",
    classe: "text-secundario",
    exemplo: "25 min · 12 revisões",
  },
] as const;

const RAIOS = [
  { nome: "Painel de tela", medida: "24 px", classe: "rounded-painel" },
  { nome: "Cartão", medida: "16 px", classe: "rounded-cartao" },
  { nome: "Botão", medida: "14 px", classe: "rounded-botao" },
  { nome: "Chip", medida: "10 px", classe: "rounded-chip" },
] as const;

const VARIANTES_DE_BOTAO = [
  { variante: "primario", nome: "Primário", rotulo: "Começar sessão" },
  { variante: "secundario", nome: "Secundário", rotulo: "Explicar meu erro" },
  { variante: "perigo", nome: "Perigo", rotulo: "Apagar progresso" },
] as const;

const ESTADOS_DE_BOTAO = [
  { nome: "Normal", pressionado: false, desabilitado: false },
  { nome: "Pressionado", pressionado: true, desabilitado: false },
  { nome: "Desabilitado", pressionado: false, desabilitado: true },
] as const;

// Critérios do blueprint, seção 4.2.
const CRITERIO_DO_ESTADO: Record<EstadoConceito, string> = {
  bloqueado: "Algum pré-requisito ainda está abaixo de praticado.",
  disponivel: "Pré-requisitos em dia: já dá para estudar.",
  apresentado: "Passou pela lição.",
  praticado: "3 acertos sem ajuda, em pelo menos 2 dias diferentes.",
  dominado: "Praticado, usado em código de verdade e com explicação aprovada.",
  retido: "Estabilidade FSRS acima de 21 dias.",
};

const CONCEITO_DE_EXEMPLO: Record<Disciplina, string> = {
  alg2: "Arquivos com with",
  bd: "JOIN",
  ed: "Pilha",
  gaal: "Produto escalar",
  poo: "Classe e objeto",
  icc: "Portas lógicas",
  est: "Média",
};

function Secao({
  id,
  titulo,
  descricao,
  children,
}: {
  id: string;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-16 first-of-type:mt-12">
      <div className="flex items-center gap-3">
        {/* Um trecho de trilha com pad: a placa de circuito, em voz baixa. */}
        <span aria-hidden className="flex items-center">
          <span className="h-0.5 w-5 bg-trilha-apagada" />
          <span className="size-2.5 rounded-full border-2 border-trilha-apagada" />
        </span>
        <h2 id={id} className="text-titulo-cartao">
          {titulo}
        </h2>
      </div>
      {descricao && <p className="mt-2 max-w-[64ch] text-texto-2">{descricao}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Subtitulo({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-3 font-semibold first:mt-0">{children}</h3>;
}

function Amostra({ token, uso }: { token: TokenDeCor; uso: string }) {
  const derivada = token.valor.startsWith("color-mix");

  return (
    <li className="flex items-center gap-3 rounded-cartao bg-placa p-3">
      <span
        aria-hidden
        className="size-12 shrink-0 rounded-chip border border-trilha-apagada"
        style={{ backgroundColor: `var(${token.variavel})` }}
      />
      <div className="min-w-0">
        <p>
          <code className="font-mono">{token.nome}</code>
        </p>
        <p className="text-secundario text-texto-2">
          {derivada ? "derivada" : token.valor} · {uso}
        </p>
      </div>
    </li>
  );
}

export default function PaginaDesign() {
  const tokens = lerTokensDeCor();
  const tokensBase = tokens.filter((token) => !token.nome.startsWith("--sinal-"));
  const tokensSinal = tokens.filter((token) => token.nome.startsWith("--sinal-"));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-10 pb-24 sm:px-6 lg:px-10 lg:pt-14">
      <header className="max-w-[64ch]">
        <p className="text-secundario text-texto-2">Domínio · Fase 0</p>
        <h1 className="mt-2 text-titulo">Sistema de design</h1>
        <p className="mt-3 text-texto-2">
          Uma placa de circuito que acende conforme você aprende. Aqui ficam os tokens e os
          componentes base; toda tela nova sai daqui.
        </p>
      </header>

      <Secao
        id="cores"
        titulo="Cores"
        descricao="Fundo azul-noite, superfícies em camadas e o ciano só para ação e foco. A cor de cada disciplina aparece apenas em trilhas, chips de conceito e barras de progresso."
      >
        <Subtitulo>Base</Subtitulo>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tokensBase.map((token) => (
            <Amostra key={token.nome} token={token} uso={USO_DO_TOKEN[token.nome] ?? ""} />
          ))}
        </ul>

        <Subtitulo>Sinal por disciplina</Subtitulo>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tokensSinal.map((token) => {
            const disciplina = token.nome.replace("--sinal-", "") as Disciplina;
            return (
              <Amostra key={token.nome} token={token} uso={NOME_DISCIPLINA[disciplina] ?? ""} />
            );
          })}
        </ul>
      </Secao>

      <Secao
        id="tipografia"
        titulo="Tipografia"
        descricao="Sora na interface, nos títulos e nos números. JetBrains Mono só no código."
      >
        <ul className="divide-y divide-trilha-apagada rounded-cartao bg-placa px-5">
          {PAPEIS_DE_TEXTO.map((item) => (
            <li key={item.papel} className="py-5">
              <p className="text-secundario text-texto-2">
                {item.papel} · {item.medida}
              </p>
              <p className={cn("mt-2 max-w-[64ch]", item.classe)}>{item.exemplo}</p>
            </li>
          ))}
          <li className="py-5">
            <p className="text-secundario text-texto-2">Código · 15 / 15 px · 400</p>
            <pre className="mt-2 overflow-x-auto font-mono">
              <code>
                {
                  "SELECT disciplina_id,\n       COUNT(*) AS total\nFROM questoes\nGROUP BY disciplina_id;"
                }
              </code>
            </pre>
          </li>
        </ul>
      </Secao>

      <Secao
        id="forma"
        titulo="Forma"
        descricao="Raio por hierarquia. A profundidade vem das superfícies, não de sombras."
      >
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {RAIOS.map((raio) => (
            <li key={raio.nome}>
              <div className={cn("h-20 border border-trilha-apagada bg-placa", raio.classe)} />
              <p className="mt-2 font-semibold">{raio.nome}</p>
              <p className="text-secundario text-texto-2">{raio.medida}</p>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao
        id="botao-tatil"
        titulo="Botão tátil"
        descricao="Base de 4 px mais escura embaixo. Ao pressionar, o botão desce 4 px e a base some."
      >
        <div className="space-y-8">
          {VARIANTES_DE_BOTAO.map((variante) => (
            <div key={variante.variante}>
              <Subtitulo>{variante.nome}</Subtitulo>
              <div className="grid gap-5 sm:grid-cols-3">
                {ESTADOS_DE_BOTAO.map((estado) => (
                  <figure key={estado.nome} className="flex flex-col gap-2">
                    <BotaoTatil
                      variante={variante.variante}
                      largura="total"
                      pressionado={estado.pressionado}
                      disabled={estado.desabilitado}
                    >
                      {variante.rotulo}
                    </BotaoTatil>
                    <figcaption className="text-secundario text-texto-2">{estado.nome}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Secao>

      <Secao
        id="chip"
        titulo="Chip"
        descricao="A borda, o texto e o pad levam a cor da disciplina. O fundo fica transparente para o texto manter contraste."
      >
        <Subtitulo>Por disciplina</Subtitulo>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINAS.map((disciplina) => (
            <Chip key={disciplina} disciplina={disciplina}>
              {NOME_DISCIPLINA[disciplina]}
            </Chip>
          ))}
          <Chip>Sem disciplina</Chip>
        </div>

        <Subtitulo>Seletor</Subtitulo>
        <p className="mb-3 max-w-[64ch] text-secundario text-texto-2">
          Toque para escolher. O escolhido acende e o pad fica cheio.
        </p>
        <DemoSeletorDisciplina />
      </Secao>

      <Secao
        id="painel"
        titulo="Painel"
        descricao="As duas superfícies, em cartão e em painel de tela."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Painel>
            <p className="text-titulo-cartao">Placa</p>
            <p className="mt-1 text-texto-2">
              Superfície 1: painéis e cartão de lição. Raio de 16 px.
            </p>
          </Painel>
          <Painel nivel="alta">
            <p className="text-titulo-cartao">Placa alta</p>
            <p className="mt-1 text-texto-2">Superfície 2: elementos elevados. Raio de 16 px.</p>
          </Painel>
          <Painel raio="painel">
            <p className="text-titulo-cartao">Painel de tela</p>
            <p className="mt-1 text-texto-2">Ocupa a tela, com raio de 24 px.</p>
          </Painel>
        </div>
      </Secao>

      <Secao
        id="barra-de-progresso"
        titulo="Barra de progresso segmentada"
        descricao="Um segmento por passo. A cor é a da disciplina da lição; sem disciplina, é a corrente."
      >
        <ul className="grid max-w-xl gap-6">
          <li>
            <p className="mb-2 text-secundario text-texto-2">Lição de Banco de Dados · 3 de 7</p>
            <BarraProgressoSegmentada
              total={7}
              concluidos={3}
              disciplina="bd"
              rotulo="Lição de Banco de Dados"
            />
          </li>
          <li>
            <p className="mb-2 text-secundario text-texto-2">Lição de Algoritmos II · 5 de 7</p>
            <BarraProgressoSegmentada
              total={7}
              concluidos={5}
              disciplina="alg2"
              rotulo="Lição de Algoritmos II"
            />
          </li>
          <li>
            <p className="mb-2 text-secundario text-texto-2">Meta da semana · 6 de 7 dias</p>
            <BarraProgressoSegmentada total={7} concluidos={6} rotulo="Meta da semana" />
          </li>
        </ul>
      </Secao>

      <Secao
        id="painel-de-feedback"
        titulo="Painel de feedback"
        descricao="Sobe de baixo depois de Verificar. Verde ou vermelho, sempre com ícone e texto."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <figure>
            <div className="overflow-hidden rounded-cartao border border-trilha-apagada bg-fundo pt-12">
              <PainelFeedback resultado="certo" animarEntrada={false}>
                <code className="font-mono">GROUP BY</code> juntou as questões por disciplina e{" "}
                <code className="font-mono">COUNT(*)</code> contou cada grupo.
              </PainelFeedback>
            </div>
            <figcaption className="mt-2 text-secundario text-texto-2">
              Certo: a frase curta do porquê e Continuar.
            </figcaption>
          </figure>
          <figure>
            <div className="overflow-hidden rounded-cartao border border-trilha-apagada bg-fundo pt-12">
              <PainelFeedback resultado="errado" animarEntrada={false}>
                Você filtrou o grupo com <code className="font-mono">WHERE</code>. Filtro depois de
                agrupar vai no <code className="font-mono">HAVING</code>.
              </PainelFeedback>
            </div>
            <figcaption className="mt-2 text-secundario text-texto-2">
              Errado: o erro exato, Tentar de novo e Explicar meu erro.
            </figcaption>
          </figure>
        </div>

        <Subtitulo>Movimento</Subtitulo>
        <p className="mb-3 max-w-[64ch] text-secundario text-texto-2">
          O painel sobe em 200 ms. Com a opção de reduzir movimento ligada no sistema, ele aparece
          direto.
        </p>
        <DemoFeedback />
      </Secao>

      <Secao
        id="chip-de-conceito"
        titulo="Chip de conceito"
        descricao="O nó da Trilha de Circuito. O marcador muda de forma a cada estado, então a cor nunca informa sozinha."
      >
        <ul className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
          {ESTADOS_CONCEITO.map((estado) => (
            <li key={estado} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <ChipConceito
                nome="GROUP BY"
                estado={estado}
                disciplina="bd"
                className="w-44 shrink-0"
              />
              <div>
                <p className="font-semibold">{NOME_ESTADO[estado]}</p>
                <p className="text-secundario text-texto-2">{CRITERIO_DO_ESTADO[estado]}</p>
              </div>
            </li>
          ))}
        </ul>

        <Subtitulo>Cor por disciplina, no estado dominado</Subtitulo>
        <ul className="flex flex-wrap gap-5">
          {DISCIPLINAS.map((disciplina) => (
            <li key={disciplina}>
              <ChipConceito
                nome={CONCEITO_DE_EXEMPLO[disciplina]}
                estado="dominado"
                disciplina={disciplina}
              />
            </li>
          ))}
        </ul>
      </Secao>
    </main>
  );
}
