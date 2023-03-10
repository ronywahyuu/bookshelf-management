"use strict"

// =================== Storage's Relate Functions ===================
//
const isStorageExist = typeof (Storage) !== undefined

// ** Function to save data to local storage
function saveData() {
  if (isStorageExist) {
    const parsed = JSON.stringify(books)
    localStorage.setItem("BOOKSHELF_APPS", parsed)
  }
}

// ** Function to load data from local storage
function loadDataFromStorage() {
  if (isStorageExist) {
    const serializedData = localStorage.getItem("BOOKSHELF_APPS")

    let data = JSON.parse(serializedData)

    if (data !== null) {
      books = data
    }
  }
}

