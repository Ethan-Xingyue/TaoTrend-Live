import { useState, useEffect } from 'react'
import { Table, Input, Button, Space, Popconfirm, message, Tag, Select, Modal, Form, InputNumber } from 'antd'
import { SearchOutlined, DeleteOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons'
import { getProducts, updateProduct, deleteProduct, getCategories } from '../api/services'

export default function ProductList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [editModal, setEditModal] = useState({ open: false, record: null as any })
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getProducts({ page, size: 20, keyword }) as any
      setData(res.list || [])
      setTotal(res.total || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await getCategories() as any
      setCategories(res.list || [])
    } catch {}
  }

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [page, keyword])

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id)
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
      await updateProduct(editModal.record.id, values)
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
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'category_name',
      key: 'category_name',
      width: 100,
      render: (v: string) => <Tag color="purple">{v || '-'}</Tag>,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      width: 100,
      render: (v: number) => <Tag color="cyan">{v.toLocaleString()}</Tag>,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
      render: (v: number) => v.toFixed(1),
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
            title="确定删除该商品？"
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
            placeholder="搜索商品名称或品牌"
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
        title="编辑商品"
        open={editModal.open}
        onOk={handleSave}
        onCancel={() => setEditModal({ open: false, record: null })}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brand" label="品牌">
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="品类">
            <Select>
              {categories.map((c: any) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="价格">
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sales" label="销量">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="rating" label="评分">
            <InputNumber min={0} max={5} precision={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
