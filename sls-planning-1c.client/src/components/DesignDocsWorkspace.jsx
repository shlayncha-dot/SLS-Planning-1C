import React, { useMemo, useRef, useState } from 'react';
import SpecificationUploadView from './designDocs/SpecificationUploadView';
import KDCheckView from './designDocs/KDCheckView';
import DesignDocsSettingsView from './designDocs/DesignDocsSettingsView';

const sampleSpecs = [
    { id: 1, code: 'A-1001', name: 'Корпус', material: 'Сталь', qty: 2 },
    { id: 2, code: 'A-1002', name: 'Крышка', material: 'Алюминий', qty: 1 },
    { id: 3, code: 'A-1003', name: 'Пластина', material: 'Нержавеющая сталь', qty: 4 },
    { id: 4, code: 'A-1004', name: 'Кронштейн', material: 'Сталь', qty: 3 },
    { id: 5, code: 'A-1005', name: 'Втулка', material: 'Латунь', qty: 6 }
];

const DesignDocsWorkspace = ({ activeSubItem }) => {
    const uploadInputRef = useRef(null);
    const verifyInputRef = useRef(null);

    const [productName, setProductName] = useState('');
    const [specName, setSpecName] = useState('');
    const [uploadFile, setUploadFile] = useState('');
    const [pdfPath, setPdfPath] = useState('C:/SLS/KD/PDF_DXF');

    const [sortState, setSortState] = useState({ key: 'code', direction: 'asc' });
    const [checkedRows, setCheckedRows] = useState({});

    const sortedRows = useMemo(() => {
        const rows = [...sampleSpecs];
        const { key, direction } = sortState;
        const directionFactor = direction === 'asc' ? 1 : -1;

        rows.sort((firstRow, secondRow) => {
            const firstValue = firstRow[key];
            const secondValue = secondRow[key];

            if (firstValue === secondValue) {
                return 0;
            }

            return firstValue > secondValue ? directionFactor : -directionFactor;
        });

        return rows;
    }, [sortState]);

    const visibleRowIds = sortedRows.map((row) => row.id);
    const allVisibleChecked = visibleRowIds.length > 0 && visibleRowIds.every((id) => checkedRows[id]);

    const toggleSort = (key) => {
        setSortState((prevState) => {
            if (prevState.key === key) {
                return {
                    key,
                    direction: prevState.direction === 'asc' ? 'desc' : 'asc'
                };
            }

            return { key, direction: 'asc' };
        });
    };

    const toggleRow = (rowId) => {
        setCheckedRows((prevState) => ({
            ...prevState,
            [rowId]: !prevState[rowId]
        }));
    };

    const toggleAllVisible = () => {
        setCheckedRows((prevState) => {
            const nextState = { ...prevState };

            visibleRowIds.forEach((rowId) => {
                nextState[rowId] = !allVisibleChecked;
            });

            return nextState;
        });
    };

    if (activeSubItem === 0) {
        return (
            <SpecificationUploadView
                productName={productName}
                onProductNameChange={setProductName}
                specName={specName}
                onSpecNameChange={setSpecName}
                uploadFile={uploadFile}
                uploadInputRef={uploadInputRef}
                onUploadFileChange={setUploadFile}
            />
        );
    }

    if (activeSubItem === 1) {
        return (
            <KDCheckView
                verifyInputRef={verifyInputRef}
                sortedRows={sortedRows}
                sortState={sortState}
                onToggleSort={toggleSort}
                checkedRows={checkedRows}
                onToggleRow={toggleRow}
                allVisibleChecked={allVisibleChecked}
                onToggleAllVisible={toggleAllVisible}
            />
        );
    }

    return <DesignDocsSettingsView pdfPath={pdfPath} onPdfPathChange={setPdfPath} />;
};

export default DesignDocsWorkspace;
