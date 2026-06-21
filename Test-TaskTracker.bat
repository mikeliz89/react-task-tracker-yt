@echo off
setlocal

if not defined TEST_TASKTRACKER_INTERNAL (
    start "" cmd /k "set TEST_TASKTRACKER_INTERNAL=1 && call ""%~f0"" %*"
    exit /b
)

REM Run from the repository root where this script is located.
cd /d "%~dp0"

set "TEST_ARGS=%*"
REM Backward compatibility: ignore old internal flag if user passes it manually.
if /I "%~1"=="--run" set "TEST_ARGS=%~2 %~3 %~4 %~5 %~6 %~7 %~8 %~9"

where npm >nul 2>nul
if errorlevel 1 (
    echo npm-komentoa ei loytynyt. Asenna Node.js, joka sisaltaa npm:n, ja yrita uudelleen.
    pause
    exit /b 1
)

echo Ajetaan testit: npm run test -- --watchAll=false %TEST_ARGS%
set "CI=true"
set "NODE_OPTIONS=--openssl-legacy-provider"
npm run test -- --watchAll=false %TEST_ARGS%
set EXITCODE=%ERRORLEVEL%

echo.
if "%EXITCODE%"=="0" (
    echo Testit paattyivat onnistuneesti.
) else (
    echo Testit paattyivat virhekoodilla %EXITCODE%.
)
echo Paina mita tahansa nappainta sulkeaksesi ikkunan.
pause >nul

exit /b %EXITCODE%
