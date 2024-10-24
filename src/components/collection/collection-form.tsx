"use client"

import { useState } from "react"

// components
import { CollectionDropzone } from "@/components/inputs"

const CollectionForm = () => {
  const [files, setFiles] = useState<File[]>([])

  // TODO: implement form
  return (
    <CollectionDropzone
      endpoint="collectionSmall"
      files={files}
      setFiles={setFiles}
    />
  )
}

export default CollectionForm
