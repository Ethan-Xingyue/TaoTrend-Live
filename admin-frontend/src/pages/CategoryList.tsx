import { useState, useEffect } from 'react'
import { Table, Button, Space, message, Tag, Card } from 'antd'
import { ReloadOutlined, AppstoreOutlined } from '@ant-design/icons'
import { getCategories } from '../api/services'

export default function CategoryList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getCategories() as any
      setData(res.list || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '品类名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (v: string, record: any) => (
        <Space>
          <span style={{ fontSize: 18 }}>{record.icon_glyph}</span>
          <span>{v}</span>
        </Space>
      ),
    },
    {
      title: '父品类ID',
      dataIndex: 'parent_id',
      key: 'parent_id',
      width: 120,
      render: (v: number | null) => v ? <Tag>{v}</Tag> : <Tag color="default">顶级</Tag>,
    },
    {
      title: '商品数量',
      dataIndex: 'product_count',
      key: 'product_count',
      width: 120,
      render: (v: number) => <Tag color="purple">{v}</Tag>,
    },
  ]

  // 按父品类分组
  const topCategories = data.filter(c => !c.parent_id)
  const subCategories = data.filter(c => c.parent_id)

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ color: '#e0e0e0' }}>品类管理</h3>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          刷新
        </Button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h4 style={{ color: '#888', marginBottom: 12 }}>一级品类</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {topCategories.map((cat) => (
            <Card
              key={cat.id}
              size="small"
              style={{
                background: '#141414',
                border: '1px solid #333',
                width: 180,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon_glyph}</div>
                <div style={{ fontWeight: 600 }}>{cat.name}</div>
                <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
                  {cat.product_count} 件商品
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <h4 style={{ color: '#888', marginBottom: 12 }}>全部品类</h4>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  )
}
