export const menus = [
  {
    value: 'Admin',
    label: 'Admin'
  },
  {
    value: 'Mitra',
    label: 'Mitra'
  },
  {
    value: 'PerangkatDesa',
    label: 'Perangkat Desa'
  },
  {
    value: 'Masyarakat',
    label: 'Masyarakat'
  }
]

export const headerTableUserAdmin = [
  {
    key: 'name',
    text: 'Nama User',
    sortable: true
  },
  {
    key: 'email',
    text: 'Email',
    sortable: true
  },
  {
    key: 'status',
    text: 'Status',
    sortable: true
  },
  {
    key: 'action',
    text: 'Aksi'
  }
]

export const headerTableUserMitra = [
  {
    key: 'name',
    text: 'Nama User',
    sortable: false
  },
  {
    key: 'partnerName',
    text: 'Nama Perusahaan',
    sortable: false
  },
  {
    key: 'email',
    text: 'Email',
    sortable: false
  },
  {
    key: 'createdDate',
    text: 'Dibuat Pada',
    sortable: false
  },
  {
    key: 'customStatus',
    text: 'Status',
    sortable: false
  },
  {
    key: 'action',
    text: 'Aksi'
  }
]

export const statusPartner = {
  waiting: 'Menunggu Verifikasi',
  verified: 'Terverifikasi',
  rejected: 'Ditolak',
  active: 'Aktif',
  inactive: 'Nonaktif'
}

export const headerTableUserDesa = [
  {
    key: 'name',
    text: 'Nama User',
    sortable: false
  },
  {
    key: 'email',
    text: 'Email',
    sortable: false
  },
  {
    key: 'desa',
    text: 'Desa',
    sortable: false
  },
  {
    key: 'kecamatan',
    text: 'Kecamatan',
    sortable: false
  },
  {
    key: 'kabupaten',
    text: 'Kabupaten',
    sortable: false
  },
  {
    key: 'status',
    text: 'Status',
    sortable: false
  },
  {
    key: 'action',
    text: 'Aksi'
  }
]
