import { contarSequencia, dataLocalIso, semanaDeEstudo } from "@/lib/datas";

import { criarDadosFalsos, type DadosLocais } from "./dados-falsos";
import type { Carta, Repositorio } from "./tipos";

export const CHAVE_LOCAL = "dominio:dados:v2";

/** Blueprint 3.1: o aquecimento usa de 8 a 12 cartas. */
const LIMITE_DO_AQUECIMENTO = 12;

type Armazenamento = Pick<Storage, "getItem" | "setItem">;

type OpcoesDoRepositorioLocal = {
  /** Padrão: window.localStorage. Os testes passam um armazenamento próprio. */
  armazenamento?: Armazenamento;
  relogio?: () => Date;
  gerarId?: () => string;
};

function pareceDadosLocais(valor: unknown): valor is DadosLocais {
  if (typeof valor !== "object" || valor === null) return false;
  const dados = valor as Partial<DadosLocais>;
  return (
    dados.versao === 2 &&
    Array.isArray(dados.diasEstudados) &&
    Array.isArray(dados.cartas) &&
    Array.isArray(dados.dominio) &&
    Array.isArray(dados.tentativas) &&
    Array.isArray(dados.sessoes) &&
    Array.isArray(dados.avaliacoes) &&
    typeof dados.missao === "object"
  );
}

/** Repositório que guarda tudo no navegador, até o Supabase chegar (Fase 5). */
export function criarRepositorioLocal({
  armazenamento,
  relogio = () => new Date(),
  gerarId = () => crypto.randomUUID(),
}: OpcoesDoRepositorioLocal = {}): Repositorio {
  // Se o navegador bloquear o armazenamento, o app segue com os dados na memória.
  let naMemoria: DadosLocais | null = null;
  const loja = (): Armazenamento => armazenamento ?? window.localStorage;

  function gravar(dados: DadosLocais) {
    naMemoria = dados;
    try {
      loja().setItem(CHAVE_LOCAL, JSON.stringify(dados));
    } catch {
      // Sem armazenamento disponível: os dados ficam só nesta aba.
    }
  }

  function ler(): DadosLocais {
    try {
      const bruto = loja().getItem(CHAVE_LOCAL);
      if (bruto) {
        const dados: unknown = JSON.parse(bruto);
        if (pareceDadosLocais(dados)) return dados;
      }
    } catch {
      // Dado corrompido ou armazenamento bloqueado: cai nos dados abaixo.
    }
    if (naMemoria) return naMemoria;
    const iniciais = criarDadosFalsos(relogio());
    gravar(iniciais);
    return iniciais;
  }

  function cartasVencidas(dados: DadosLocais, limite: number): Carta[] {
    const agora = relogio().getTime();
    return dados.cartas
      .map((carta) => ({
        carta,
        quando: carta.proximaRevisao ? Date.parse(carta.proximaRevisao) : NaN,
      }))
      .filter(({ quando }) => quando <= agora)
      .sort((a, b) => a.quando - b.quando)
      .slice(0, limite)
      .map(({ carta }) => carta);
  }

  return {
    async sessaoDeHoje() {
      const dados = ler();
      const agora = relogio();
      const hoje = dataLocalIso(agora);
      const semana = semanaDeEstudo(dados.diasEstudados, agora);
      const proximaAvaliacao =
        dados.avaliacoes
          .filter((avaliacao) => avaliacao.data >= hoje)
          .sort((a, b) => a.data.localeCompare(b.data))[0] ?? null;

      return {
        sequenciaDias: contarSequencia(dados.diasEstudados, agora),
        estudouHoje: dados.diasEstudados.includes(hoje),
        semana,
        metaSemana: {
          cumpridos: semana.filter((dia) => dia.cumprido).length,
          total: semana.length,
        },
        missao: {
          ...dados.missao,
          revisoes: cartasVencidas(dados, LIMITE_DO_AQUECIMENTO).length,
        },
        proximaAvaliacao,
      };
    },

    async cartasParaRevisar(limite = LIMITE_DO_AQUECIMENTO) {
      return cartasVencidas(ler(), limite);
    },

    async dominio() {
      return ler().dominio;
    },

    async registrarTentativa(tentativa) {
      const dados = ler();
      dados.tentativas.push({ ...tentativa, id: gerarId(), feitaEm: relogio().toISOString() });
      gravar(dados);
    },

    async registrarSessao(sessao) {
      const dados = ler();
      dados.sessoes.push({ ...sessao, id: gerarId() });
      // Sessão concluída conta o dia na sequência e na meta da semana.
      if (sessao.fim) {
        const dia = dataLocalIso(new Date(sessao.inicio));
        if (!dados.diasEstudados.includes(dia)) dados.diasEstudados.push(dia);
      }
      gravar(dados);
    },
  };
}
