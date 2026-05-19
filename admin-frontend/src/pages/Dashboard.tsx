import { useState, useEffect } from 'react'
import { Spin, Empty } from 'antd'
import ReactECharts from 'echarts-for-react'
import { getDashboard } from '../api/services'

type Accent = 'pulse' | 'flame' | 'cyan' | 'lime' | 'amber'

const ACCENT_COLOR: Record<Accent, string> = {
  pulse: '#a855f7',
  flame: '#f43f5e',
  cyan: '#0ea5e9',
  lime: '#84cc16',
  amber: '#fbbf24',
}
const ACCENT_GLOW: Record<Accent, string> = {
  pulse: 'rgba(168,85,247,0.45)',
  flame: 'rgba(244,63,94,0.45)',
  cyan: 'rgba(14,165,233,0.45)',
  lime: 'rgba(132,204,22,0.45)',
  amber: 'rgba(251,191,36,0.45)',
}

const palette = ['#a855f7', '#f43f5e', '#0ea5e9', '#84cc16', '#fbbf24', '#c084fc', '#fda4af', '#22d3ee']

const platformColors: Record<string, string> = {
  taobao: '#f43f5e',
  douyin: '#a855f7',
  pdd:    '#fbbf24',
  淘宝:    '#f43f5e',
  抖音:    '#a855f7',
  拼多多:  '#fbbf24',
}

/* ----- KPI Tile (复刻用户端 <KpiTile>) ----- */
function KpiTile({
  eyebrow,
  value,
  unit,
  prefix,
  hint,
  index,
  accent = 'pulse',
  formatValue,
}: {
  eyebrow: string
  value: number
  unit?: string
  prefix?: string
  hint?: string
  index: number
  accent?: Accent
  formatValue?: (v: number) => string
}) {
  const color = ACCENT_COLOR[accent]
  const glow = ACCENT_GLOW[accent]
  const display = formatValue
    ? formatValue(value)
    : value.toLocaleString('en-US')

  return (
    <div
      className="u-corner-ticks"
      style={{
        position: 'relative',
        background: 'var(--ink-850)',
        border: '1px solid var(--hairline-soft)',
        borderRadius: 12,
        padding: '24px 24px 22px',
        minHeight: 152,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          className="u-eyebrow"
          style={{
            color: 'var(--text-3)',
            fontSize: 11,
            letterSpacing: 1.6,
            lineHeight: 1.2,
          }}
        >
          {eyebrow}
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-4)',
            letterSpacing: 1,
          }}
        >
          #{String(index).padStart(2, '0')}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          marginTop: 12,
        }}
      >
        {prefix && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 600,
              color: 'var(--text-2)',
            }}
          >
            {prefix}
          </span>
        )}
        <span className="u-kpi-numeric" style={{ fontSize: 44 }}>
          {display}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              fontWeight: 500,
              color: 'var(--text-3)',
              marginLeft: 4,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {hint && (
        <div
          style={{
            marginTop: 12,
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}
        >
          {hint}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 0,
          height: 2,
          background: `linear-gradient(90deg, ${color} 0%, transparent 60%)`,
          opacity: 0.55,
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 36,
          height: 36,
          pointerEvents: 'none',
          background: `radial-gradient(circle at top right, ${glow}, transparent 70%)`,
        }}
      />
    </div>
  )
}

/* ----- ChartCard (复刻用户端 <ChartCard>) ----- */
function ChartCard({
  eyebrow,
  title,
  option,
  height = 320,
  loading = false,
  empty = false,
}: {
  eyebrow: string
  title: string
  option: any
  height?: number
  loading?: boolean
  empty?: boolean
}) {
  return (
    <div
      style={{
        background: 'var(--ink-850)',
        border: '1px solid var(--hairline-soft)',
        borderRadius: 12,
        padding: '20px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid var(--hairline-soft)',
        }}
      >
        <div>
          <div className="u-eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: 'var(--on-primary)',
            }}
          >
            {title}
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin />
        </div>
      ) : empty ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
      ) : (
        <ReactECharts option={option} style={{ height }} />
      )}
    </div>
  )
}

