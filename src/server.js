// Dependencies
import express from 'express'
import next from 'next'
import path from 'path'
import bodyParser from 'body-parser'
import cookiesParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'

// Settings up Next App
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

// Configuration
import config from '@config'

// Middlewares
import user, { isConnected } from '@middlewares/user'

// Running Next app
nextApp.prepare().then(() => {
    const app = express()

    // Public static
    app.use(express.static(path.join(__dirname, '../public')))

    // Middlewares
    app.use(session({
      resave: false,
      saveUninitialized: true,
      secret: config.security.secretKey
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookiesParser(config.security.secretKey))
    app.use(cors({ credentials: true, origin: true }))
    app.use(user)

    // Routes
    app.get('/login', isConnected(false), (req, res) => {
      return nextApp.render(req, res, '/users/login', req.query)
    })

    app.get('/dashboard', isConnected(true, 'god', '/login?redirectTo=/dashboard'), (req, res) => {
      return nextApp.render(req, res, '/dashboard/index', req.query)
    })

    app.all('*', (req, res) => {
        return handle(req, res)
    })

    // Listening port 3000
    app.listen(config.serverPort)
})
