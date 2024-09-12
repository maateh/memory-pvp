// constants
import { gameSessionsWidgetInfo } from '@/components/widgets/constants'

// components
import { WidgetCard } from '@/components/widgets'

const SessionsWidgetCard = () => {
  return (
    <WidgetCard
      widgetLink="/dashboard/sessions"
      {...gameSessionsWidgetInfo}
    >
      
    </WidgetCard>
  )
}

export default SessionsWidgetCard
