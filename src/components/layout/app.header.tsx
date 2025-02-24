import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Space, Drawer, Divider, App } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useCurrentApp } from 'components/context/app.context';
import './app.header.scss';
import { logoutAPI } from '@/services/api';

const AppHeader = () => {
    const { message } = App.useApp()
    const [openDrawer, setOpenDrawer] = useState(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
    const navigate = useNavigate();

    const handleLogout = async () => {
        // TODO: Xử lý đăng xuất
        const res = await logoutAPI();
        if (res.data) {
            message.success("Đăng xuất thành công!")
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    };

    const menuItems = [
        { label: <Link to="/">Trang Chủ</Link>, key: '' },
        // { label: <Link to="/category">Danh Mục</Link>, key: 'category' },
        { label: <Link to="/treemap">Bản Đồ Cây Xanh</Link>, key: 'treemap' },
        // { label: <Link to="/statistics">Thống Kê</Link>, key: 'stats' },
        { label: <Link to="/feedback">Ý Kiến - Phản Ánh</Link>, key: 'feedback' },
    ];

    return (
        <>
            <header className="app-header">
                <div className="header-container">
                    {/* Logo (Hình ảnh) */}
                    <div className="header-logo" onClick={() => navigate('/')}>
                        <img src="/logo_qlcx.svg" alt="Quản Lý Cây Xanh, Cảnh Quan" className="logo-image" />
                    </div>

                    {/* Menu Desktop */}
                    <nav className="header-nav">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.key}
                                to={item.key}
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="header-actions">
                        {!isAuthenticated ? (
                            <span style={{ cursor: "pointer" }} onClick={() => navigate('/login')}>Đăng nhập</span>
                        ) : (
                            <Dropdown
                                menu={{
                                    items: [
                                        ...(user?.role === 'ADMIN' ? [{ label: <Link to="/admin">Trang Quản Trị</Link>, key: 'admin' }] : []),
                                        { label: <Link to="/profile">Hồ Sơ</Link>, key: 'profile' },
                                        { label: <span style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng Xuất</span>, key: 'logout' }
                                    ]
                                }}
                                trigger={['click']}
                            >
                                <Space className="user-info">
                                    <Avatar icon={<UserOutlined />} />
                                    {user?.name}
                                </Space>
                            </Dropdown>
                        )}
                    </div>

                    {/* Mobile Menu Icon */}
                    <MenuOutlined className="menu-icon" onClick={() => setOpenDrawer(true)} />
                </div>
            </header>

            {/* Mobile Drawer */}
            <Drawer
                title="Menu Chức Năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                {menuItems.map((item) => (
                    <p key={item.key}>
                        <Link to={item.key} onClick={() => setOpenDrawer(false)}>
                            {item.label}
                        </Link>
                    </p>
                ))}
                <Divider />
                <p onClick={() => handleLogout()}>Đăng Xuất</p>
                <Divider />
            </Drawer>
        </>
    );
};

export default AppHeader;
