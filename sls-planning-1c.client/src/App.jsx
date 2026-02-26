import React, { useState } from 'react';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [lang, setLang] = useState('RU');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Данные пользователя
    const [user, setUser] = useState({
        firstName: 'Anna',
        lastName: 'Smith',
        phone: '+380 99 123 45 67',
        email: 'anna.smith@sls.com',
        avatar: 'https://i.pravatar.cc/100?img=32'
    });

    const menuItems = [
        "Конструкторская документация", "Технолог", "Pilot Group",
        "Производство", "Сборка", "Мастер", "Планирование",
        "DashBoard", "ОТК", "Склад", "Комплектовщик"
    ];

    const savedUsers = [
        { name: 'Anna Smith', avatar: 'https://i.pravatar.cc/100?img=32' },
        { name: 'John Doe', avatar: 'https://i.pravatar.cc/100?img=12' }
    ];

    if (!isLoggedIn) {
        return (
            <div className="main-layout">
                <header className="header">
                    <div className="header-left">
                        <div className="logo-box">
                            <img src="/images/logo1.png" alt="Logo 1" className="logo-img" />
                        </div>
                        <div className="time-block">26.05.2026<br /><b>18:45:10</b></div>
                    </div>
                    <div className="center-title">SLS Planning</div>
                    <div className="header-right"></div>
                </header>
                <div className="login-screen">
                    <div className="login-card">
                        <h2>Выберите пользователя</h2>
                        <div className="saved-users-grid">
                            {savedUsers.map((u, i) => (
                                <div key={i} className="user-login-item" onClick={() => setIsLoggedIn(true)}>
                                    <img src={u.avatar} alt="u" />
                                    <span>{u.name}</span>
                                </div>
                            ))}
                            <div className="user-login-item add-new">
                                <div className="plus-icon">+</div>
                                <span>Новый вход</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-layout">
            <header className="header">
                <div className="header-left">
                    <div className="logo-box">
                        <img src="/images/logo1.png" alt="Logo 1" className="logo-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = 'Лого-1'; }} />
                    </div>
                    <div className="time-block">26.05.2026<br /><b>18:45:10</b></div>
                </div>

                <div className="center-title">SLS Planning</div>

                <div className="header-right">
                    <div className="lang-select">
                        {['RU', 'GE', 'EN'].map(l => (
                            <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>{l}</button>
                        ))}
                    </div>
                    <div className="logo-box">
                        <img src="/images/logo2.png" alt="Logo 2" className="logo-img" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = 'Лого-2'; }} />
                    </div>

                    <div className="auth-wrapper">
                        <div className="auth-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                            <div className="avatar">
                                <img src={user.avatar} alt="avatar" />
                            </div>
                            <div className="user-info">
                                <div className="user-name">{user.firstName} {user.lastName}</div>
                                <div className="user-status">Premium Account</div>
                            </div>
                        </div>

                        {showUserMenu && (
                            <div className="dropdown-menu">
                                <button onClick={() => { setIsSettingsOpen(true); setShowUserMenu(false); }}>Настройки</button>
                                <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Выйти из системы</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <nav className="top-nav-container">
                <div className="top-nav-grid">
                    {menuItems.map((item, index) => (
                        <div key={index} className={`nav-column ${activeTab === index ? 'active' : ''}`} onClick={() => { setActiveTab(index); setIsSettingsOpen(false); }}>
                            <div className="nav-circle">
                                <img src={`/images/menu/${index + 1}.png`} alt={item} className="menu-icon-img" />
                            </div>
                            <span className="nav-label">{item}</span>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="workspace">
                {activeTab !== 7 && !isSettingsOpen && (
                    <aside className="sidebar">
                        <button className="side-btn active">Загрузка спецификации</button>
                        <button className="side-btn">Проверка КД</button>
                        <button className="side-btn" onClick={() => setIsSettingsOpen(true)}>Настройки</button>
                    </aside>
                )}

                <main className="main-display">
                    {isSettingsOpen ? (
                        <div className="settings-form">
                            <h2>Настройки профиля</h2>
                            <div className="settings-split">
                                <div className="settings-avatar">
                                    <img src={user.avatar} alt="Large" />
                                    <input type="file" id="ava-load" hidden onChange={(e) => setUser({ ...user, avatar: URL.createObjectURL(e.target.files[0]) })} />
                                    <label htmlFor="ava-load" className="load-btn">Сменить аватар</label>
                                </div>
                                <div className="settings-inputs">
                                    <label>Имя</label>
                                    <input type="text" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
                                    <label>Фамилия</label>
                                    <input type="text" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
                                    <label>Телефон</label>
                                    <input type="text" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                                    <label>Email</label>
                                    <input type="text" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                                    <button className="save-btn" onClick={() => setIsSettingsOpen(false)}>Сохранить</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h1>{menuItems[activeTab].toUpperCase()}</h1>
                            <p>Контент раздела находится в разработке</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;