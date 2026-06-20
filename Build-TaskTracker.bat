@echo off
setlocal

REM Run from the repository root where this script is located.
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo npm-komentoa ei loytynyt. Asenna Node.js, joka sisaltaa npm:n, ja yrita uudelleen.
    pause
    exit /b 1
)

echo Kaynnistetaan build komennolla: set NODE_OPTIONS=--openssl-legacy-provider ^&^& npm run build
set NODE_OPTIONS=--openssl-legacy-provider && npm run build
set EXITCODE=%ERRORLEVEL%

if not "%EXITCODE%"=="0" (
    echo.
    echo Build paattyi virhekoodilla %EXITCODE%.
    pause
)

exit /b %EXITCODE%
