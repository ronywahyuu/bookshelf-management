"use strict"

// =================== Initial Data ===================
//
// ** initial data and object
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

// =================== Optional Custom Event ===================
const CUSTOM_EVENT = {
    // save_data: new Event("saved"),
    // load_data: new Event("loaded"),
    // update_data: new Event("updated"),
    remove_data: new Event("removed"),
    add_data: new Event("added"),
    invalid_thumbnail: new Event("invalid_thumbnail"),
    invalid_year: new Event("invalid_year"),
}


// =================== Form Elements ===================
// ** Elements init
const inputBookTitle = document.querySelector("#inputBookTitle")
const inputBookAuthor = document.querySelector("#inputBookAuthor")
const inputBookYear = document.querySelector("#inputBookYear")
const inputBookIsComplete = document.querySelector("#isComplete")
const inputBookThumbnail = document.querySelector("#inputBookThumbnail")
const inputBookSubmit = document.querySelector("#inputBook")
const inputSearchBook = document.querySelector("#inputSearchBook")
const btnAdd = document.querySelector(".btn-add")


// =================== Book Elements ===================
// ** Elements init
const leftColumn = document.querySelector(".left")
const bookshelf = document.querySelector(".bookshelf")
const booklist = document.querySelector(".book_list")
const incompleteBookshelf = document.querySelector("#incompleteBookshelfList")
const completeBookshelf = document.querySelector("#completeBookshelfList")
const book_item = document.querySelectorAll(".book_item")


// =================== Helper Function =======================
// ** Function to check if the url is an image
function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null)
}

// ** Function to check if the url is a valid url
function filterBookById(bookId) {
    return books.filter(book => book.id === bookId)
}

// ** Function to check if the date is between 1900 and 2040
function isYearValid(year) {
    return year >= 1100 && year <= 2040
}

// =================== DOM's Related Functions =======================
// ** Function to render books to bookshelf
function renderBooksToBookshelf() {
    for (let book of books) {
        const newBook = makeBookComponent(book.title, book.author, book.year, book.isComplete, book.thumbnail, book.id)
        if (book.isComplete) {
            completeBookshelf.append(newBook)
        } else {
            incompleteBookshelf.append(newBook)
        }
    }
}


// ** use this function to create book DOM element
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
    img.alt = `Cover buku ${bookTitle}`

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

// ** Base function to create button
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
            document.dispatchEvent(CUSTOM_EVENT.remove_data)

        }
    })
}

// ** function to either add or remove book from bookshelf
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
}


// ** function that use the base function to create button 
function createCheckButton() {
    return createButton("btn-green", "Selesai dibaca", (event) => {
        const { parentElement } = event.target.parentElement
        swapBook(parentElement)
    })
}


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

function addBook() {
    let bookTitle = inputBookTitle.value
    let bookAuthor = inputBookAuthor.value
    let bookYear = +inputBookYear.value
    let bookIsComplete = inputBookIsComplete.checked
    let bookThumbnail = inputBookThumbnail.value

    if (bookThumbnail) {
        if (!isImage(bookThumbnail)) {
            document.dispatchEvent(CUSTOM_EVENT.invalid_thumbnail)
            return
        }
    }

    // if bookyear is not valid
    if (!isYearValid(bookYear)) {
        document.dispatchEvent(CUSTOM_EVENT.invalid_year)
        return
    }

    const bookDataObj = bookObject(bookTitle, bookAuthor, bookYear, bookThumbnail, bookIsComplete)
    const newBook = makeBookComponent(bookTitle, bookAuthor, bookYear, bookIsComplete, bookThumbnail, bookDataObj.id)

    if (bookIsComplete) {
        // newBook[bookId] = bookDataObj.id
        completeBookshelf.append(newBook)

    } else {
        incompleteBookshelf.append(newBook)
    }

    // console.log(bookDataObj.id)

    books.push(bookDataObj)

    // save data to local storage
    saveData()
    document.dispatchEvent(CUSTOM_EVENT.add_data)

    inputBookTitle.value = ""
    inputBookAuthor.value = ""
    inputBookYear.value = ""
    inputBookIsComplete.checked = false
    inputBookThumbnail.value = ""

}


function searchBook(key) {
    const filteredBook = books.filter(book => {
        return book.title.toLowerCase().includes(key.toLowerCase()) || book.author.toLowerCase().includes(key.toLowerCase()) || book.year.toLowerCase().includes(key.toLowerCase())
    })

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