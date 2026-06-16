import { useRef, useEffect, memo, useCallback, useMemo } from 'react'

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer
])
import dayjs from 'dayjs'

const MyEChartsLine = memo((
  {
    className = 'MyEChartsLine',
    style = { width: '100%', height: '310px' },
    title = { text: '', subtext: '' },
    grid = {left: '3%', right: '4%', bottom: '3%', top: '24%'},
    dataOne = [],
    dataTwo = [],
    dataThree = []
  } :
  {
    className?: string,
    style?: { width?: string, height?: string, paddingTop?: string },
    title?: { text?: string, subtext?: string },
    grid?: { left?: string, right?: string, bottom?: string, top?: string },
    dataOne: number[],
    dataTwo: number[],
    dataThree: number[]
  }
) => {
  // 图表容器
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  // 日期数组
  const dateArray = useMemo(() => {
    const arr = []
    for (let i = 0; i < 7; i++) {
      arr.unshift(dayjs().subtract(i, 'day').format('MM-DD'))
    }
    return arr
  }, [])

  const renderChart = useCallback(() => {
    // 初始化图表实例
    if (!chartRef.current) return
    chartInstanceRef.current = echarts.init(chartRef.current)

    const option = {
      color: [
        '#607890',
        '#A0B2C2',
        '#ffc874ff'
      ],
      title: {
        text: title.text,
        subtext: title.subtext,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.92)',
        textStyle: { color: '#333' }
      },
      grid,
      xAxis: {
        type: 'category',
        data: dateArray,
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        name: '操作件数',
        axisLine: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#666' },
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
      },
      series: [
        {
          name: '入库数量',
          type: 'line',
          lineStyle: { width: 2 },
          data: dataOne,
          emphasis: {
            lineStyle: { width: 3 }
          }
        },
        {
          name: '减少数量',
          type: 'line',
          lineStyle: { width: 2 },
          data: dataTwo,
          emphasis: {
            lineStyle: { width: 3 }
          }
        },
        {
          name: '售出数量',
          type: 'line',
          lineStyle: { width: 2 },
          data: dataThree,
          emphasis: {
            lineStyle: { width: 3 }
          }
        }
      ]
    }
    // 设置图表选项
    chartInstanceRef.current.setOption(option)
  }, [title, grid, dataOne, dataTwo, dataThree, dateArray])
  // 图表自适应
  const handleResize = () => chartInstanceRef.current?.resize()

  useEffect(() => {
    // 初始化图表
    renderChart()
    window.addEventListener('resize', handleResize)
    return () => {
      // 销毁清理
      window.removeEventListener('resize', handleResize)
      chartInstanceRef.current?.dispose()
    }
  }, [renderChart])

  return <div className={className} ref={chartRef} style={style} />
})

export default MyEChartsLine
