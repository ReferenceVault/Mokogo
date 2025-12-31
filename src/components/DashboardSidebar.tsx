import { Menu, LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface SidebarMenuItem {
  id: string
  label: string
  icon: LucideIcon
  badge?: number
  onClick: () => void
}

interface DashboardSidebarProps {
  title: string
  collapsed: boolean
  onToggleCollapse: () => void
  menuItems: SidebarMenuItem[]
  activeView: string
  quickFilters?: Array<{
    label: string
    icon: LucideIcon
    onClick: () => void
  }>
  ctaSection?: ReactNode
  collapsedCtaButton?: {
    icon: LucideIcon
    onClick: () => void
    title: string
  }
}

const DashboardSidebar = ({
  title,
  collapsed,
  onToggleCollapse,
  menuItems,
  activeView,
  quickFilters,
  ctaSection,
  collapsedCtaButton
}: DashboardSidebarProps) => {
  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} min-h-screen bg-white/80 backdrop-blur-md border-r border-orange-200/50 sticky top-16 shadow-sm transition-all duration-300`}>
      <div className={`p-6 ${collapsed ? 'px-3' : ''}`}>
        <div className="mb-8">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4`}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
            )}
            <button 
              onClick={onToggleCollapse}
              className={`text-gray-500 hover:text-orange-500 transition-colors duration-300 p-2 rounded-lg hover:bg-orange-50 ${collapsed ? '' : 'ml-auto'}`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              
              return (
                <button 
                  key={item.id}
                  onClick={item.onClick}
                  className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg shadow-orange-500/30'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'}`} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive 
                        ? 'bg-white/30 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        
        {!collapsed && quickFilters && quickFilters.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">Quick Filters</h3>
            <div className="space-y-1.5">
              {quickFilters.map((filter, index) => {
                const Icon = filter.icon
                return (
                  <button 
                    key={index}
                    onClick={filter.onClick}
                    className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-300 group"
                  >
                    <Icon className="w-3.5 h-3.5 mr-3 text-gray-500 group-hover:text-orange-500" />
                    <span>{filter.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        
        {!collapsed && ctaSection && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {ctaSection}
          </div>
        )}
        
        {collapsed && collapsedCtaButton && (
          <div className="mt-8">
            <button 
              onClick={collapsedCtaButton.onClick}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              title={collapsedCtaButton.title}
            >
              {(() => {
                const Icon = collapsedCtaButton.icon
                return <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              })()}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default DashboardSidebar

