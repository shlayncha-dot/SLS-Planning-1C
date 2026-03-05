@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "TARGET_SCRIPT=%SCRIPT_DIR%tools\windows-indexer\run-indexer.bat"

if not exist "%TARGET_SCRIPT%" (
  echo [ERROR] Не найден "%TARGET_SCRIPT%".
  echo [INFO] Запускайте этот файл из корня репозитория SLS-Planning-1C.
  exit /b 1
)

call "%TARGET_SCRIPT%"
set "EXIT_CODE=%ERRORLEVEL%"

endlocal & exit /b %EXIT_CODE%
