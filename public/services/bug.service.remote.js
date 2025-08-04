const BASE_URL = '/api/bug/'

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}

function query(filterBy) {
  return axios
    .get(BASE_URL, { params: filterBy })
    .then((res) => res.data)
    .catch((err) => {
      console.error('Error fetching bugs:', err)
      throw err
    })
}

function getById(bugId) {
  return axios
    .get(`${BASE_URL}${bugId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('Error fetching bug by ID:', err)
      throw err
    })
}

function remove(bugId) {
  return axios.delete(`${BASE_URL}${bugId}/remove`).then((res) => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios
      .put(`${BASE_URL}${bug._id}`, bug)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error updating bug:', err)
        throw err
      })
  } else {
    return axios
      .post(BASE_URL, bug)
      .then((res) => res.data)
      .catch((err) => {
        console.error('Error creating bug:', err)
        throw err
      })
  }
}

function getDefaultFilter() {
  return { txt: '', minSeverity: 0 }
}
