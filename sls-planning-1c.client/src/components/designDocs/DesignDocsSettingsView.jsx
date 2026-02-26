import React from 'react';

const DesignDocsSettingsView = ({ pdfPath, onPdfPathChange }) => {
    return (
        <section className="design-docs-page design-docs-settings-page">
            <div className="settings-horizontal-group">
                <h2>Группа 1 — Путь к файлам PDF/DXF</h2>
                <div className="settings-path-row">
                    <input
                        type="text"
                        value={pdfPath}
                        onChange={(event) => onPdfPathChange(event.target.value)}
                    />
                    <button type="button">Обзор</button>
                </div>
            </div>

            <div className="design-docs-actions">
                <button type="button" className="save-btn">Сохранить</button>
                <button type="button" className="cancel-btn">Отмена</button>
            </div>
        </section>
    );
};

export default DesignDocsSettingsView;
