// @vitest-environment node
import { describe, expect, it } from "vitest";

import { dataLocalIso, diasAte, formatarDiaDeHoje, textoDiasAte } from "./datas";

describe("formatarDiaDeHoje", () => {
  it("escreve a data como no DESIGN 6.1", () => {
    expect(formatarDiaDeHoje(new Date(2026, 9, 11))).toBe("Domingo, 11 out");
  });

  it("cobre todos os dias da semana", () => {
    const semana = Array.from({ length: 7 }, (_, dia) =>
      formatarDiaDeHoje(new Date(2026, 9, 11 + dia)),
    );

    expect(semana).toEqual([
      "Domingo, 11 out",
      "Segunda, 12 out",
      "Terça, 13 out",
      "Quarta, 14 out",
      "Quinta, 15 out",
      "Sexta, 16 out",
      "Sábado, 17 out",
    ]);
  });
});

describe("dataLocalIso", () => {
  it("usa o dia local, com zeros à esquerda", () => {
    expect(dataLocalIso(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});

describe("diasAte", () => {
  it("conta dias de calendário, não horas", () => {
    expect(diasAte("2026-10-26", new Date(2026, 9, 11, 0, 1))).toBe(15);
    expect(diasAte("2026-10-26", new Date(2026, 9, 11, 23, 59))).toBe(15);
  });

  it("atravessa a virada do mês e do ano", () => {
    expect(diasAte("2026-11-02", new Date(2026, 9, 31))).toBe(2);
    expect(diasAte("2027-01-01", new Date(2026, 11, 31))).toBe(1);
  });

  it("dá negativo quando a data já passou", () => {
    expect(diasAte("2026-10-10", new Date(2026, 9, 11))).toBe(-1);
  });
});

describe("textoDiasAte", () => {
  it("fala como gente", () => {
    expect(textoDiasAte(0)).toBe("hoje");
    expect(textoDiasAte(1)).toBe("amanhã");
    expect(textoDiasAte(15)).toBe("em 15 dias");
  });
});
