import React, { useState } from 'react';
import { t } from '../config/translations';
import { changePassword, saveProfile } from '../services/userService';

const Settings = ({ lang, user, setUser, setIsSettingsOpen }) => {
    const [form, setForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        photoUrl: user.photoUrl
    });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSaveProfile = async () => {
        setMessage('');
        setError('');
        try {
            await saveProfile({ ...form, login: user.login });
            setUser({ ...user, ...form });
            setMessage('Профиль сохранен.');
        } catch (saveError) {
            setError(saveError.message || 'Ошибка сохранения профиля.');
        }
    };

    const onChangePassword = async () => {
        setMessage('');
        setError('');
        try {
            await changePassword({ login: user.login, ...passwordForm });
            setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            setMessage('Пароль обновлен.');
        } catch (passwordError) {
            setError(passwordError.message || 'Ошибка смены пароля.');
        }
    };

    return (
        <div className="settings-form">
            <h2>{t(lang, 'settings.profileTitle')}</h2>
            <div className="settings-split">
                <div className="settings-avatar">
                    <img src={form.photoUrl || 'https://i.pravatar.cc/100?img=32'} alt="Avatar" />
                    <label>{t(lang, 'settings.avatarLink')}</label>
                    <input type="text" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
                </div>
                <div className="settings-inputs">
                    <label>{t(lang, 'settings.firstName')}</label>
                    <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    <label>{t(lang, 'settings.lastName')}</label>
                    <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    <label>{t(lang, 'settings.phone')}</label>
                    <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <label>{t(lang, 'settings.email')}</label>
                    <input type="text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <div className="settings-btn-row">
                        <button className="save-btn" onClick={onSaveProfile}>{t(lang, 'settings.save')}</button>
                        <button className="cancel-btn" onClick={() => setIsSettingsOpen(false)}>{t(lang, 'settings.cancel')}</button>
                    </div>
                </div>
            </div>

            <div className="password-panel">
                <h3>{t(lang, 'settings.changePassword')}</h3>
                <label>{t(lang, 'settings.oldPassword')}</label>
                <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                />
                <label>{t(lang, 'settings.newPassword')}</label>
                <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <label>{t(lang, 'settings.confirmPassword')}</label>
                <input
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                />
                <button className="save-btn" onClick={onChangePassword}>{t(lang, 'settings.save')}</button>
            </div>

            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error">{error}</p>}
        </div>
    );
};

export default Settings;
