const ALLOWED_TYPES = new Set(['компл', 'крепеж', 'крепеж_св']);

export const extractRowsForNamingCheck = (rows, tableColumns) => {
    const nameColumn = tableColumns.find((column) => column.label.toLowerCase().includes('наимен'));
    const typeColumn = tableColumns.find((column) => column.label.toLowerCase().includes('тип'));

    if (!nameColumn) {
        return {
            rows: [],
            nameColumnKey: null,
            errorMessage: 'Не найден столбец «Наименование». Проверьте заголовок в Excel.'
        };
    }

    if (!typeColumn) {
        return {
            rows: [],
            nameColumnKey: nameColumn.key,
            errorMessage: 'Не найден столбец «Тип». Проверьте заголовок в Excel.'
        };
    }

    const filteredRows = rows
        .map((row) => ({
            rowId: String(row.id),
            name: String(row[nameColumn.key] ?? '').trim(),
            type: String(row[typeColumn.key] ?? '').trim().toLowerCase()
        }))
        .filter((row) => row.name && ALLOWED_TYPES.has(row.type))
        .map(({ rowId, name }) => ({ rowId, name }));

    return {
        rows: filteredRows,
        nameColumnKey: nameColumn.key,
        errorMessage: null
    };
};
