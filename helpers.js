function makeid(length, withalpa = false) {
  var result = ''
  var characters = '0123456789'

  if (withalpa) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function getSlug(times) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const day = times.getDay()
  const date = times.getDate()
  const month = times.getMonth()
  const year = times.getFullYear()

  return `kajian-${days[day]}-${date}-${months[month]}-${year}`.toLowerCase().concat('-' + makeid(5))
}

function toTitleCase(str) {
  if (!str) return ''
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

module.exports = {getSlug, makeid, toTitleCase}