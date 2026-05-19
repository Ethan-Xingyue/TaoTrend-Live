import { useState, useEffect } from 'react'
import { Table, Input, Button, Space, Popconfirm, message, Tag, Select, Modal, Form, InputNumber } from 'antd'
import { SearchOutlined, DeleteOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons'
import { getAnchors, updateAnchor, deleteAnchor } from '../api/services'

const platformColors: Record<string, string> = {
  taobao: 'orange',
  douyin: 'red',
  pdd: 'volcano',
}

export default function AnchorList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [platform, setPlatform] = useState('')
  const [editModal, setEditModal] = useState({ open: false, record: null as any })
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAnchors({ page, size: 20, keyword, platform }) as any
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
  }, [page, keyword, platform])

  const handleDelete = async (id: number) => {
    try {
      await deleteAnchor(id)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const handleEdit = (record: any) => {
    form.setFieldsValue(record)
    setEditModal({ open: true, record })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await updateAnchor(editModal.record.id, values)
      message.success('更新成功')
      setEditModal({ open: false, record: null })
      fetchData()
    } catch {}
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 150,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      render: (v: string) => (
        <Tag color={platformColors[v] || 'default'}>{v.toUpperCase()}</Tag>
      ),
    },
    {
      title: '粉丝数',
      dataIndex: 'fans',
      key: 'fans',
      width: 120,
      render: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(1)}万` : v,
    },
    {
      title: '平均 GMV',
      dataIndex: 'avg_gmv',
      key: 'avg_gmv',
      width: 120,
      render: (v: number) => `¥${(v / 10000).toFixed(1)}万`,
    },
    {
      title: '退货率',
      dataIndex: 'return_rate',
      key: 'return_rate',
      width: 100,
      render: (v: number) => (
        <Tag color={v > 0.2 ? 'red' : 'green'}>{(v * 100).toFixed(1)}%</Tag>
      ),
    },
    {
      title: '直播场次',
      dataIndex: 'livestream_count',
      key: 'livestream_count',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该主播？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            placeholder="搜索主播昵称"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={fetchData}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="选择平台"
            value={platform || undefined}
            onChange={(v) => setPlatform(v || '')}
            style={{ width: 120 }}
            allowClear
          >
            <Select.Option value="taobao">淘宝</Select.Option>
            <Select.Option value="douyin">抖音</Select.Option>
            <Select.Option value="pdd">拼多多</Select.Option>
          </Select>
        </Space>
        <Button icon={<ReloadOutlined />} onClick={fetchData}>
          刷新
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          onChange: setPage,
          showTotal: (t) => `共 ${t} 条`,
        }}
      />

      <Modal
        title="编辑主播"
        open={editModal.open}
        onOk={handleSave}
        onCancel={() => setEditModal({ open: false, record: null })}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="taobao">淘宝</Select.Option>
              <Select.Option value="douyin">抖音</Select.Option>
              <Select.Option value="pdd">拼多多</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="fans" label="粉丝数">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="avg_gmv" label="平均 GMV">
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="return_rate" label="退货率">
            <InputNumber min={0} max={1} precision={3} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
