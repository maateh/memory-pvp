// components
import { PageHeading } from "@/components/shared"

type CollectionsLayoutProps = {
  children: React.ReactNode
}

const CollectionsLayout = ({ children }: CollectionsLayoutProps) => {
  return (
    <>
      <PageHeading title="Collections" />

      <div className="page-wrapper">
        {children}
      </div>
    </>
  )
}

export default CollectionsLayout
