@echo off
title Dominio - deixe esta janela aberta enquanto estuda
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
if errorlevel 1 pause
