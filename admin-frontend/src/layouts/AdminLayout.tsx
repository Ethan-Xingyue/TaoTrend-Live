import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Dropdown, Modal, message } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { adminCheck, adminLogout } from '../api/services'

const { Header, Sider, Content } = Layout

const menuItems: NonNullable<MenuProps['items']> = [
  {
    type: 'group',
    label: '01 · CONTROL',
    children: [
      { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'DASHBOARD' },
    ],
  },
  {
    type: 'group',
    label: '02 · CONTENT',
    children: [
      { key: '/admin/products', icon: <ShoppingOutlined />, label: 'PRODUCTS' },
      { key: '/admin/anchors', icon: <VideoCameraOutlined />, label: 'ANCHORS' },
      { key: '/admin/livestreams', icon: <PlayCircleOutlined />, label: 'LIVESTREAMS' },
      { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'CATEGORIES' },
    ],
  },
  {
    type: 'group',
    label: '03 · ACCESS',
    children: [
      { key: '/admin/users', icon: <UserOutlined />, label: 'USERS' },
    ],
  },
]

const titleMap: Record<string, string> = {
  '/admin': 'DASHBOARD',
  '/admin/dashboard': 'DASHBOARD',
  '/admin/products': 'PRODUCTS',
  '/admin/anchors': 'ANCHORS',
  '/admin/livestreams': 'LIVESTREAMS',
  '/admin/categories': 'CATEGORIES',
  '/admin/users': 'USERS',
}

export default function AdminLayout() {
  const [username, setUsername] = useState('')
  const [now, setNow] = useState<string>(() =>
    new Date().toLocaleTimeString('en-GB', { hour12: false }),
  )
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const id = setInterval(
      () => setNow(new Date().toLocaleTimeString('en-GB', { hour12: false })),
      1000,
    )
    return () => clearInterval(id)
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

  const confirmLogout = () =>
    Modal.confirm({
      title: 'SIGN OUT',
      content: '确认退出当前管理会话？',
      okText: 'CONFIRM',
      cancelText: 'CANCEL',
      onOk: async () => {
        await adminLogout()
        message.success('已退出登录')
        navigate('/login')
      },
    })

  const currentTitle = titleMap[location.pathname] ?? 'ADMIN'

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--tt-bg)' }}>
      <Sider
        width={236}
        theme="dark"
        style={{
          overflowY: 'auto',
          borderRight: '1px solid var(--hairline-soft)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
          background: 'var(--tt-bg)',
        }}
      >
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid var(--hairline-soft)',
          }}
        >
          <div className="u-eyebrow" style={{ marginBottom: 6, color: 'var(--pulse-300)' }}>
            TAOTREND · ADMIN
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              lineHeight: 1,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #a855f7, #f43f5e)',
              }}
            />
            OPERATIONS
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 10,
              letterSpacing: 1.4,
              color: 'var(--ink-muted-48)',
              textTransform: 'uppercase',
            }}
          >
            v1.0 · {new Date().toISOString().slice(0, 10)}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, paddingBottom: 80, background: 'transparent' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 20px',
            borderTop: '1px solid var(--hairline-soft)',
            background: 'var(--tt-bg)',
            fontSize: 10,
            letterSpacing: 1.4,
            color: 'var(--ink-muted-48)',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>STATUS · ADMIN</span>
          <span style={{ color: 'var(--lime-500)' }}>● ONLINE</span>
        </div>
      </Sider>

      <Layout style={{ background: 'var(--tt-bg)' }}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            paddingInline: 24,
            background: 'rgba(10,10,13,0.75)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            borderBottom: '1px solid var(--hairline-soft)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div className="u-eyebrow" style={{ whiteSpace: 'nowrap' }}>
              T+ {now}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 1.6,
                textTransform: 'uppercase',
                color: 'var(--on-primary)',
              }}
            >
              {currentTitle}
            </div>
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'SIGN OUT',
                  onClick: confirmLogout,
                },
              ],
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                paddingLeft: 12,
                borderLeft: '1px solid var(--hairline)',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #f43f5e)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: '#fff',
                }}
              >
                {(username || 'A').slice(0, 1).toUpperCase()}
              </span>
              <span className="u-eyebrow-bright" style={{ fontSize: 11 }}>
                {username || 'ADMIN'}
              </span>
              <DownOutlined style={{ fontSize: 8, color: 'var(--ink-muted-80)' }} />
            </span>
          </Dropdown>
        </Header>
        <Content
          style={{
            padding: '24px 32px 64px',
            background: 'var(--tt-bg)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
