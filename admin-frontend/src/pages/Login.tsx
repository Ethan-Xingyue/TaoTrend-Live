import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message, Card } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { adminLogin } from '../api/services'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const res = await adminLogin(values) as any
      if (res.code === 0) {
        message.success('登录成功')
        navigate('/admin/dashboard')
      } else {
        message.error(res.msg || '登录失败')
      }
    } catch {
      message.error('登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #0a0a0d 70%)',
      }}
    >
      <Card
        style={{
          width: 400,
          background: 'rgba(20, 20, 20, 0.8)',
          border: '1px solid #333',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #a855f7, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TaoTrend Admin
          </h1>
          <p style={{ color: '#888', marginTop: 8 }}>电商直播数据分析管理后台</p>
        </div>

        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              style={{ background: '#1a1a1a', border: '1px solid #333' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              style={{ background: '#1a1a1a', border: '1px solid #333' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                border: 'none',
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>
          <p>测试账号：admin / admin888</p>
          <p>或：root / root</p>
        </div>
      </Card>
    </div>
  )
}
