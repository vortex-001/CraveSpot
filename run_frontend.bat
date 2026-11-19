@echo off
setlocal
cd /d "%~dp0"

echo =====================================================================
echo                    CraveSpot Frontend Server
echo =====================================================================
echo.

:: Detect Python executable
set "PYTHON="
if exist "venv\Scripts\python.exe" (
    set "PYTHON=venv\Scripts\python.exe"
) else (
    where py >nul 2>&1
    if %errorlevel%==0 (
        set "PYTHON=py"
    ) else (
        where python >nul 2>&1
        if %errorlevel%==0 (
            set "PYTHON=python"
        )
    )
)

if "%PYTHON%"=="" (
    echo [ERROR] Python not found. Please install Python or run setup.bat first.
    pause
    exit /b 1
)

if not exist "frontend\index.html" (
    echo [ERROR] frontend\index.html not found!
    echo Please ensure this batch script is located in the CraveSpot project root.
    pause
    exit /b 1
)

set "PORT=5500"
echo [*] Serving CraveSpot frontend from .\frontend on port %PORT%...
echo [*] Opening http://127.0.0.1:%PORT% in your default browser...
echo.
echo Press CTRL+C to stop the frontend server at any time.
echo =====================================================================
echo.

:: Launch browser in background after short delay
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:%PORT%"

:: Start Python HTTP Server
%PYTHON% -m http.server %PORT% --directory frontend

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to start HTTP server on port %PORT%.
    echo The port might already be in use. Trying port 3000...
    start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:3000"
    %PYTHON% -m http.server 3000 --directory frontend
)

echo.
pause
