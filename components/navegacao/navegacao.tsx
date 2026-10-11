"use client";

import { CircuitBoard, FlaskConical, Layers, Sun, UserRound, type LucideIcon } from "lucide-react";
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
 * O item atual acende (texto, ícone e um trecho de trilha) e é anunciado
 * como página atual.
 */
export function Navegacao() {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Principal"
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
                  ativo ? "font-semibold text-corrente" : "text-texto-2 hover:text-texto",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 h-0.5 w-8 rounded-full lg:top-1/2 lg:left-0 lg:h-8 lg:w-0.5 lg:-translate-y-1/2",
                    ativo ? "bg-corrente" : "bg-transparent",
                  )}
                />
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
