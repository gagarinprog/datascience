import { criarRepositorioLocal } from "./local";
import type { Repositorio } from "./tipos";

export type * from "./tipos";

let repositorio: Repositorio | null = null;

/**
 * O repositório que as telas usam. Só no navegador (lê o localStorage).
 * Na Fase 5, uma variável de ambiente escolhe entre o local e o Supabase.
 */
export function obterRepositorio(): Repositorio {
  repositorio ??= criarRepositorioLocal();
  return repositorio;
}
