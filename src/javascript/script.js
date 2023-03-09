"use strict"

const isStorageExist = typeof (Storage) !== undefined

// =================== Initial Data ===================
// Data
let books = []
let bookId = null
const bookObject = function (title, author, year, thumbnail, isComplete) {
    return {
        id: +new Date(),
        title: title,
        author: author,
        year: year,
        thumbnail: thumbnail,
        isComplete: isComplete
    }
}


// =================== Form Elements ===================
// Elements
const inputBookTitle = document.querySelector("#inputBookTitle")
const inputBookAuthor = document.querySelector("#inputBookAuthor")
const inputBookYear = document.querySelector("#inputBookYear")
const inputBookIsComplete = document.querySelector("#isComplete")
const inputBookThumbnail = document.querySelector("#inputBookThumbnail")
const inputBookSubmit = document.querySelector("#inputBook")
const inputSearchBook = document.querySelector("#inputSearchBook")

// =================== Book Elements ===================
// Elements
const leftColumn = document.querySelector(".left")
const bookshelf = document.querySelector(".bookshelf")
const booklist = document.querySelector(".book_list")
const incompleteBookshelf = document.querySelector("#incompleteBookshelfList")
const completeBookshelf = document.querySelector("#completeBookshelfList")
const book_item = document.querySelectorAll(".book_item")
const btnAdd = document.querySelector(".btn-add")


// =================== Functions =======================
function saveData() {
    const saveEvent = new Event("saved")
    const parsed = JSON.stringify(books)
    localStorage.setItem("BOOKSHELF_APPS", parsed)
    document.dispatchEvent(saveEvent)
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem("BOOKSHELF_APPS")

    let data = JSON.parse(serializedData)

    if (data !== null) {
        books = data
    }
}

function emptyState() {
    const emptyState = document.createElement("div")
    emptyState.classList.add("empty-state")
    emptyState.innerHTML = `
        <img src="src/img/empty-state.svg" alt="empty-state">
        <p>Belum ada buku yang selesai dibaca</p>
    `

    // completeBookshelf.append(emptyState)
    return emptyState
}

function renderBooksToBookshelf() {
    for (let book of books) {
        // const newBook = makeBookComponent(book.title, book.author, book.year, book.isComplete, book.thumbnail)
        const newBook = makeBookComponent(book.title, book.author, book.year, book.isComplete, book.thumbnail, book.id)

        // const bookDataObj = bookObject(book.title, book.author, book.year, book.isComplete, book.thumbnail)

        if (book.isComplete) {
            completeBookshelf.append(newBook)
        } else {
            incompleteBookshelf.append(newBook)
        }

        // books.push(bookDataObj)
    }
}


function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null)
}

function filterBookById(bookId) {
    return books.filter(book => book.id === bookId)
}



// =================== Function to create Components =======================
//
//
function makeBookComponent(bookTitle, bookAuthor, bookYear, bookIsComplete, bookThumbnail, bookId) {
    const thumbnail = bookThumbnail || "src/img/book-cover.jpg"
    const finishedBtn = createCheckButton()
    const trashBtn = createTrashButton()
    const undoBtn = createUndoButton()

    const book = document.createElement("div")
    book.classList.add("book_item")

    // give id
    book.id = bookId

    const img = document.createElement("img")
    img.src = thumbnail

    const bookDetail = document.createElement("div")
    bookDetail.classList.add("book_item_detail")

    const title = document.createElement("h3")
    title.innerText = bookTitle
    title.classList.add("title")

    const author = document.createElement("p")
    author.innerText = bookAuthor
    author.classList.add("author")

    const year = document.createElement("p")
    year.innerText = bookYear
    year.classList.add("year")


    const actionDiv = document.createElement("div")
    actionDiv.classList.add("book_action")

    if (bookIsComplete) {
        actionDiv.append(undoBtn, trashBtn)
    } else {
        actionDiv.append(finishedBtn, trashBtn)
    }

    bookDetail.append(title, author, year, actionDiv)
    book.append(img, bookDetail)

    return book
}

// function to create button
function createButton(buttonClass, textValue, eventListener) {
    const button = document.createElement("button")
    button.classList.add(buttonClass)

    button.insertAdjacentHTML("beforeend", textValue)
    button.addEventListener("click", function (event) {
        eventListener(event)
    })
    return button

}

