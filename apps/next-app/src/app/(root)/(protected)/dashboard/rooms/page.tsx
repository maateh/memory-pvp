// icons
import { Wrench } from "lucide-react"

// components
import { NoListingData } from "@/components/shared"

const WaitingRoomsPage = () => {
  return (
    <NoListingData className="mt-44"
      Icon={Wrench}
      message="Waiting rooms have not been implemented yet."
      hideClearFilter
    />
  )
}

export default WaitingRoomsPage
