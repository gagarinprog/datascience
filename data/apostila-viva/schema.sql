-- Esquema da Apostila Viva (SQLite). Usado nas lições de SQL, pandas e estatística.
-- correta: 1 = acertou, 0 = errou. SQLite não tem tipo booleano.
-- Datas em texto no formato ISO (AAAA-MM-DD HH:MM:SS).

CREATE TABLE usuarios (
  id        INTEGER PRIMARY KEY,
  nome      TEXT NOT NULL,
  email     TEXT UNIQUE,
  criado_em TEXT NOT NULL
);

CREATE TABLE disciplinas (
  id    INTEGER PRIMARY KEY,
  nome  TEXT NOT NULL UNIQUE,
  banca TEXT
);

CREATE TABLE questoes (
  id            INTEGER PRIMARY KEY,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas (id),
  enunciado     TEXT NOT NULL,
  gabarito      TEXT NOT NULL,
  dificuldade   TEXT NOT NULL CHECK (dificuldade IN ('facil', 'media', 'dificil'))
);

CREATE TABLE respostas (
  id            INTEGER PRIMARY KEY,
  usuario_id    INTEGER NOT NULL REFERENCES usuarios (id),
  questao_id    INTEGER NOT NULL REFERENCES questoes (id),
  resposta      TEXT,
  correta       INTEGER NOT NULL CHECK (correta IN (0, 1)),
  respondida_em TEXT NOT NULL
);
