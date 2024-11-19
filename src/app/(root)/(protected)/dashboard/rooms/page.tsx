// components
import { Warning } from "@/components/shared"

const WaitingRoomsPage = () => {
  // TODO: design this page, remove modal
  return (
    <Warning className="mt-32 mx-auto text-lg lg:text-xl font-heading"
      messageProps={{ className: "mt-1" }}
      iconProps={{ className: "lg:size-6" }}
      message="Waiting rooms have not been implemented yet."
    />
  )
}

export default WaitingRoomsPage
