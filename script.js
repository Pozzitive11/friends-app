let users = [];
let currentUsers = [];
let resultUsers;
const numberOfUsers = 100;
const cardsList = document.querySelector(".users__list");
const form = document.querySelector(".form");
const header = document.querySelector(".header");

const resetButton = document.querySelector(".form__button");

const burgerButton = document.querySelector(".burger");
const sidebar = document.querySelector(".sidebar");

const paginationList = document.querySelector(".pagination-list");

burgerButton.addEventListener("click", () => {
  burgerButton.classList.toggle("active");
  sidebar.classList.toggle("sidebar--visible");
  document.body.classList.toggle("hidden");
});

const statusMessage = {
  loading: "img/spinner.svg",
  failure: "Technical problems, try again later",
};

const loadingAnimation = document.createElement("img");
function showLoadingStatus() {
  loadingAnimation.src = statusMessage.loading;
  loadingAnimation.classList.add("status-block");

  cardsList.insertAdjacentElement("afterend", loadingAnimation);
}

function loadUsersData() {
  showLoadingStatus();

  fetch(
    `https://randomuser.me/api/?results=${numberOfUsers}&inc=picture,name,dob,gender,location`
  )
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((responseJson) => {
      users = responseJson.results;
      createCards(returnSelectedPage(users));
      createPaginationList(users);
    })
    .catch(() => {
      showErrorStautus();
    })
    .finally(() => {
      loadingAnimation.remove();
    });
}

function showErrorStautus() {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-block");
  errorMessage.innerHTML = `${statusMessage.failure}`;

  cardsList.append(errorMessage);
}

function createCards(cards) {
  cardsList.innerHTML = "";
  cardsList.innerHTML = cards
    .map(
      ({ picture, name, dob, gender, location }) =>
        `<li class="user__item">
          <h4 class="user__gender user__gender--${gender}">${gender}</h4>
          <img class="user__img" src="${picture.large}" alt="User photo" />
          <p class="user__name">${name.first} ${name.last}</p>
          <p class="user__age">Age: <span class="user__age-span">${dob.age}</span></p>
          <p class="user__location">${location.country}</p>
        </li>`
    )
    .join("");
}

const compareByName = (firstUser, secondUser) =>
  firstUser.name.first.toLowerCase() <= secondUser.name.first.toLowerCase()
    ? -1
    : 1;
const compareByAge = (firstUser, secondUser) =>
  firstUser.dob.age - secondUser.dob.age;

function filterByName(names, target) {
  return names.filter((user) => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    return fullName.includes(target.toLowerCase());
  });
}

function filterUsers() {
  resultUsers = [...users];
  if (form.search.value !== "") {
    resultUsers = filterByName(resultUsers, form.search.value);
  }

  switch (form.sort.value) {
    case "age-up":
      resultUsers.sort((a, b) => compareByAge(b, a));
      break;
    case "age-down":
      resultUsers.sort((a, b) => compareByAge(a, b));
      break;
    case "name-up":
      resultUsers.sort((a, b) => compareByName(b, a));
      break;
    case "name-down":
      resultUsers.sort((a, b) => compareByName(a, b));
      break;
  }

  resultUsers =
    form.gender.value === "male" || form.gender.value === "female"
      ? resultUsers.filter((user) => user.gender === form.gender.value)
      : resultUsers;

  createPaginationList(resultUsers);
  resultUsers = returnSelectedPage(resultUsers);
}

function resetFilters() {
  resultUsers = [...users];
  createPaginationList(resultUsers);
  resultUsers = returnSelectedPage(resultUsers);
}

const userPerPageNum = 20;
let selectedPage = 1;
let pageNum;

function countPages(friendsCopy) {
  if (Number.isInteger(friendsCopy.length / userPerPageNum)) {
    pageNum = friendsCopy.length / userPerPageNum;
  } else {
    pageNum = Math.round(friendsCopy.length / userPerPageNum);
  }
}

function createPaginationList(friendsCopy) {
  countPages(friendsCopy);

  paginationList.innerHTML = "";
  for (let i = 1; i <= pageNum; i++) {
    const paginationListElem = document.createElement("LI");
    const paginationLink = document.createElement("A");
    paginationLink.classList.add("pagination-number");
    paginationLink.setAttribute("href", "#");
    paginationLink.dataset.pageNum = i;
    paginationLink.innerHTML = i;

    if (i == selectedPage) {
      paginationListElem.classList.add("selected-page");
    }

    paginationList.appendChild(paginationListElem);
    paginationListElem.appendChild(paginationLink);
  }
}

function returnSelectedPage(friendsCopy) {
  const sliceStart = userPerPageNum * (selectedPage - 1);
  const sliceEnd = userPerPageNum + sliceStart;
  const slicedUsersArr = friendsCopy.slice(sliceStart, sliceEnd);
  createCards(slicedUsersArr);
  return slicedUsersArr;
}

document.addEventListener("DOMContentLoaded", function () {
  loadUsersData();

  form.addEventListener("input", (e) => {
    filterUsers();
    createCards(resultUsers);
  });
  resetButton.addEventListener("click", resetFilters);
});

paginationList.addEventListener("click", ({ target }) => {
  resultUsers = [...users];
  if (target.tagName === "A") {
    selectedPage = target.dataset.pageNum;
  }
  filterUsers();
});
