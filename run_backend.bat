@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo =====================================================================
echo                     CraveSpot Backend Server
echo =====================================================================
echo.

:: Detect Python virtual environment
set "VENV_PYTHON="
if exist "venv\Scripts\python.exe" (
    set "VENV_PYTHON=venv\Scripts\python.exe"
    set "VENV_ACTIVATE=venv\Scripts\activate.bat"
) else if exist "backend\venv\Scripts\python.exe" (
    set "VENV_PYTHON=backend\venv\Scripts\python.exe"
    set "VENV_ACTIVATE=backend\venv\Scripts\activate.bat"
)

if "%VENV_PYTHON%"=="" (
    echo [WARNING] Virtual environment not found.
    echo Running setup.bat to configure the environment...
    echo.
    call setup.bat
    if not exist "venv\Scripts\python.exe" (
        echo [ERROR] Virtual environment setup failed.
        pause
        exit /b 1
    )
    set "VENV_PYTHON=venv\Scripts\python.exe"
    set "VENV_ACTIVATE=venv\Scripts\activate.bat"
)

:: Ensure .env exists
if not exist ".env" (
    if exist ".env.example" (
        echo [*] .env not found. Creating from .env.example...
        copy ".env.example" ".env" >nul
    )
)

:: Verify backend entrypoint
if not exist "backend\app.py" (
    echo [ERROR] backend\app.py not found!
    echo Please make sure this file is placed in the CraveSpot project root.
    pause
    exit /b 1
)

:: Activate virtual environment
call "%VENV_ACTIVATE%"
if errorlevel 1 (
    echo [ERROR] Could not activate virtual environment.
    pause
    exit /b 1
)

echo [*] Starting CraveSpot Backend (Flask + MySQL)...
echo [*] Target Database: project
echo [*] API URL: http://127.0.0.1:5000/api
echo.
echo Press CTRL+C to stop the server at any time.
echo =====================================================================
echo.

python -m backend.app
if errorlevel 1 (
    python backend\app.py
)
set "EXIT_CODE=%errorlevel%"

if not "%EXIT_CODE%"=="0" (
    echo.
    echo =====================================================================
    echo [ERROR] Backend stopped unexpectedly with exit code: %EXIT_CODE%
    echo =====================================================================
    echo Common issues:
    echo  1. Port 5000 is already in use by another application.
    echo  2. MySQL Server is not running or credentials in .env are incorrect.
    echo  3. Missing dependencies: Run 'setup.bat' to reinstall.
    echo  4. Database 'project' does not exist: Run 'python init_db.py'.
    echo =====================================================================
)

echo.
pause
