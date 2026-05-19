import { useState, useEffect } from 'react'
import { Table, Input, Button, Space, Popconfirm, message, Tag, Select } from 'antd'
import { SearchOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getLivestreams, deleteLivestream } from '../api/services'

const platformColors: Record<string, string> = {
  taobao: 'orange',
  douyin: 'red',
  pdd: 'volcano',
}

export default function LivestreamList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [platform, setPlatform] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getLivestreams({ page, size: 20, keyword, platform }) as any
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
      await deleteLivestream(id)
      message.success('删除成功')
      fetchData()
    } catch {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '直播标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
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
      title: '主播',
      dataIndex: 'anchor_name',
      key: 'anchor_name',
      width: 120,
    },
    {
      title: '开播时间',
      dataIndex: 'start_at',
      key: 'start_at',
      width: 160,
      render: (v: string) => v ? new Date(v).toLocaleString('zh-CN') : '-',
    },
    {
      title: '时长',
      dataIndex: 'duration_min',
      key: 'duration_min',
      width: 80,
      render: (v: number) => `${v}分钟`,
    },
    {
      title: '峰值观众',
      dataIndex: 'peak_audience',
      key: 'peak_audience',
      width: 100,
      render: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(1)}万` : v,
    },
    {
      title: 'GMV',
      dataIndex: 'gmv',
      key: 'gmv',
      width: 120,
      render: (v: number) => `¥${(v / 10000).toFixed(1)}万`,
    },
    {
      title: '转化率',
      dataIndex: 'conversion_rate',
      key: 'conversion_rate',
      width: 100,
      render: (v: number) => (
        <Tag color={v > 0.1 ? 'green' : 'default'}>{(v * 100).toFixed(1)}%</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定删除该直播？"
          onConfirm={() => handleDelete(record.id)}
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
            placeholder="搜索直播标题"
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
        scroll={{ x: 1200 }}
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
