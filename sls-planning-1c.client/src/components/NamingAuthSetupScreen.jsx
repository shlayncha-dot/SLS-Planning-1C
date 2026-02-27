import React from 'react';
import { t } from '../config/translations';

const NamingAuthSetupScreen = ({ lang, onSubmit, saving, errorMessage }) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ username: username.trim(), password });
    };

    return (
        <div className="login-screen">
            <form className="login-card login-form" onSubmit={handleSubmit}>
                <h2>{t(lang, 'namingAuth.title')}</h2>
                <p className="login-description">{t(lang, 'namingAuth.description')}</p>

                <label htmlFor="naming-auth-login">{t(lang, 'auth.login')}</label>
                <input
                    id="naming-auth-login"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />

                <label htmlFor="naming-auth-password">{t(lang, 'auth.password')}</label>
                <input
                    id="naming-auth-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

                <button className="save-btn" type="submit" disabled={saving}>
                    {saving ? t(lang, 'namingAuth.saving') : t(lang, 'namingAuth.submit')}
                </button>
            </form>
        </div>
    );
};

export default NamingAuthSetupScreen;
