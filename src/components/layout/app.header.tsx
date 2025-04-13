import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Space, Drawer, Divider, App } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useCurrentApp } from 'components/context/app.context';
import './app.header.scss';
import { logoutAPI } from '@/services/api';

const AppHeader = () => {
    const { message } = App.useApp();
    const [openDrawer, setOpenDrawer] = useState(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated } = useCurrentApp();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            message.success("Đăng xuất thành công!");
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    };

    type MenuItem = { label: string; path: string };

    const menuItems: MenuItem[] = [
        { label: "Trang Chủ", path: "/" },
        { label: "Bản Đồ Cây Xanh", path: "/treemap" },
        { label: "Ý Kiến - Phản Ánh", path: "/feedback" },
    ];

    const userMenuItems = [
        ...(user?.role === 'ADMIN' || user?.role === 'EMPLOYEE' ? [{ label: "Trang Quản Trị", key: '/admin' }] : []),
        { label: <label style={{ color: "red" }}>Đăng xuất</label>, key: 'logout' }
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            handleLogout();
        } else {
            navigate(key);
        }
    };

    return (
        <>
            <header className="app-header">
                <div className="header-container">
                    {/* Logo */}
                    <div className="header-logo" onClick={() => navigate('/')}>
                        <img src="/logo_qlcx.svg" alt="Quản Lý Cây Xanh, Cảnh Quan" className="logo-image" />
                    </div>

                    {/* Menu Desktop */}
                    <nav className="header-nav">
                        {menuItems.map(({ label, path }) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="header-actions">
                        {!isAuthenticated ? (
                            <strong><span style={{ cursor: "pointer" }} onClick={() => navigate('/login')}>Đăng nhập</span></strong>
                        ) : (
                            <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={['click']}>
                                <Space className="user-info">
                                    <Avatar icon={<UserOutlined />} />
                                    <span className="user-name">{user?.name}</span>
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
                className="mobile-menu"
                title={<div className="drawer-header">Menu Chức Năng</div>}
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <div className="drawer-menu">
                    {menuItems.map(({ label, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => setOpenDrawer(false)}
                            className={({ isActive }) => isActive ? 'drawer-item active' : 'drawer-item'}
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>
                <Divider />
                {isAuthenticated && (
                    <div className="drawer-footer" onClick={handleLogout}>Đăng Xuất</div>
                )}
            </Drawer>
        </>
    );
};

export default AppHeader;
