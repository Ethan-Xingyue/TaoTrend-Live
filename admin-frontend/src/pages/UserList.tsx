import { useState, useEffect } from 'react'
import { Table, Input, Button, Space, Popconfirm, message, Tag } from 'antd'
import { SearchOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getUsers, deleteUser } from '../api/services'

export default function UserList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getUsers({ page, size: 20, keyword }) as any
      setData(res.list || [])
      setTotal(res.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, keyword])

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 150,
    },
    {
      title: '收藏数',
      dataIndex: 'favorites_count',
      key: 'favorites_count',
      width: 100,
      render: (v: number) => <Tag color="purple">{v}</Tag>,
    },
    {
      title: '浏览数',
      dataIndex: 'browse_count',
      key: 'browse_count',
      width: 100,
      render: (v: number) => <Tag color="cyan">{v}</Tag>,
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定删除该用户？"
          onConfirm={() => handleDelete(record.user_id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="搜索用户ID或用户名"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={fetchData}
            style={{ width: 250 }}
            allowClear
          />
        </Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          刷新
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="user_id"
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          onChange: setPage,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />
    </div>
  )
}
