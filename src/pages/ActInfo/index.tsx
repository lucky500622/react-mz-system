import '@/pages/ActInfo/index.scss'
import ActTable from '@/pages/ActInfo/components/ActTabs'

const ActInfo = () => {
  return (
    <div className="ActInfo">
      <div className="top-bar">
        <h2>活动信息</h2>
      </div>
      <ActTable />
    </div>
  )
}

export default ActInfo
