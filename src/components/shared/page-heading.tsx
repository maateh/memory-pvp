type PageHeadingProps = {
  heading: string
}

const PageHeading = ({ heading }: PageHeadingProps) => {
  return (
    <div className="page-header">
      <h1 className="page-heading">
        {heading}
      </h1>
    </div>
  )
}

export default PageHeading
