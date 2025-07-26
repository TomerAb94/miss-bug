import express from 'express'
const app = express()

// Add this line before your routes
app.use(express.static('public'))

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

app.get('/', (req, res) => {
  res.send('bugs server is running')
})

app.get('/api/bug', (req, res) => {
  bugService
    .query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Failed to get bugs', err)
      res.status(400).send('Failed to get bugs')
    })
})

app.get('/api/bug/save', (req, res) => {
  const { title, severity, description, _id } = req.query

  const bug = {
    _id,
    title,
    severity: +severity,
    description,
  }

  bugService
    .save(bug)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Failed to save bug', err)
      res.status(400).send('Failed to save bug')
    })
})

app.get('/api/bug/:id', (req, res) => {
  const bugId = req.params.id

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error('Failed to get bug', err)
      res.status(400).send('Failed to get bug')
    })
})

app.get('/api/bug/:id/remove', (req, res) => {
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
