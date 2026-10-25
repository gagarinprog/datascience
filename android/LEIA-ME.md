# Domínio para Android (sem internet)

App que leva o curso inteiro dentro do APK: um servidor HTTP mínimo em 127.0.0.1:8765 (`Servidor.java`) entrega os
arquivos guardados em `app/src/main/assets/www`, e um WebView abre o Início. Python (Pyodide com pandas, numpy e
matplotlib) e PostgreSQL (PGlite) vão junto, em `vendor/`. "Salvar meu trajeto" e o backup do Centro de Dados passam
pela ponte `DominioAndroid.salvar` (`android.js`, injetado em cada página) e caem na pasta Downloads.

Gerar de novo depois de mudar a apostila:

1. `python3 ferramentas/empacotar_offline.py` (baixa as bibliotecas e monta `build-offline/Dominio/app`).
2. Copie `build-offline/Dominio/app` para `android/app/src/main/assets/www`, copie `android/android.js` para lá e,
   em cada `.html`, troque `navigator.serviceWorker.register(...)` por `Promise.resolve()` e inclua
   `<script src="/android.js"></script>`.
3. Com o Android SDK (plataforma 34) e o Gradle 8.9: `gradle assembleRelease` dentro de `android/`
   (assinado com a chave de depuração; serve para instalar direto no celular).
