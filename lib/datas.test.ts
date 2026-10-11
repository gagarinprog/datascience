// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  contarSequencia,
  dataLocalIso,
  diasAte,
  formatarDiaDeHoje,
  semanaDeEstudo,
  textoDiasAte,
} from "./datas";

describe("contarSequencia", () => {
  const DOMINGO = new Date(2026, 9, 11, 22, 0);

  it("conta até ontem enquanto hoje ainda está aberto", () => {
    expect(contarSequencia(["2026-10-09", "2026-10-10"], DOMINGO)).toBe(2);
  });

  it("inclui hoje quando hoje já teve estudo", () => {
    expect(contarSequencia(["2026-10-09", "2026-10-10", "2026-10-11"], DOMINGO)).toBe(3);
  });

  it("um dia inteiro em branco zera a contagem", () => {
    expect(contarSequencia(["2026-10-08", "2026-10-09"], DOMINGO)).toBe(0);
  });

  it("atravessa a virada do mês", () => {
    expect(contarSequencia(["2026-09-30", "2026-10-01"], new Date(2026, 9, 2))).toBe(2);
  });
});

describe("semanaDeEstudo", () => {
  it("vai de segunda a domingo e marca hoje", () => {
    const semana = semanaDeEstudo(["2026-10-05", "2026-10-07"], new Date(2026, 9, 7, 9, 0));

    expect(semana.map((dia) => dia.data)).toEqual([
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
    ]);
    expect(semana.map((dia) => dia.inicial).join("")).toBe("STQQSSD");
    expect(semana.map((dia) => dia.cumprido)).toEqual([
      true,
      false,
      true,
      false,
      false,
      false,
      false,
    ]);
    expect(semana.filter((dia) => dia.hoje).map((dia) => dia.data)).toEqual(["2026-10-07"]);
  });

  it("no domingo, a semana ainda é a que começou na segunda anterior", () => {
    expect(semanaDeEstudo([], new Date(2026, 9, 11))[0]?.data).toBe("2026-10-05");
  });
});

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
