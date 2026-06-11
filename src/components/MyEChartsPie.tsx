import { useEffect, useRef, useCallback, memo } from 'react'

import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent 
} from 'echarts/components'
echarts.use([
  TitleComponent,
  TooltipComponent,
  PieChart,
  CanvasRenderer
])

const MyEChartsPie = memo((
  { 
    className = 'MyEChartsPie',
    style = { width: '100%', height: '360px' },
    title = { text: '', subtext: ''},
    data = [],
    radius = '50%'
  }
  : { 
      className?: string,
      style?: {height: string, width: string}, 
      title?: {text?: string, subtext?: string},
      data: {value: number, name: string}[],
      radius?: string
    }
) => {
  // 图表dom容器ref
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  // 渲染图表
  const renderChart = useCallback(() => {
    // 初始化图表实例
    if (!chartRef.current) return
    chartInstanceRef.current = echarts.init(chartRef.current)

    const option = {
      title: { text: title.text, subtext: title.subtext, left: 'center'},
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '库存数量',
          type: 'pie',
          radius,
          data,
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
          }
        }
      ],
      color: [
        '#607890',
        '#8297AB',
        '#A0B2C2',
        '#B4C4B0',
        '#9A8C98',
        '#C9ADA7',
        '#738CA6',
        '#A9C4B8'
      ]
    }
    // 设置图表选项
    chartInstanceRef.current.setOption(option)
  }, [title, data, radius])
  // 图表自适应
  const resize = () => chartInstanceRef.current?.resize()

  useEffect(() => {
    // 初始化图表
    renderChart()
    window.addEventListener('resize', resize)
    return () => {
      // 销毁清理
      window.removeEventListener('resize', resize)
      chartInstanceRef.current?.dispose()
    }
  }, [renderChart])

  return (
    <div className={className} ref={chartRef} style={style} />
  )
})

export default MyEChartsPie
