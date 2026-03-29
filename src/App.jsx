import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HomeFeed from './pages/HomeFeed.jsx'
import Create from './pages/Create.jsx'
import Profile from './pages/Profile.jsx'
import PlanDetail from './pages/PlanDetail.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const [activeTab, setActiveTab]       = useState('home')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showCreate, setShowCreate]     = useState(false)
  const [savedPlans, setSavedPlans]     = useState([])
  const [myPlans, setMyPlans]           = useState([])
  const [sharedPlans, setSharedPlans]   = useState([])

  const handlePlanCreated = (plan) => {
    setMyPlans(prev => [plan, ...prev])
    setShowCreate(false)
    setSelectedPlan(plan)
    setActiveTab('plan-detail')
  }

  const handleSavePlan = (plan) => {
    setSavedPlans(prev => {
      const exists = prev.find(p => p.id === plan.id)
      return exists ? prev.filter(p => p.id !== plan.id) : [plan, ...prev]
    })
  }

  const handleShareToFeed = (plan) => {
    setSharedPlans(prev => {
      const exists = prev.find(p => p.id === plan.id)
      if (exists) return prev
      return [plan, ...prev]
    })
  }

  const isSharedToFeed = (planId) => sharedPlans.some(p => p.id === planId)

  const handleViewPlan = (plan) => { setSelectedPlan(plan); setActiveTab('plan-detail') }
  const handleBack     = () => { setSelectedPlan(null); setActiveTab('home') }

  const pv = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } }
  const pt = { type: 'tween', duration: 0.25, ease: 'easeInOut' }

  return (
    <div className="flex flex-col min-h-svh bg-[var(--color-bg)] max-w-[430px] mx-auto relative overflow-x-hidden w-full">
      <AnimatePresence mode="wait">
        {activeTab === 'plan-detail' && selectedPlan ? (
          <motion.div key="plan-detail" {...pv} transition={pt} className="flex-1 flex flex-col overflow-x-hidden">
            <PlanDetail
              plan={selectedPlan}
              onBack={handleBack}
              onSave={handleSavePlan}
              savedPlans={savedPlans}
              onShareToFeed={handleShareToFeed}
              isSharedToFeed={isSharedToFeed(selectedPlan?.id)}
            />
          </motion.div>
        ) : activeTab === 'home' ? (
          <motion.div key="home" {...pv} transition={pt} className="flex-1 flex flex-col overflow-x-hidden">
            <HomeFeed
              onViewPlan={handleViewPlan}
              savedPlans={savedPlans}
              onSavePlan={handleSavePlan}
              sharedPlans={sharedPlans}
            />
          </motion.div>
        ) : activeTab === 'profile' ? (
          <motion.div key="profile" {...pv} transition={pt} className="flex-1 flex flex-col overflow-x-hidden">
            <Profile myPlans={myPlans} savedPlans={savedPlans} onViewPlan={handleViewPlan} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {activeTab !== 'plan-detail' && (
        <BottomNav active={activeTab} onTabChange={setActiveTab} onCreatePress={() => setShowCreate(true)} />
      )}

      <AnimatePresence>
        {showCreate && (
          <Create onClose={() => setShowCreate(false)} onPlanCreated={handlePlanCreated} />
        )}
      </AnimatePresence>
    </div>
  )
}
