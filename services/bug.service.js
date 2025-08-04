'use strict'

import { makeId, readJsonFile, writeJsonFile } from './util.service.js'

const bugs = readJsonFile('data/bug.json')

export const bugService = {
  query,
  getById,
  remove,
  save,
  getEmptyBug,
}

function query(filter, sort, page) {
  let filteredBugs = bugs

  console.log('Filtering bugs with:', filter);
  

  if (filter.txt) {
    const regex = new RegExp(filter.txt, 'i')
    filteredBugs = filteredBugs.filter(
      (bug) => regex.test(bug.title) || regex.test(bug.description)
    )
  }

  if (filter.minSeverity) {
    filteredBugs = filteredBugs.filter(
      (bug) => bug.severity >= filter.minSeverity
    )
  }

  if (filter.labels && filter.labels.length) {
    filteredBugs = filteredBugs.filter((bug) =>
      filter.labels.every((label) => bug.labels.includes(label))
    )
  }

  return Promise.resolve(filteredBugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const idx = bugs.findIndex((bug) => bug._id === bugId)
  if (idx === -1) return Promise.reject('Bug not found')
  bugs.splice(idx, 1)
  return _saveBugs()
}

function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex((currBug) => currBug._id === bug._id)
    if (idx === -1) return Promise.reject('Bug not found')
    bugs[idx] = { ...bugs[idx], ...bug }
  } else {
    bug._id = makeId()
    bugs.unshift(bug)
  }
  return _saveBugs().then(() => bug)
}

function _saveBugs() {
  return writeJsonFile('data/bug.json', bugs)
}

function getEmptyBug({
  title = '',
  description = '',
  severity = 0,
  labels = [],
}) {
  return {
    title: title,
    description: description,
    severity: severity,
    createdAt: Date.now(),
    labels: labels,
  }
}
