// prisma
import type { CardCollection } from "@prisma/client"

// shadcn
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// components
import { CollectionWidgetCard } from "@/components/collection"

const mockedCollection: CardCollection = {
  id: '_id',
  userId: '_userId',
  name: 'My Collection',
  description: 'This is the description of my collection.',
  tableSize: 'SMALL',
  createdAt: new Date(),
  updatedAt: new Date()
}

const CollectionsPage = () => {
  return (
    <Accordion type="single" defaultValue="user-collections">
      <AccordionItem value="user-collections">
        <AccordionTrigger>
          <h2 className="mt-3 text-lg sm:text-2xl font-heading font-medium heading-decorator subheading">
            Your Card Collections
          </h2>
        </AccordionTrigger>
        <AccordionContent>
          {/* TODO: add collection filter */}

          <ul className="widget-container">
            {/* TODO: GET -> user's card collections */}
            {[mockedCollection].map((collection) => (
              <li key={collection.id}>
                <CollectionWidgetCard className="py-1"
                  collection={collection}
                />
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="other-collections">
        <AccordionTrigger>
          <h2 className="mt-3 text-lg sm:text-2xl font-heading font-medium heading-decorator subheading">
            Uploaded by other players
          </h2>
        </AccordionTrigger>
        <AccordionContent>
          {/* TODO: add collection filter */}

          <ul className="widget-container">
            {/* TODO: GET -> card collections */}
            {[mockedCollection].map((collection) => (
              <li key={collection.id}>
                <CollectionWidgetCard className="py-1"
                  collection={collection}
                />
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default CollectionsPage
