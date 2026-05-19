import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, message } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  LiveOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { adminCheck, adminLogout } from '../api/services'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '数据大屏' },
  { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/admin/products', icon: <ShoppingOutlined />, label: '商品管理' },
  { key: '/admin/anchors', icon: <VideoCameraOutlined />, label: '主播管理' },
  { key: '/admin/livestreams', icon: <LiveOutlined />, label: '直播管理' },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: '品类管理' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await adminCheck() as any
      if (!res.logged_in) {
        navigate('/login')
      } else {
        setUsername(res.username)
      }
    } catch {
      navigate('/login')
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    message.success('已退出登录')
    navigate('/login')
  }

  const userMenu = {
    items: [
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#0d0d0d',
          borderRight: '1px solid #222',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #222',
          }}
        >
          <span
            style={{
              fontSize: collapsed ? 16 : 20,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #a855f7, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {collapsed ? 'TT' : 'TaoTrend'}
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#0d0d0d',
            borderBottom: '1px solid #222',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#fff' }}
          />
          <Dropdown menu={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#a855f7' }} />
              <span style={{ color: '#e0e0e0' }}>{username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#0a0a0d',
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
