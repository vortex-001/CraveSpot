@echo off
setlocal
cd /d "%~dp0"

echo =====================================================================
echo          CraveSpot - Chrome Live Automated Testing Launcher
echo =====================================================================
echo.
echo [*] Starting Frontend Server (Port 5500)...
start "CraveSpot Frontend" cmd /c "python -m http.server 5500 --directory frontend"

echo [*] Starting Backend Server (Port 5000)...
start "CraveSpot Backend" cmd /c "python backend\app.py"

timeout /t 2 /nobreak >nul

echo [*] Launching Chrome with Remote Debugging enabled (Port 9222)...
set "CHROME="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
)

if "%CHROME%"=="" (
    echo [ERROR] Google Chrome not found at standard paths.
    pause
    exit /b 1
)

start "" "%CHROME%" --remote-debugging-port=9222 "http://127.0.0.1:5500/index.html"

echo.
echo =====================================================================
echo Chrome is now running on your screen with Remote Debugging (Port 9222)!
echo You can now tell Antigravity in the chat to start the browser test.
echo =====================================================================
pause
