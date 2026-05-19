import { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Spin } from 'antd'
import {
  UserOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  RiseOutlined,
  HeartOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { getDashboard } from '../api/services'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await getDashboard() as any
      setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) return null

  const { stats, gmv_trend, platform_dist } = data

  const trendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
    },
    xAxis: {
      type: 'category' as const,
      data: gmv_trend?.map((d: any) => d.date) || [],
      axisLabel: { color: '#888' },
      axisLine: { lineStyle: { color: '#333' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#888' },
      splitLine: { lineStyle: { color: '#222' } },
    },
    series: [
      {
        data: gmv_trend?.map((d: any) => d.gmv) || [],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#a855f7', width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(168, 85, 247, 0.3)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0)' },
            ],
          },
        },
      },
    ],
  }

  const platformOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
    },
    legend: {
      bottom: 10,
      textStyle: { color: '#888' },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a0a0d',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 16, color: '#fff' },
        },
        data: platform_dist?.map((d: any) => ({
          name: d.platform,
          value: d.gmv,
        })) || [],
      },
    ],
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24, color: '#e0e0e0' }}>数据概览</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_users}</div>
            <div className="stat-label">注册用户</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_products.toLocaleString()}</div>
            <div className="stat-label">商品数量</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_anchors}</div>
            <div className="stat-label">主播数量</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_streams.toLocaleString()}</div>
            <div className="stat-label">直播场次</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">¥{(stats.total_gmv / 100000000).toFixed(1)}亿</div>
            <div className="stat-label">总 GMV</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">¥{(stats.today_gmv / 10000).toFixed(0)}万</div>
            <div className="stat-label">今日 GMV</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_favorites.toLocaleString()}</div>
            <div className="stat-label">收藏总数</div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_browse.toLocaleString()}</div>
            <div className="stat-label">浏览记录</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="近7天 GMV 趋势" style={{ background: '#141414', border: '1px solid #333' }}>
            <ReactECharts option={trendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="平台 GMV 分布" style={{ background: '#141414', border: '1px solid #333' }}>
            <ReactECharts option={platformOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
