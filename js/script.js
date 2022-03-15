"use strict";
let elResult = document.querySelector(".movies__result");
let elList = document.querySelector(".movies__list");
let elBookmarkList = document.querySelector(".bookmark-list");
let elSelect = document.querySelector(".select");
let elForm = document.querySelector(".form");
let elModalTitle = document.querySelector(".modal__title");
let elModalDesc = document.querySelector(".modal__desc");
let elModal = document.querySelector(".modall");
let elCloseBtn = document.querySelector(".close-modal");
let elOverlay = document.querySelector(".overlay");

elResult.textContent = films.length;

let bookmarkLocalStorage = JSON.parse(window.localStorage.getItem("bookmarks"));
let bookmarks = bookmarkLocalStorage || [];
// console.log(bookmarks);

// console.log(bookmarks);

// Bookmark Creation

elList.addEventListener("click", (evt) => {
  if (evt.target.matches(".bookmark-btn")) {
    let bookmarkBtnId = evt.target.dataset.bookmarkId;

    let foundBookmarkFilm = films.find((film) => {
      return film.id === bookmarkBtnId;
    });

    if (!bookmarks.includes(foundBookmarkFilm)) {
      bookmarks.push(foundBookmarkFilm);
    }

    elBookmarkList.innerHTML = null;
    renderBookmarks(bookmarks, elBookmarkList);

    // Modal Creation
  } else if (evt.target.matches(".more-info-btn")) {
    let moreInfoBtnId = evt.target.dataset.moreInfoId;

    let foundMoreInfoFilm = films.find((film) => film.id === moreInfoBtnId);
    console.log(moreInfoBtnId);

    elModalTitle.textContent = foundMoreInfoFilm.title;
    elModalDesc.textContent = foundMoreInfoFilm.overview;

    // console.log(foundMoreInfoFilm.title);

    elModal.classList.remove("hidden");
    elOverlay.classList.remove("hidden");

    elCloseBtn.addEventListener("click", function () {
      elModal.classList.add("hidden");
      elOverlay.classList.add("hidden");
    });

    elOverlay.addEventListener("click", function () {
      elModal.classList.add("hidden");
      elOverlay.classList.add("hidden");
    });

    document.addEventListener("keydown", function (evt) {
      if (evt.key === "Escape") {
        elModal.classList.add("hidden");
        elOverlay.classList.add("hidden");
      }
    });
  }
});


// Bookmark List edited or removed
elBookmarkList.addEventListener("click", (evt) => {
  if (evt.target.matches(".bookmark__item")) {
    let bookmarkRemoveBtnId = evt.target.dataset.removeId * 1;

    let foundBookmarkItemIndex = bookmarks.findIndex(
      (bookmark) => bookmark.id == bookmarkRemoveBtnId
    );

    bookmarks.splice(foundBookmarkItemIndex, 1);

    elBookmarkList.innerHTML = null;
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    renderBookmarks(bookmarks, elBookmarkList);
  }
});


const generateGenres = function (films) {
  const uniqueGenres = [];

  films.forEach((film) => {
    film.genres.forEach((genre) => {
      if (!uniqueGenres.includes(genre)) {
        uniqueGenres.push(genre);

        let newOption = document.createElement("option");

        newOption.setAttribute("value", `${genre}`);

        newOption.textContent = `${genre}`;

        elSelect.appendChild(newOption);
      }
    });
  });
};


// Bookmark Render
const renderBookmarks = function (bookmarks, node) {
  // let bookmarkBtnId = 0;
  for (let bookmark of bookmarks) {
    let newLi = document.createElement("li");
    let newLiTitle = document.createElement("h3");
    let newLiRemoveBtn = document.createElement("button");

    newLiRemoveBtn.setAttribute(
      "class",
      "bookmark__item btn btn-outline-danger"
    );

    newLiTitle.textContent = bookmark.title;
    newLiRemoveBtn.textContent = "Remove";

    // bookmark.id = bookmarkBtnId;
    // console.log(bookmark.id);
    newLiRemoveBtn.dataset.removeId = bookmark.id;

    node.appendChild(newLi);
    newLi.appendChild(newLiTitle);
    newLi.appendChild(newLiRemoveBtn);
  }
  window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};

const renderFilms = function (filmsArray, element) {
  // let bookmarkBtnId = 0;
  filmsArray.forEach((movie) => {
    //CREATE
    let newItem = document.createElement("li");
    let newCard = document.createElement("div");
    let newImg = document.createElement("img");
    let newCardBody = document.createElement("div");
    let newCardTitle = document.createElement("h5");
    let newCardGenresList = document.createElement("ul");
    let newCradBtnsWrapper = document.createElement("div");
    let newCardWatchTrailerBtn = document.createElement("button");
    let newCardMoreInfoBtn = document.createElement("button");
    let newCardBookmarkBtn = document.createElement("button");

    movie.genres.forEach((genre) => {
      let newCardGenres = document.createElement("li");

      newCardGenres.textContent = genre;

      newCardGenresList.appendChild(newCardGenres);
    });

    //SET ATTRIBUTE
    newItem.setAttribute("class", "movies__item");
    newCard.setAttribute("class", "card movies__card");
    newImg.setAttribute("class", "card-img-top");
    newImg.setAttribute("src", movie.poster);
    newCardBody.setAttribute("class", "card-body");
    newCradBtnsWrapper.setAttribute(
      "class",
      "mt-auto d-flex align-items-center justify-content-center flex-wrap"
    );
    newCardWatchTrailerBtn.setAttribute("class", "btn btn-outline-primary m-2");
    newCardMoreInfoBtn.setAttribute(
      "class",
      "more-info-btn btn btn-outline-primary m-2"
    );
    newCardBookmarkBtn.setAttribute(
      "class",
      "bookmark-btn btn btn-outline-primary"
    );

    // DATA SET
    newCardBookmarkBtn.dataset.bookmarkId = movie.id;
    // movie.newId = bookmarkBtnId;
    newCardMoreInfoBtn.dataset.moreInfoId = movie.id;

    //TEXT CONTENT
    newCardTitle.textContent = movie.title;
    newCardWatchTrailerBtn.textContent = "Watch trailer";
    newCardMoreInfoBtn.textContent = "More info";
    newCardBookmarkBtn.textContent = "Bookmark";

    //APPEND CHILD
    element.appendChild(newItem);
    newItem.appendChild(newCard);
    newCard.appendChild(newImg);
    newCard.appendChild(newCardBody);
    newCardBody.appendChild(newCardTitle);
    newCardBody.appendChild(newCardGenresList);
    newCardBody.appendChild(newCradBtnsWrapper);
    newCradBtnsWrapper.appendChild(newCardWatchTrailerBtn);
    newCradBtnsWrapper.appendChild(newCardMoreInfoBtn);
    newCradBtnsWrapper.appendChild(newCardBookmarkBtn);
  });
};

renderFilms(films, elList);

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  let selectValue = elSelect.value;

  let genreArray = films.filter((film) => film.genres.includes(selectValue));

  if (selectValue === "all") {
    elList.innerHTML = null;
    renderFilms(films, elList);
    elResult.textContent = films.length;
  } else {
    elList.innerHTML = null;
    renderFilms(genreArray, elList);
    elResult.textContent = genreArray.length;
  }
});

renderBookmarks(bookmarks, elBookmarkList);

generateGenres(films);
