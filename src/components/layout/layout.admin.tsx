import React, { useState } from 'react';
import {
    AppstoreOutlined,
    HeartTwoTone,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Avatar, Alert, Modal } from 'antd';
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import { logoutAPI } from '@/services/api';
type MenuItem = Required<MenuProps>['items'][number];
import { IoLeafOutline } from 'react-icons/io5';
import { VscFeedback } from 'react-icons/vsc';
import { FaTasks } from 'react-icons/fa';

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useCurrentApp();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    }

    const items: MenuItem[] = [
        // {
        //     label: <Link to='/admin'>Thống kê</Link>,
        //     key: 'dashboard',
        //     icon: <AppstoreOutlined />
        // },
        ...(user?.role !== "EMPLOYEE" ? [ // Ẩn menu "Quản lý người dùng" nếu role là EMPLOY
            {
                label: <Link to='/admin/user'>Quản lý người dùng</Link>,
                key: 'user',
                icon: <UserOutlined />
            }
        ] : []),
        {
            label: <Link to='/admin/tree'>Quản lý cây</Link>,
            key: 'tree',
            icon: <IoLeafOutline />
        },
        {
            label: <Link to='/admin/feedback'>Quản lý phản ánh</Link>,
            key: 'feedback',
            icon: <VscFeedback />
        },

        ...(user?.role !== "EMPLOYEE" ? [
            {
                label: <Link to='/admin/task'>Quản lý công việc</Link>,
                key: 'task',
                icon: <FaTasks />
            }
        ] : []),
        ...(user?.role == "EMPLOYEE" ? [
            {
                label: <Link to='/admin/employee-task'>Nhiệm vụ</Link>,
                key: 'employee-task',
                icon: <FaTasks />
            }
        ] : []),


    ];

    const itemsDropdown = [
        {
            label: (
                <label
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                        Modal.info({
                            title: 'Thông tin',
                            content: 'Chức năng đang được hoàn thiện.',
                            okText: 'Đóng',
                        })
                    }
                >
                    Quản lý tài khoản
                </label>
            ),
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer', color: "red" }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;
    //chỉ return trang chặn khi người dùng cố tình truy cập vào
    if (isAuthenticated === false) {
        return (
            <Outlet />
        )
    }

    if (isAuthenticated === true && location.pathname.includes("admin") === true) {
        if (user?.role === "USER") {
            return (
                <Outlet />
            )
        }
    }

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        {collapsed === false ? <>Xin chào: <strong>{user?.name}</strong></> : <>{user?.role === "ADMIN" ? <>ADMIN</> : <>NHÂN VIÊN</>}</>}
                    </div>
                    <hr />
                    <br />
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",
                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                <Avatar src={urlAvatar} />
                                {user?.name}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{
                        padding: '20px',
                        textAlign: 'center',
                        backgroundColor: '#f0f2f5',
                        color: '#3c3c3c',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
                        borderTop: '1px solid #e8e8e8',
                        letterSpacing: '0.5px'
                    }}>
                        Quản lý cây xanh <span style={{ color: '#389e0d' }}>&copy;</span> {import.meta.env.VITE_TENTACGIA} - Trường Đại học Hồng Đức <HeartTwoTone twoToneColor="#eb2f96" />
                    </Footer>
                </Layout>
            </Layout>

        </>
    );
};

export default LayoutAdmin;