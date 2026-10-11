"use client";

import { CircuitBoard, FlaskConical, Layers, Sun, UserRound, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type Destino = {
  href: string;
  rotulo: string;
  /** Rótulo visível na barra do celular, quando o nome inteiro não cabe. */
  rotuloCurto?: string;
  Icone: LucideIcon;
};

export const DESTINOS: Destino[] = [
  { href: "/", rotulo: "Hoje", Icone: Sun },
  { href: "/trilha", rotulo: "Trilha", Icone: CircuitBoard },
  { href: "/revisar", rotulo: "Revisar", Icone: Layers },
  { href: "/laboratorio", rotulo: "Laboratório", rotuloCurto: "Lab", Icone: FlaskConical },
  { href: "/perfil", rotulo: "Eu", Icone: UserRound },
];

export function destinoAtivo(caminho: string, href: string): boolean {
  if (href === "/") return caminho === "/";
  return caminho === href || caminho.startsWith(`${href}/`);
}

/**
 * Barra inferior no celular; trilho lateral a partir de 1024 px.
 * O item atual acende (texto, ícone e um trecho de trilha que desliza até ele)
 * e é anunciado como página atual. A navegação não participa das transições
 * de tela: fica parada como âncora.
 */
export function Navegacao() {
  const caminho = usePathname();
  const reduzirMovimento = useReducedMotion();

  return (
    <nav
      aria-label="Principal"
      style={{ viewTransitionName: "navegacao" }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-trilha-apagada bg-placa pb-[env(safe-area-inset-bottom)] lg:inset-y-0 lg:right-auto lg:w-28 lg:border-t-0 lg:border-r lg:pb-0"
    >
      <ul className="mx-auto flex max-w-xl lg:max-w-none lg:flex-col lg:gap-1 lg:pt-6">
        {DESTINOS.map(({ href, rotulo, rotuloCurto, Icone }) => {
          const ativo = destinoAtivo(caminho, href);
          return (
            <li key={href} className="flex-1 lg:flex-none">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative flex min-h-16 flex-col items-center justify-center gap-1 text-secundario",
                  "transition-[color,scale] duration-100 ease-out active:scale-95 motion-reduce:transition-none",
                  ativo ? "font-semibold text-corrente" : "text-texto-2 hover:text-texto",
                )}
              >
                {ativo && (
                  <motion.span
                    aria-hidden
                    layoutId="indicador-da-aba"
                    transition={
                      reduzirMovimento
                        ? { duration: 0 }
                        : { type: "tween", duration: 0.25, ease: [0.2, 0, 0, 1] }
                    }
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-corrente lg:top-1/2 lg:left-0 lg:h-8 lg:w-0.5 lg:-translate-y-1/2"
                  />
                )}
                <Icone aria-hidden className="size-6" />
                {rotuloCurto ? (
                  <>
                    <span aria-hidden className="lg:hidden">
                      {rotuloCurto}
                    </span>
                    <span className="max-lg:sr-only">{rotulo}</span>
                  </>
                ) : (
                  <span>{rotulo}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
