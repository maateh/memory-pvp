type RouteParams = {
  params: {
    playerId: string
  }
}

async function PATCH(req: Request, { params }: RouteParams) {
  try {
    
  } catch (err) {
    console.error('[PLAYERS_ID_PATCH]', err)
    return new Response('Internal Error', { status: 500 })
  }
}

async function DELETE(req: Request) {
  try {
    
  } catch (err) {
    console.error('[PLAYERS_ID_DELETE]', err)
    return new Response('Internal Error', { status: 500 })
  }
}

export { PATCH, DELETE }
