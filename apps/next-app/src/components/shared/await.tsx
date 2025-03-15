type AwaitProps<T> = {
  promise: Promise<T>
  children: (data: T ) => React.JSX.Element | null
}

async function Await<T>({ promise, children }: AwaitProps<T>) {
  const data = await promise
  return children(data)
}

export default Await
