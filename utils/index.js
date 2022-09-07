// format date from utc timezone to locale date string with custom format
export function formatDate (date) {
  if (date) {
    const newDate = new Date(date)
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const formattedDate = newDate.toLocaleDateString('id', options).replace(/\//g, '-')
    return formattedDate
  } else {
    return '-'
  }
}

export function formatDateTime (date) {
  if (date) {
    const newDate = new Date(date)
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' }
    const optionsTime = { hour: '2-digit', minute: '2-digit' }
    const formattedDate = `${newDate.toLocaleDateString('id', optionsDate)} - ${newDate.toLocaleTimeString('id', optionsTime).replace(/\./g, ':')} WIB`
    return formattedDate
  } else {
    return '-'
  }
}

export function generateItemsPerPageOptions (itemsPerPage) {
  const options = []
  for (let i = 1; i <= 5; i++) {
    options.push(itemsPerPage * i)
  }
  return options
}