/* ----- 共用 ECharts 暗色基础 ----- */
const baseDarkOption = {
  backgroundColor: 'transparent',
  textStyle: { color: '#a1a1aa', fontFamily: 'Inter Tight, system-ui, sans-serif' },
  tooltip: {
    backgroundColor: 'rgba(16,16,21,0.92)',
    borderColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    textStyle: { color: '#f5f5f7' },
  },
  legend: {
    textStyle: { color: '#a1a1aa', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
  },
}
const darkAxis = {
  axisLabel: { color: '#71717a', fontSize: 11 },
  axisLine: { lineStyle: { color: 'rgba(255,255,255,0.10)' } },
  axisTick: { lineStyle: { color: 'rgba(255,255,255,0.10)' } },
  splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
}
const pulseFlameGradient = {
  type: 'linear',
  x: 0, y: 0, x2: 0, y2: 1,
  colorStops: [
    { offset: 0, color: 'rgba(168,85,247,0.35)' },
    { offset: 1, color: 'rgba(168,85,247,0.00)' },
  ],
}

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
      <div style={{ textAlign: 'center', padding: 120 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) return null

  const { stats, gmv_trend, platform_dist } = data

  /* ----- GMV trend ----- */
  const trendOption = {
    ...baseDarkOption,
    grid: { left: 56, right: 24, top: 24, bottom: 36 },
    tooltip: {
      ...baseDarkOption.tooltip,
      trigger: 'axis' as const,
      valueFormatter: (v: any) => `¥${(Number(v) / 1e4).toFixed(1)} 万`,
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: gmv_trend?.map((d: any) => d.date) || [],
      ...darkAxis,
    },
    yAxis: {
      type: 'value' as const,
      ...darkAxis,
      axisLabel: { ...darkAxis.axisLabel, formatter: (v: number) => `${(v / 1e4).toFixed(0)}万` },
    },
    series: [
      {
        name: 'GMV',
        data: gmv_trend?.map((d: any) => d.gmv) || [],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#a855f7', width: 2 },
        itemStyle: { color: '#a855f7', borderColor: '#fff', borderWidth: 1 },
        areaStyle: { color: pulseFlameGradient },
        emphasis: { focus: 'series' },
      },
    ],
  }

  /* ----- Platform donut ----- */
  const platformOption = {
    ...baseDarkOption,
    color: platform_dist?.map((d: any) => platformColors[d.platform] || '#a855f7'),
    tooltip: { ...baseDarkOption.tooltip, trigger: 'item' as const, formatter: '{b} · {d}%' },
    legend: {
      ...baseDarkOption.legend,
      orient: 'horizontal' as const,
      bottom: 8,
      icon: 'circle' as const,
    },
    series: [
      {
        type: 'pie',
        radius: ['56%', '78%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#0a0a0d',
          borderWidth: 3,
        },
        label: { show: false },
        data: platform_dist?.map((d: any) => ({
          name: d.platform,
          value: d.gmv,
        })) || [],
      },
    ],
  }

  void palette // 留作未来扩展（如品类玫瑰图）

  return (
    <div>
      {/* ============ PageHero ============ */}
      <section
        style={{
          padding: '48px 0 56px',
          borderBottom: '1px solid var(--hairline)',
          marginBottom: 32,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div
              className="u-eyebrow"
              style={{
                marginBottom: 14,
                color: 'var(--accent-pulse)',
                fontWeight: 600,
                letterSpacing: 1.8,
              }}
            >
              01·OVERVIEW · ADMIN
            </div>
            <h1 className="u-display-xxl" style={{ margin: 0 }}>
              ADMIN CONSOLE
            </h1>
            <p
              className="text-body"
              style={{
                marginTop: 20,
                marginBottom: 0,
                maxWidth: 640,
                color: 'var(--text-2)',
              }}
            >
              TaoTrend 运营后台总览 · 实时跟踪用户、商品、主播、直播与 GMV 关键指标。
            </p>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              border: '1px solid var(--hairline-strong)',
              background: 'rgba(168,85,247,0.08)',
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              color: 'var(--text-1)',
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: 8,
                height: 8,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'var(--accent-pulse)',
                  opacity: 0.7,
                  animation: 'tt-ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--accent-pulse)',
                }}
              />
            </span>
            LIVE · ADMIN
          </span>
        </div>
      </section>

      {/* ============ Row 1 — 4 KPI ============ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <KpiTile
          eyebrow="K-01 · USERS"
          value={stats.total_users}
          unit="人"
          accent="pulse"
          index={1}
          hint="注册用户总数"
        />
        <KpiTile
          eyebrow="K-02 · PRODUCTS"
          value={stats.total_products}
          unit="件"
          accent="pulse"
          index={2}
          hint="入库 SKU"
        />
        <KpiTile
          eyebrow="K-03 · ANCHORS"
          value={stats.total_anchors}
          unit="人"
          accent="pulse"
          index={3}
          hint="活跃主播"
        />
        <KpiTile
          eyebrow="K-04 · STREAMS"
          value={stats.total_streams}
          unit="场"
          accent="pulse"
          index={4}
          hint="历史直播场次"
        />
      </div>

      {/* ============ Row 2 — 4 KPI (commerce) ============ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiTile
          eyebrow="K-05 · TOTAL GMV"
          value={stats.total_gmv / 1e8}
          prefix="¥"
          unit="亿"
          accent="pulse"
          index={5}
          hint="累计成交额"
          formatValue={(v) => v.toFixed(2)}
        />
        <KpiTile
          eyebrow="K-06 · TODAY GMV"
          value={stats.today_gmv / 1e4}
          prefix="¥"
          unit="万"
          accent="flame"
          index={6}
          hint="今日 GMV"
          formatValue={(v) => v.toFixed(0)}
        />
        <KpiTile
          eyebrow="K-07 · FAVORITES"
          value={stats.total_favorites}
          unit="次"
          accent="cyan"
          index={7}
          hint="收藏总数"
        />
        <KpiTile
          eyebrow="K-08 · BROWSE"
          value={stats.total_browse}
          unit="次"
          accent="lime"
          index={8}
          hint="浏览记录"
        />
      </div>

      {/* ============ Row 3 — trend + platform pie ============ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
          gap: 24,
        }}
      >
        <ChartCard
          eyebrow="CHART · C-01"
          title="GMV TREND · 7 DAYS"
          option={trendOption}
          height={340}
          empty={!gmv_trend?.length}
        />
        <ChartCard
          eyebrow="CHART · C-02"
          title="PLATFORM SHARE"
          option={platformOption}
          height={340}
          empty={!platform_dist?.length}
        />
      </div>
    </div>
  )
}
