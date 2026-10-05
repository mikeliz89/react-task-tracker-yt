@echo off
setlocal

REM Run from the repository root where this script is located.
cd /d "%~dp0"
if errorlevel 1 exit /b 1

where node >nul 2>nul
if errorlevel 1 (
    echo node-komentoa ei loytynyt. Asenna Node.js ja yrita uudelleen.
    exit /b 1
)

if not exist ".\safe\backup.json" (
    echo Varmuuskopiota safe\backup.json ei loytynyt.
    exit /b 1
)

if not exist ".\safe\email-to-uid.json" (
    echo UID-karttaa safe\email-to-uid.json ei loytynyt.
    exit /b 1
)

if exist ".\safe\owner-overrides.json" (
    node ".\scripts\migrate-user-data.js" ".\safe\backup.json" ".\safe\email-to-uid.json" ".\safe\users.json" ".\safe\unresolved.json" ".\safe\owner-overrides.json"
) else (
    node ".\scripts\migrate-user-data.js" ".\safe\backup.json" ".\safe\email-to-uid.json" ".\safe\users.json" ".\safe\unresolved.json"
)
set "EXITCODE=%ERRORLEVEL%"

echo.
echo Tulokset: safe\users.json ja safe\unresolved.json
echo Firebase-tietokantaa ei muutettu.
if not "%EXITCODE%"=="0" echo Migraatio paattyi virhekoodilla %EXITCODE%.

if /I "%~1"=="--no-pause" exit /b %EXITCODE%
echo Paina mita tahansa nappainta sulkeaksesi ikkunan.
pause >nul
exit /b %EXITCODE%
