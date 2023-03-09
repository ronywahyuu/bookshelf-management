document.addEventListener("DOMContentLoaded", () => {

  // renderBooks()


  loadDataFromStorage()

  // if bookshelf child data change, render

  renderBooksToBookshelf()

  // if (incompleteBookshelf.childElementCount === 0) {
  //   incompleteBookshelf.innerHTML = `
  //     <p class="empty-bookshelf">Tidak ada buku di rak ini</p>
  //   `
  // } else {
  //   incompleteBookshelf.innerHTML = ""
  //   renderBooksToBookshelf()
  // }

  btnAdd.addEventListener("click", (e) => {
    console.log(e.target)

    if (leftColumn.style.display === "none") {
      leftColumn.style.display = "block"
    } else {
      leftColumn.style.display = "none"
    }
  })


  inputBookSubmit.addEventListener("submit", (e) => {
    e.preventDefault()

    addBook()
    console.log("submit")
  })

  inputSearchBook.addEventListener("keyup", (e) => {
    searchBook(e.target.value)
  })

})
document.addEventListener('saved', () => {
  console.log("saved")
})
