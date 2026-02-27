import React, { useMemo, useState } from 'react';

const roles = ['Конструктор', 'Технолог', 'Производство', 'Сборка', 'PilotGroup', 'Oper', 'ОТК', 'Мастер', 'Склад'];

const AdminSettings = ({ usersList, onCreateUser, onSaveUserAccess, activeAdminSubItem }) => {
    const [createForm, setCreateForm] = useState({ login: '', password: '' });
    const [selectedUser, setSelectedUser] = useState('');
    const [role, setRole] = useState(roles[0]);
    const [isAdmin, setIsAdmin] = useState('Нет');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const selectedUserData = useMemo(() => usersList.find((item) => item.login === selectedUser), [usersList, selectedUser]);

    const handleCreate = async () => {
        setMessage('');
        setError('');
        try {
            await onCreateUser(createForm);
            setCreateForm({ login: '', password: '' });
            setMessage('Пользователь создан.');
        } catch (createError) {
            setError(createError.message || 'Ошибка создания пользователя.');
        }
    };

    const handleUserSelect = (value) => {
        setSelectedUser(value);
        const target = usersList.find((item) => item.login === value);
        setRole(target?.role || roles[0]);
        setIsAdmin(target?.isAdmin ? 'Да' : 'Нет');
    };

    const handleSaveAccess = async () => {
        setMessage('');
        setError('');
        try {
            await onSaveUserAccess({ login: selectedUser, role, isAdmin: isAdmin === 'Да' });
            setMessage('Настройки пользователя сохранены.');
        } catch (saveError) {
            setError(saveError.message || 'Ошибка сохранения настроек пользователя.');
        }
    };

    return (
        <div className="admin-settings-grid">
            {activeAdminSubItem === 0 ? (
                <section className="admin-card">
                    <h3>Создать пользователя</h3>
                    <label>Login</label>
                    <input
                        type="text"
                        value={createForm.login}
                        onChange={(e) => setCreateForm({ ...createForm, login: e.target.value })}
                    />
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={createForm.password}
                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    />
                    <button className="save-btn" onClick={handleCreate}>Сохранить</button>
                </section>
            ) : (
                <section className="admin-card">
                    <h3>Настройки аккаунта</h3>
                    <label>Пользователь</label>
                    <select value={selectedUser} onChange={(e) => handleUserSelect(e.target.value)}>
                        <option value="" disabled>Выберите пользователя</option>
                        {usersList.map((item) => (
                            <option key={item.login} value={item.login}>{item.login}</option>
                        ))}
                    </select>

                    <label>Роль</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} disabled={!selectedUserData}>
                        {roles.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <label>Админ</label>
                    <select value={isAdmin} onChange={(e) => setIsAdmin(e.target.value)} disabled={!selectedUserData}>
                        <option value="Да">Да</option>
                        <option value="Нет">Нет</option>
                    </select>

                    <div className="settings-btn-row">
                        <button className="save-btn" onClick={handleSaveAccess} disabled={!selectedUserData}>Сохранить</button>
                        <button className="cancel-btn" onClick={() => handleUserSelect('')}>Отмена</button>
                    </div>
                </section>
            )}

            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}
        </div>
    );
};

export default AdminSettings;
