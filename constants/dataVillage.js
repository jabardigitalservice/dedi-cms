export const headerDataVillage = {
  title: 'Daftar Desa di Jawa Barat',
  descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit euismod non, semper eu interdum habitasse velit. Eu fermentum fames id.'
}

export const headerTableDataVillage = [
  {
    key: 'name',
    text: 'Nama Desa',
    sortable: false
  },
  {
    key: 'districtName',
    text: 'Kecamatan',
    sortable: false
  },
  {
    key: 'cityName',
    text: 'Kabupaten',
    sortable: false
  },
  {
    key: 'action',
    text: 'Aksi'
  }
]

export const optionsLevel = [
  {
    value: null,
    label: 'Belum ada level'
  },
  {
    value: 1,
    label: 1
  },
  {
    value: 2,
    label: 2
  },
  {
    value: 3,
    label: 3
  },
  {
    value: 4,
    label: 4
  }
]

// This pattern for checking user only allow input number and character (.)
export const formatText = /(?=.*[^\d.])/g

// formatId is pattern for id village maximal 13 chars (10 digit and 3 symbol) => XX.XX.XX.XXXX
export const formatId = /(\B(?=(\d{2})+(?!\d))(?=.{4}))/g

// regexpoint is pattern for longitude and latitude (XXX.XXX) and (-XXX.XXX) and only number
export const regexPoint = /^-?(\d+)(\.\d+)$/

export const menus = [
  {
    value: 'DesaDigitalLevelOne',
    label: 'Desa Digital Level 1'
  },
  {
    value: 'DesaDigitalLevelTwo',
    label: 'Desa Digital Level 2'
  },
  {
    value: 'DesaDigitalLevelThree',
    label: 'Desa Digital Level 3'
  },
  {
    value: 'DesaDigitalLevelFour',
    label: 'Desa Digital Level 4'
  }
]

export const headerDesaDigital = [
  {
    title: 'Desa Digital Level 1',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit euismod non, semper eu interdum habitasse velit. Eu fermentum fames id.'
  },
  {
    title: 'Desa Digital Level 2',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit euismod non, semper eu interdum habitasse velit. Eu fermentum fames id.'
  },
  {
    title: 'Desa Digital Level 3',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit euismod non, semper eu interdum habitasse velit. Eu fermentum fames id.'
  },
  {
    title: 'Desa Digital Level 4',
    descriptions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hendrerit euismod non, semper eu interdum habitasse velit. Eu fermentum fames id.'
  }
]
