import { Component } from 'react'
import type { ReactNode } from 'react'

import { Button, Result } from 'antd'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] 捕获到渲染错误:', error)
    console.error('[ErrorBoundary] 组件堆栈:', info.componentStack)
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="页面出错了"
          subTitle="抱歉，页面遇到了意外错误，请尝试刷新或返回首页。"
          extra={[
            <Button key="refresh" type="primary" onClick={this.handleRefresh}>
              刷新页面
            </Button>,
            <Button key="home" onClick={this.handleGoHome}>
              返回首页
            </Button>
          ]}
        >
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              textAlign: 'left',
              maxHeight: 200,
              overflow: 'auto',
              marginTop: 16
            }}>
              {this.state.error.message}
            </pre>
          )}
        </Result>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary