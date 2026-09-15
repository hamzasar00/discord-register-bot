@echo off
setlocal
chcp 65001 >nul
title Discord Register Bot
cd /d "%~dp0"

echo.
echo ============================================
echo   Discord Register Bot - Baslatma
echo ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [HATA] Node.js bulunamadi.
    echo Once kurulum.bat dosyasini calistirin.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [HATA] npm bulunamadi. Node.js kurulumunu onarin.
    echo.
    pause
    exit /b 1
)

node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>18||(major===18&&minor>=20)?0:1)"
if errorlevel 1 (
    echo [HATA] Node.js 18.20 veya daha yeni bir surum gerekli.
    echo Node.js LTS surumunu https://nodejs.org adresinden kurun.
    echo.
    pause
    exit /b 1
)

call npm ls --depth=0 >nul 2>&1
if errorlevel 1 (
    echo [BILGI] Bagimliliklar bulunamadi. Kurulum baslatiliyor...
    echo.
    call "%~dp0kurulum.bat"
    if errorlevel 1 (
        echo [HATA] Kurulum tamamlanamadigi icin bot baslatilmadi.
        echo.
        pause
        exit /b 1
    )
)

if exist ".env" (
    echo [BILGI] .env dosyasi bulundu. Gizli ayarlar dotenv ile yuklenecek.
) else (
    if "%DISCORD_TOKEN%"=="" (
        echo [HATA] DISCORD_TOKEN tanimli degil ve .env dosyasi bulunamadi.
        echo .env.example dosyasini .env olarak kopyalayip degerleri doldurun.
        echo Tokeni bu dosyanin veya kaynak kodun icine yazmayin.
        echo.
        pause
        exit /b 1
    )

    if "%MONGO_URL%"=="" (
        echo [HATA] MONGO_URL tanimli degil ve .env dosyasi bulunamadi.
        echo .env.example dosyasini .env olarak kopyalayip degerleri doldurun.
        echo.
        pause
        exit /b 1
    )
)

echo [BILGI] Bot baslatiliyor...
echo Kapatmak icin Ctrl+C tuslarini kullanabilirsiniz.
echo.

call npm start
set "BOT_EXIT_CODE=%ERRORLEVEL%"

if not "%BOT_EXIT_CODE%"=="0" (
    echo.
    echo [HATA] Bot %BOT_EXIT_CODE% hata koduyla kapandi.
    echo Ayarlari ve yukaridaki hata mesajini kontrol edin.
    echo.
    pause
)

exit /b %BOT_EXIT_CODE%