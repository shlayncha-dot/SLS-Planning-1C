import React from 'react';

const tableColumns = [
    { key: 'code', label: 'Код детали' },
    { key: 'name', label: 'Наименование' },
    { key: 'material', label: 'Материал' },
    { key: 'qty', label: 'Количество' }
];

const KDCheckView = ({
    verifyInputRef,
    sortedRows,
    sortState,
    onToggleSort,
    checkedRows,
    onToggleRow,
    allVisibleChecked,
    onToggleAllVisible
}) => {
    return (
        <section className="design-docs-page design-docs-check-page">
            <div className="check-toolbar">
                <button type="button" onClick={() => verifyInputRef.current?.click()}>Загрузить Excel</button>
                <input ref={verifyInputRef} type="file" accept=".xls,.xlsx" className="hidden-input" />
                <button type="button">Верификация</button>
                <button type="button">Нейминг</button>
                <button type="button">Общая проверка КД</button>
            </div>

            <div className="kd-table-wrap">
                <table className="kd-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" checked={allVisibleChecked} onChange={onToggleAllVisible} />
                            </th>
                            {tableColumns.map((column) => (
                                <th key={column.key} onClick={() => onToggleSort(column.key)} className="sortable-column">
                                    {column.label}
                                    <span className="sort-indicator">
                                        {sortState.key === column.key ? (sortState.direction === 'asc' ? '▲' : '▼') : '↕'}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(checkedRows[row.id])}
                                        onChange={() => onToggleRow(row.id)}
                                    />
                                </td>
                                <td>{row.code}</td>
                                <td>{row.name}</td>
                                <td>{row.material}</td>
                                <td>{row.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default KDCheckView;