function removeBook(bookElement) {
    const selectedBookId = +bookElement.parentElement.getAttribute("id")


    const book = books.filter(book => book.id === selectedBookId)[0]
    // in which index is the book
    const bookIndex = books.indexOf(book)
    Swal.fire({
        title: 'Anda Yakin?',
        text: "Aksi ini akan menghapus data anda!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003865',
        cancelButtonColor: '#c10f3a',
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result.isConfirmed) {
            // remove the book from the array
            books.splice(bookIndex, 1)

            // remove the book from the DOM
            bookElement.parentElement.remove()

            saveData()
            Swal.fire(
                'Berhasil dihapus!',
                'Buku anda berhasil dihapus.',
                'success'
            )
        }
    })


    console.log(bookIndex)
}

function swapBook(bookElement) {
    const selectedBookId = +bookElement.parentElement.getAttribute("id")

    const book = filterBookById(selectedBookId)[0]

    bookElement.parentElement.remove()
    if (book.isComplete) {
        book.isComplete = false
        const newBook = makeBookComponent(book.title, book.author, book.year, book.isComplete, book.thumbnail, book.id)
        incompleteBookshelf.append(newBook)
    } else {
        book.isComplete = true
        const newBook = makeBookComponent(book.title, book.author, book.year, book.isComplete, book.thumbnail, book.id)
        completeBookshelf.append(newBook)
    }

    saveData()
    console.log(book)
}


// function to create check button
function createCheckButton() {
    return createButton("btn-green", "Selesai dibaca", (event) => {
        const { parentElement } = event.target.parentElement
        swapBook(parentElement)
    })
}

// function to create undo button
function createUndoButton() {
    return createButton("btn-back", "Belum Selesai", function (event) {
        const { parentElement } = event.target.parentElement
        swapBook(parentElement)
    })
}

function createTrashButton() {
    return createButton("btn-danger", "Hapus buku", (event) => {
        removeBook(event.target.parentElement.parentElement)
    })
}

// Function to add book
function addBook() {
    let bookTitle = inputBookTitle.value
    let bookAuthor = inputBookAuthor.value
    let bookYear = inputBookYear.value
    let bookIsComplete = inputBookIsComplete.checked
    let bookThumbnail = inputBookThumbnail.value



    if (bookThumbnail) {
        if (!isImage(bookThumbnail)) {
            alert("Link thumbnail buku tidak valid")
            return
        }
    }


    const bookDataObj = bookObject(bookTitle, bookAuthor, bookYear, bookThumbnail, bookIsComplete)
    const newBook = makeBookComponent(bookTitle, bookAuthor, bookYear, bookIsComplete, bookThumbnail, bookDataObj.id)

    if (bookIsComplete) {
        // newBook[bookId] = bookDataObj.id
        completeBookshelf.append(newBook)
    } else {
        // newBook[bookId] = bookDataObj.id
        incompleteBookshelf.append(newBook)
    }

    console.log(bookDataObj.id)

    books.push(bookDataObj)

    // save data to local storage
    if (isStorageExist) {
        saveData()
    }
    // console.log(bookDataObj)

    inputBookTitle.value = ""
    inputBookAuthor.value = ""
    inputBookYear.value = ""
    inputBookIsComplete.checked = false
    inputBookThumbnail.value = ""

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Buku berhasil ditambahkan',
        showConfirmButton: false,
        timer: 1500
    })

    console.log(books)
}

function searchBook(key) {
    const filteredBook = books.filter(book => {
        return book.title.toLowerCase().includes(key.toLowerCase()) || book.author.toLowerCase().includes(key.toLowerCase()) || book.year.toLowerCase().includes(key.toLowerCase())
    })
    // console.log(filteredBook)

    // clear the bookshelf
    completeBookshelf.innerHTML = ""
    incompleteBookshelf.innerHTML = ""

    // render the bookshelf
    filteredBook.forEach(book => {
        const newBook = makeBookComponent(book.title, book.author, book.year, book.isComplete, book.thumbnail, book.id)
        if (book.isComplete) {
            completeBookshelf.append(newBook)
        } else {
            incompleteBookshelf.append(newBook)
        }
    })


    return filteredBook
}

// =================== Event Listener =======================


// =================== Helper Function =======================


// =================== DOM Functions =========================