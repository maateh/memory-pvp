// server
import { getUserCollections } from "@/server/actions/collection"

// shadcn
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionWidgetList } from "@/components/collection/widget"
import { CollectionFilter, CollectionSort } from "@/components/collection/filter"
import CollectionExplorer from "./collection-explorer"

const CollectionsPage = async () => {
  const userCollections = await getUserCollections()

  return (
    <Accordion type="single" defaultValue="user-collections">
      {userCollections.length > 0 && (
        <AccordionItem value="user-collections">
          <AccordionTrigger>
            <h2 className="mt-3 text-lg sm:text-2xl font-heading font-medium heading-decorator subheading">
              Your Card Collections
            </h2>
          </AccordionTrigger>
          <AccordionContent>
            <CollectionWidgetList collections={userCollections} />
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="other-collections">
        <AccordionTrigger>
          <h2 className="mt-3 text-lg sm:text-2xl font-heading font-medium heading-decorator subheading">
            Uploaded by other players
          </h2>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center gap-x-2">
            <Separator className="w-1.5 h-5 bg-accent rounded-full" />

            <h3 className="mt-1 text-sm font-heading font-normal dark:font-light tracking-wide sm:text-base">
              Filter collections by
            </h3>
          </div>

          <div className="mt-1 mb-6 flex items-center gap-x-2 sm:gap-x-3.5">
            <CollectionSort />
            <CollectionFilter />
          </div>

          <CollectionExplorer excludeUser />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CollectionsPage
