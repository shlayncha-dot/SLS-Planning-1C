import React, { useMemo, useState } from 'react';

const formatDateTime = (value) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString('ru-RU');
};


const specTypeLabels = {
    0: 'Basic',
    1: 'Wire',
    2: 'Packaging',
    3: 'Tech',
    basic: 'Basic',
    wire: 'Wire',
    packaging: 'Packaging',
    tech: 'Tech'
};

const formatSpecType = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const key = String(value).toLowerCase();
    return specTypeLabels[key] || String(value);
};

const getSearchableValue = (specification) => [
    specification.specificationName,
    specification.specType,
    specification.uploadedAtUtc
]
    .map((value) => String(value ?? '').toLowerCase())
    .join(' ');

const SpecificationListView = ({
    specifications,
    isLoading,
    loadError
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredSpecifications = useMemo(() => {
        if (!normalizedSearch) {
            return specifications;
        }

        return specifications.filter((specification) => getSearchableValue(specification).includes(normalizedSearch));
    }, [normalizedSearch, specifications]);

    return (
        <section className="spec-list-dialog-overlay" role="dialog" aria-modal="true" aria-label="Список спецификаций">
            <article className="spec-list-dialog">
                <h2>Список спецификаций</h2>

                <label className="field-group spec-list-search-field">
                    Поиск по таблице
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Поиск по наименованию, типу и дате"
                    />
                </label>

                {loadError ? <p className="spec-list-error">{loadError}</p> : null}

                <div className="spec-list-table-wrap">
                    <table className="spec-list-table">
                        <thead>
                            <tr>
                                <th>Наименование спецификации</th>
                                <th>Тип спецификации</th>
                                <th>Дата загрузки</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3}>Загрузка...</td>
                                </tr>
                            ) : filteredSpecifications.length === 0 ? (
                                <tr>
                                    <td colSpan={3}>{normalizedSearch ? 'Поиск не дал результатов.' : 'Пока нет спецификаций.'}</td>
                                </tr>
                            ) : (
                                filteredSpecifications.map((specification) => (
                                    <tr key={specification.id}>
                                        <td>{specification.specificationName || '—'}</td>
                                        <td>{formatSpecType(specification.specType)}</td>
                                        <td>{formatDateTime(specification.uploadedAtUtc)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
    );
};

export default SpecificationListView;
