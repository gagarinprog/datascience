import type { DiaDaSemana } from "@/lib/datas";
import { cn } from "@/lib/utils";

/**
 * Meta da semana, de segunda a domingo: dia estudado fica cheio, hoje ganha um
 * contorno enquanto está aberto. O número também aparece em texto.
 */
export function SemanaDeEstudo({
  semana,
  className,
}: {
  semana: DiaDaSemana[];
  className?: string;
}) {
  const cumpridos = semana.filter((dia) => dia.cumprido).length;

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-label="Meta da semana"
        aria-valuemin={0}
        aria-valuemax={semana.length}
        aria-valuenow={cumpridos}
        aria-valuetext={`${cumpridos} de ${semana.length} dias`}
        className="flex gap-1.5"
      >
        {semana.map((dia) => (
          <div
            key={dia.data}
            data-cumprido={dia.cumprido}
            data-hoje={dia.hoje}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "h-2.5 w-full rounded-full",
                dia.cumprido && "bg-corrente",
                !dia.cumprido && dia.hoje && "border-[1.5px] border-corrente",
                !dia.cumprido && !dia.hoje && "bg-trilha-apagada",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "text-secundario",
                dia.hoje ? "font-semibold text-texto" : "text-texto-2",
              )}
            >
              {dia.inicial}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-secundario text-texto-2">
        Meta da semana: {cumpridos} de {semana.length} dias
      </p>
    </div>
  );
}
