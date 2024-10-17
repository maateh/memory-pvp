// shadcn
import { Separator } from "@/components/ui/separator"

type BaseGameSummaryLayoutProps = {
  children: React.ReactNode
}

const BaseGameSummaryLayout = ({ children }: BaseGameSummaryLayoutProps) => {
  return (
    <>
      <header className="mt-4">
        <h1 className="pt-1 w-fit mx-auto text-3xl font-heading font-bold small-caps heading-decorator sm:text-5xl">
          Session Results
        </h1>
      </header> 

      <Separator className="w-3/4 mx-auto mt-4 mb-6 bg-border/50" />

      <main className="flex-1 mx-auto px-2.5 sm:px-4">
        {children}
      </main>
    </>
  )
}

export default BaseGameSummaryLayout
