// components
import { PageHeading } from "@/components/shared"

type CollectionsLayoutProps = {
  upload: React.ReactNode
  manage: React.ReactNode
  children: React.ReactNode
}

const CollectionsLayout = ({ upload, manage, children }: CollectionsLayoutProps) => {
  return (
    <>
      <PageHeading title="Collections" />

      <div className="page-wrapper">
        <div className="my-8 flex flex-col flex-wrap items-center justify-evenly gap-x-10 gap-y-8 lg:flex-row">
          {upload}
          {manage}
        </div>

        {children}
      </div>
    </>
  )
}

export default CollectionsLayout
