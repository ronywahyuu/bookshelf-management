// ================================ This file is for general event handler ================================
//
// ** Event listener 
document.addEventListener("DOMContentLoaded", () => {

  // * Initialize
  loadDataFromStorage()
  renderBooksToBookshelf()

  inputBookSubmit.addEventListener("submit", (e) => {
    e.preventDefault()
    addBook()
  })

  inputSearchBook.addEventListener("keyup", (e) => {
    searchBook(e.target.value)
  })

  // ** Event listener for custom event
  document.addEventListener('added', () => {
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'Buku berhasil ditambahkan',
      showConfirmButton: false,
      timer: 1500
    })
  })

  document.addEventListener('removed', () => {
    Swal.fire(
      'Berhasil dihapus!',
      'Buku anda berhasil dihapus.',
      'success'
    )
  })

  document.addEventListener('invalid_year', () => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Tahun tidak valid. Harus diantara 1000 - 2040',
    })
  })

  document.addEventListener('invalid_thumbnail', () => {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Thumbnail',
      text: 'Anda dapat menggunakan link gambar dari internet.',
    })
  })
})