@echo off
REM Hearthstead v0.1 - start a local Python web server on Windows.
REM Run this file from its folder and open http://localhost:8000/.
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
    py -m http.server 8000
) else (
    python -m http.server 8000
)
pause
