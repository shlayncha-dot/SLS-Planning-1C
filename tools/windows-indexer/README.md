# Windows indexer запуск

Если запускаете из **PowerShell**, используйте один из вариантов:

- `./run-indexer.ps1`
- `./run-indexer.bat`
- `cmd /c run-indexer.bat`

> В PowerShell команда `run-indexer.bat` без `./` (или `.\`) не запускается из текущей папки и дает `CommandNotFoundException`.

## Быстрый старт

1. Скопируйте конфиг:
   - `Copy-Item .\config.json.example .\config.json`
2. Отредактируйте `config.json`.
3. Запустите индексатор:
   - `./run-indexer.ps1`

`run-indexer.ps1` и `run-indexer.bat` оба запускают `indexer.ps1` с `-ExecutionPolicy Bypass` и проверяют наличие `config.json`.
