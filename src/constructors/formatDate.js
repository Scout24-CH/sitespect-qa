const formatDate = date => {
  date = new Date(date)
  return date.toLocaleString('de')
}

export default formatDate
