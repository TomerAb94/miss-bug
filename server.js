import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Failed to get bugs', err)
      res.status(400).send('Failed to get bugs')
    })
})

app.get('/api/bug/:id', (req, res) => {
  const bugId = req.params.id

  let visitedBugs = req.cookies.visitedBugs || []
  if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Failed to get bug', err)
      res.status(400).send('Failed to get bug')
    })

  if (!visitedBugs.includes(bugId)) {
    res.cookie('visitedBugs', [...visitedBugs, bugId], { maxAge: 7000 })
  }
})

app.put('/api/bug/', (req, res) => {
  const bug = req.body

  bugService
    .save(bug)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Failed to update bug', err)
      res.status(400).send('Failed to update bug')
    })
})

app.post('/api/bug/', (req, res) => {
  const bug = bugService.getEmptyBug(req.body)

  bugService
    .save(bug)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Failed to create bug', err)
      res.status(400).send('Failed to create bug')
    })
})

app.delete('/api/bug/:id/remove', (req, res) => {
  const bugId = req.params.id

  bugService
    .remove(bugId)
    .then(() => res.send(`Bug ${bugId} removed`))
    .catch((err) => {
      loggerService.error('Failed to remove bug', err)
      res.status(400).send('Failed to remove bug')
    })
})

const port = 3030
app.listen(port, () =>
  loggerService.info(`Server is running on port , http://127.0.0.1:${port}/`)
)
