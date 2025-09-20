import { Outlet } from 'react-router-dom'

const CenteredLayout = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
        <Outlet/>
    </div>
  )
}

export default CenteredLayout;