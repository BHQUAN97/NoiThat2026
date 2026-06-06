@echo off
title VietNet Interior - Start All (Dev)
color 0A
setlocal enabledelayedexpansion

:: File o scripts/, cd ve project root
cd /d %~dp0..

echo ============================================
echo   VietNet Interior - Dev (Full Docker)
echo   Nginx DISABLED o dev (avoid SSL cert issue)
echo ============================================
echo.

:: ── Check Docker ──
docker info >nul 2>&1
if errorlevel 1 (
    echo [LOI] Docker Desktop chua chay. Mo Docker truoc!
    pause
    exit /b 1
)

:: ── .env ──
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo [INFO] Da tao backend\.env tu .env.example
    ) else (
        echo [LOI] Khong co backend\.env va .env.example
        pause
        exit /b 1
    )
)
if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env" >nul
        echo [INFO] Da tao frontend\.env tu .env.example
    ) else (
        > "frontend\.env" (
            echo NEXT_PUBLIC_API_URL=http://localhost:4100/api
            echo NEXT_PUBLIC_SITE_URL=http://localhost:3100
        )
        echo [INFO] Da tao frontend\.env mac dinh
    )
)

set DC=docker compose -f docker-compose.yml -f docker-compose.dev.yml

:: ── Menu ──
echo   [1] Start all (mysql+redis+be+fe)
echo   [2] Rebuild BE+FE roi start
echo   [3] Chi start infra (mysql+redis)
echo   [4] Stop all
echo.
set /p CHOICE="Chon [1-4, default=1]: "
if "!CHOICE!"=="" set CHOICE=1

if "!CHOICE!"=="4" goto stop_all
if "!CHOICE!"=="3" goto infra_only
if "!CHOICE!"=="2" goto rebuild

:start_all
echo.
echo [1/2] Khoi dong tat ca...
%DC% up -d mysql redis backend frontend
if errorlevel 1 goto err
echo.
echo [2/2] Cho services healthy...
goto wait_health

:rebuild
echo.
echo [1/3] Build BE + FE...
%DC% build --parallel backend frontend
if errorlevel 1 goto err
echo.
echo [2/3] Khoi dong...
%DC% up -d mysql redis backend frontend
if errorlevel 1 goto err
echo.
echo [3/3] Cho services healthy...
goto wait_health

:infra_only
echo.
echo Khoi dong MySQL + Redis...
%DC% up -d mysql redis
if errorlevel 1 goto err
echo   MySQL:  127.0.0.1:3307
echo   Redis:  127.0.0.1:6380
pause
exit /b 0

:stop_all
echo.
echo Dung tat ca VietNet2026 containers...
%DC% down
echo Done.
pause
exit /b 0

:wait_health
set /a _r=0
:_wh
set /a _r+=1
if !_r! gtr 40 (
    echo   [WARN] Services chua healthy sau 80s. Xem: %DC% logs
    goto done
)
timeout /t 2 /nobreak >nul
curl -sf http://localhost:4100/api/health >nul 2>&1
if errorlevel 1 goto _wh
echo   Backend:  OK (port 4100)
curl -sf http://localhost:3100 >nul 2>&1
if errorlevel 1 (
    timeout /t 3 /nobreak >nul
    curl -sf http://localhost:3100 >nul 2>&1
)
echo   Frontend: OK (port 3100)

:done
echo.
echo ============================================
echo   VietNet2026 Dev dang chay
echo --------------------------------------------
echo   Frontend: http://localhost:3100
echo   Backend:  http://localhost:4100/api
echo   MySQL:    127.0.0.1:3307
echo   Redis:    127.0.0.1:6380
echo --------------------------------------------
echo   Cloudflare tunnel (neu bat): bhquan.site
echo --------------------------------------------
echo   Logs:  %DC% logs -f
echo   Dung:  %DC% down
echo ============================================
start http://localhost:3100
pause
exit /b 0

:err
echo.
echo [LOI] Command that bai. Xem chi tiet: %DC% logs
pause
exit /b 1
