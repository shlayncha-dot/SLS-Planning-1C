import React from 'react';

const SpecificationUploadView = ({
    productName,
    onProductNameChange,
    selectedSpecType,
    onSpecTypeChange,
    comment,
    onCommentChange,
    uploadFileName,
    uploadInputRef,
    onUploadFileChange,
    onSave,
    onCancel,
    isSaving,
    productList,
    isProductDialogOpen,
    onCloseProductDialog,
    onSelectProduct,
    uploadStatus,
    onCloseStatusDialog
}) => {
    return (
        <section className="design-docs-page">
            <div className="spec-upload-layout spec-upload-layout-single">
                <article className="spec-card">
                    <h2>Загрузка спецификации</h2>

                    <div className="spec-upload-form-grid">
                        <div className="spec-upload-left-column">
                            <label className="field-group spec-product-field">
                                Наименование спецификации
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(event) => onProductNameChange(event.target.value)}
                                    placeholder="Введите наименование"
                                />
                            </label>

                            <label className="field-group">
                                Тип спецификации
                                <select value={selectedSpecType} onChange={(event) => onSpecTypeChange(event.target.value)}>
                                    <option value="Basic">Basic</option>
                                    <option value="Wire">Wire</option>
                                    <option value="Packaging">Packaging</option>
                                    <option value="Tech">Tech</option>
                                </select>
                            </label>

                            <div className="field-group">
                                Загрузить Excel
                                <div className="inline-file-upload">
                                    <input type="text" value={uploadFileName} readOnly placeholder="Файл не выбран" />
                                    <button type="button" onClick={() => uploadInputRef.current?.click()}>
                                        Выбрать файл
                                    </button>
                                    <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept=".xls,.xlsx"
                                        className="hidden-input"
                                        onChange={(event) => onUploadFileChange(event.target.files?.[0] || null)}
                                    />
                                </div>
                            </div>
                        </div>

                        <label className="field-group spec-comment-field">
                            Комментарий
                            <textarea
                                rows={10}
                                value={comment}
                                onChange={(event) => onCommentChange(event.target.value)}
                                placeholder="Добавьте комментарий"
                            />
                        </label>
                    </div>

                    <div className="spec-upload-actions">
                        <button type="button" className="save-btn" onClick={onSave} disabled={isSaving}>
                            {isSaving ? 'Загрузка…' : 'Загрузить'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={onCancel} disabled={isSaving}>
                            Отмена
                        </button>
                    </div>
                </article>
            </div>

            {isProductDialogOpen ? (
                <div className="route-sheets-dialog-overlay" role="presentation">
                    <div className="route-sheets-dialog" role="dialog" aria-modal="true" aria-label="Список наименований изделий">
                        <h3>Ранее созданные наименования изделий</h3>
                        {productList.length === 0 ? (
                            <p>На сервере пока нет сохраненных наименований.</p>
                        ) : (
                            <ul className="spec-product-options">
                                {productList.map((name) => (
                                    <li key={name}>
                                        <button type="button" className="cancel-btn" onClick={() => onSelectProduct(name)}>
                                            {name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="route-sheets-dialog-actions">
                            <button type="button" className="cancel-btn" onClick={onCloseProductDialog}>Закрыть</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {uploadStatus ? (
                <div className="verification-report-overlay" role="dialog" aria-modal="true">
                    <div className="verification-report-modal">
                        <h3>Статус загрузки</h3>
                        <p>{uploadStatus.message}</p>
                        <div className="verification-report-actions">
                            <button type="button" className="save-btn" onClick={onCloseStatusDialog}>Ок</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
};

export default SpecificationUploadView;
