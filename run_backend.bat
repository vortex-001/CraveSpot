@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo        CraveSpot Backend Launcher
echo ========================================

where py >nul 2>&1
if %errorlevel%==0 (
    set "PYTHON=py"
) else (
    set "PYTHON=python"
)

if not exist "backend\app.py" (
    echo ERROR: Could not find backend\app.py.
    echo Place this batch file in the CraveSpot project root.
    pause
    exit /b 1
)

if not exist "requirements.txt" (
    echo ERROR: Could not find requirements.txt in the project root.
    pause
    exit /b 1
)

if not exist "backend\venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    %PYTHON% -m venv "backend\venv"
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment.
        pause
        exit /b 1
    )
)

call "backend\venv\Scripts\activate.bat"
if errorlevel 1 (
    echo ERROR: Could not activate virtual environment.
    pause
    exit /b 1
)

echo Installing/updating required packages...
python -m pip install --upgrade pip
python -m pip install -r "requirements.txt"
if errorlevel 1 (
    echo ERROR: Dependency installation failed.
    pause
    exit /b 1
)

echo Starting CraveSpot backend...
cd /d "%~dp0backend"
python app.py

echo.
echo Backend stopped. Press any key to close this window.
pause >nul
