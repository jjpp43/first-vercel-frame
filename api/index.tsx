import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { createSystem } from 'frog/ui'

const { Image } = createSystem()

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

const BASE_URL = process.env.PUBLIC_URL || 'http://localhost:5173'

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {

  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  const initFrame = `${BASE_URL}/frame_init.png`
  return c.res({
    action: '/picker',
    image:
      initFrame,
    intents: [
      <Button value="left">치킨무없이 치킨</Button>,
      <Button value="right">케찹없이 감튀</Button>,
    ],
  })
})


app.frame('/picker', (c) => {
  const leftFrame = `${BASE_URL}/frame_left.png`
  const rightFrame = `${BASE_URL}/frame_right.png`
  const { buttonValue } = c
  if (buttonValue === 'left') {
    return c.res({
      action: '/',
      image: leftFrame,
      intents: [
        <Button value="reset">다시 하기</Button>,
      ],
    })
  } else {
    return c.res({
      action: '/',
      image: rightFrame,
      intents: [
        <Button value="reset">다시 하기</Button>,
      ]
    })
  }

})


// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
