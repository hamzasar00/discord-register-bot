@echo off
setlocal
chcp 65001 >nul
title Discord Register Bot - Kurulum
cd /d "%~dp0"

echo.
echo ============================================
echo   Discord Register Bot - Kurulum
echo ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo [HATA] Node.js bulunamadi.
    echo Node.js LTS surumunu https://nodejs.org adresinden kurun.
    echo Kurulumdan sonra bu dosyayi yeniden calistirin.
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

echo [BILGI] Node.js surumu:
node --version
echo [BILGI] npm surumu:
call npm --version
echo.
echo [BILGI] Bagimliliklar package-lock.json dosyasina gore kuruluyor...
echo.

call npm ci
if errorlevel 1 (
    echo.
    echo [HATA] Bagimliliklar kurulamadi.
    echo Internet baglantisini ve yukaridaki hata mesajini kontrol edin.
    echo.
    pause
    exit /b 1
)

if not exist ".env" (
    if exist ".env.example" (
        copy /Y ".env.example" ".env" >nul
        echo.
        echo [BILGI] .env dosyasi olusturuldu.
        echo Discord tokenini ve MongoDB adresini .env dosyasinda doldurun.
    )
)

echo.
echo [BASARILI] Kurulum tamamlandi.
echo Botu baslatmak icin başlat.bat dosyasini calistirin.
echo.
pause
exit /b 0