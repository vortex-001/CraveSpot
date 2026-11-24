@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo =====================================================================
echo                    CraveSpot Setup Script
echo =====================================================================
echo.

:: Detect Python executable
set "PYTHON="
where py >nul 2>&1
if %errorlevel%==0 (
    set "PYTHON=py"
) else (
    where python >nul 2>&1
    if %errorlevel%==0 (
        set "PYTHON=python"
    )
)

if "%PYTHON%"=="" (
    echo [ERROR] Python is not installed or not found in system PATH.
    echo Please install Python 3.10+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo [*] Python detected:
%PYTHON% --version
echo.

:: Check / Create Virtual Environment
if not exist "venv\Scripts\python.exe" (
    echo [*] Creating virtual environment in .\venv ...
    %PYTHON% -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [*] Virtual environment created successfully.
) else (
    echo [*] Virtual environment already exists at .\venv.
)
echo.

:: Activate Virtual Environment
call "venv\Scripts\activate.bat"
if errorlevel 1 (
    echo [ERROR] Could not activate virtual environment.
    pause
    exit /b 1
)

:: Install / Update Dependencies
echo [*] Installing required Python dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Dependency installation failed. Check your network connection.
    pause
    exit /b 1
)
echo [*] Dependencies installed successfully.
echo.

:: Check .env configuration file
if not exist ".env" (
    echo [*] .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [*] Created .env with default settings (Database: CraveSpot).
    ) else (
        echo DB_HOST=localhost> .env
        echo DB_PORT=3306>> .env
        echo DB_USER=root>> .env
        echo DB_PASSWORD=>> .env
        echo DB_NAME=CraveSpot>> .env
        echo PORT=5000>> .env
        echo [*] Generated default .env file.
    )
    echo.
    echo [NOTICE] Please open '.env' in your text editor and verify your MySQL password.
) else (
    echo [*] Configuration file .env found.
)
echo.

:: Check Database Initialization
echo =====================================================================
echo                     Database Initialization
echo =====================================================================
echo.
echo Would you like to initialize the database now using init_db.py?
echo (Make sure your MySQL Server is running)
echo.
set /p INIT_CHOICE="Initialize database now? [Y/N, default Y]: "
if /i "%INIT_CHOICE%"=="" set "INIT_CHOICE=Y"
if /i "%INIT_CHOICE%"=="Y" (
    echo.
    echo [*] Initializing database...
    python init_db.py
    if errorlevel 1 (
        echo.
        echo [WARNING] Database initialization could not connect to MySQL.
        echo If MySQL Server is not yet running, start it and run:
        echo    venv\Scripts\python.exe init_db.py
        echo Or run database\schema.sql in MySQL Workbench.
    )
) else (
    echo [*] Skipping database initialization.
    echo Remember to run database\schema.sql or 'python init_db.py' before launching.
)

echo.
echo =====================================================================
echo                      Setup Complete!
echo =====================================================================
echo To run CraveSpot:
echo   1. Double-click 'run_backend.bat'  to start the Flask API (port 5000)
echo   2. Double-click 'run_frontend.bat' to start the Web UI (port 5500)
echo   3. Open http://127.0.0.1:5500 in your browser.
echo =====================================================================
echo.
pause
