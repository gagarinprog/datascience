import { CLASSE_SINAL, type Disciplina } from "@/lib/disciplinas";
import { cn } from "@/lib/utils";

type BarraProgressoSegmentadaProps = {
  total: number;
  concluidos: number;
  /** Nome acessível, ex.: "Progresso da lição". */
  rotulo: string;
  /** Cor dos segmentos cheios. Sem disciplina, usa --corrente. */
  disciplina?: Disciplina;
  className?: string;
};

export function BarraProgressoSegmentada({
  total,
  concluidos,
  rotulo,
  disciplina,
  className,
}: BarraProgressoSegmentadaProps) {
  const segmentos = Math.max(1, Math.floor(total));
  const cheios = Math.min(Math.max(0, Math.floor(concluidos)), segmentos);

  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={segmentos}
      aria-valuenow={cheios}
      aria-valuetext={`${cheios} de ${segmentos}`}
      className={cn(
        "flex w-full gap-1.5",
        disciplina ? CLASSE_SINAL[disciplina] : "sinal-corrente",
        className,
      )}
    >
      {Array.from({ length: segmentos }, (_, indice) => (
        <span
          key={indice}
          data-cheio={indice < cheios}
          className={cn(
            "h-2.5 flex-1 rounded-full",
            indice < cheios ? "bg-(--sinal)" : "bg-trilha-apagada",
          )}
        />
      ))}
    </div>
  );
}
