// Revisão espaçada com o FSRS, o algoritmo do Anki (ts-fsrs, MIT; cópia em ../vendor para abrir sem internet).
// O motor (motor.js) usa window.FSRS quando este módulo carrega; sem ele, a revisão cai nos intervalos fixos.
// Retenção desejada de 90% (doc 04, seção 6) e intervalos em dias inteiros: aqui não há revisão no mesmo dia.
import { fsrs, generatorParameters, createEmptyCard, Rating } from "../vendor/ts-fsrs-4.7.1.mjs";

const motor = fsrs(generatorParameters({ request_retention: 0.9, maximum_interval: 365, enable_fuzz: false, enable_short_term: false }));

window.FSRS = { motor, createEmptyCard, Rating };
