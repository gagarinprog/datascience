import { KeyRound, Link2 } from "lucide-react";

type Coluna = { nome: string; chave?: true; ligaCom?: string };

/** O schema da Apostila Viva (CLAUDE.md, regra 3): toda consulta de exercício usa estas tabelas. */
export const TABELAS_DA_APOSTILA: { nome: string; colunas: Coluna[] }[] = [
  {
    nome: "usuarios",
    colunas: [
      { nome: "id", chave: true },
      { nome: "nome" },
      { nome: "email" },
      { nome: "criado_em" },
    ],
  },
  {
    nome: "disciplinas",
    colunas: [{ nome: "id", chave: true }, { nome: "nome" }, { nome: "banca" }],
  },
  {
    nome: "questoes",
    colunas: [
      { nome: "id", chave: true },
      { nome: "disciplina_id", ligaCom: "disciplinas" },
      { nome: "enunciado" },
      { nome: "gabarito" },
      { nome: "dificuldade" },
    ],
  },
  {
    nome: "respostas",
    colunas: [
      { nome: "id", chave: true },
      { nome: "usuario_id", ligaCom: "usuarios" },
      { nome: "questao_id", ligaCom: "questoes" },
      { nome: "resposta" },
      { nome: "correta" },
      { nome: "respondida_em" },
    ],
  },
];

/**
 * As quatro tabelas em cartões compactos: colunas lado a lado, chave e ligações
 * escritas por extenso embaixo (o ícone e a cor não informam sozinhos).
 */
export function TabelasApostila() {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {TABELAS_DA_APOSTILA.map((tabela) => {
        const chave = tabela.colunas.find((coluna) => coluna.chave);
        const ligacoes = tabela.colunas.filter((coluna) => coluna.ligaCom);

        return (
          <li key={tabela.nome} className="rounded-cartao bg-placa p-4">
            <h2 className="font-mono text-codigo text-texto">{tabela.nome}</h2>
            <ul aria-label={`Colunas de ${tabela.nome}`} className="mt-2 flex flex-wrap gap-1.5">
              {tabela.colunas.map((coluna) => (
                <li key={coluna.nome}>
                  <code className="inline-flex items-center gap-1 rounded-chip border border-trilha-apagada px-2 py-0.5 font-mono text-secundario text-texto">
                    {coluna.chave && <KeyRound aria-hidden className="size-3.5 text-texto-2" />}
                    {coluna.ligaCom && <Link2 aria-hidden className="size-3.5 text-texto-2" />}
                    {coluna.nome}
                  </code>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-secundario text-texto-2">
              Chave: {chave?.nome}
              {ligacoes.map((coluna) => (
                <span key={coluna.nome}>
                  {" · "}
                  {coluna.nome} liga com {coluna.ligaCom}
                </span>
              ))}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
