import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("não descarta o tamanho do texto ao juntar com a cor do texto", () => {
    expect(cn("text-corpo text-texto")).toBe("text-corpo text-texto");
  });

  it("resolve conflitos dentro do mesmo grupo: a última classe vence", () => {
    expect(cn("text-corpo", "text-secundario")).toBe("text-secundario");
    expect(cn("bg-placa", "bg-placa-alta")).toBe("bg-placa-alta");
    expect(cn("rounded-chip", "rounded-botao")).toBe("rounded-botao");
  });

  it("ignora valores falsos", () => {
    expect(cn("p-4", false, undefined, null, "mt-2")).toBe("p-4 mt-2");
  });
});
