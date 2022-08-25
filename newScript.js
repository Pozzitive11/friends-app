let users = [];
const cardList = document.querySelector(".users__list");

const sortAge = document.querySelector(".sort-age");
const sortName = document.querySelector(".sort-name");
const filterGender = document.querySelector(".sort-gender");

const searchInput = document.querySelector("#search-input");
const resetBtn = document.querySelector(".form__button");

const burgerBtn = document.querySelector(".burger");
const sidebar = document.querySelector(".sidebar");

burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active");
  sidebar.classList.toggle("sidebar--visible");
});

function loadCards() {
  fetch(
    "https://randomuser.me/api/?results=20&nat=us,ua,de&inc=picture,name,dob,gender,location"
  )
    .then((response) => response.json())
    .then((responseJson) => {
      users = responseJson.results;
      renderCards(users);
    })
    .catch(() => showError());
}

function showError() {
  const element = document.createElement("div");
  element.classList.add("error-block");
  element.innerHTML = "Technical problems, try again later :(";

  cardList.append(element);
}

function renderCards(arr) {
  arr.forEach(({ picture, name, dob, gender, location }) => {
    createCard({ picture, name, dob, gender, location });
  });
}

function createCard({ picture, name, dob, gender, location }) {
  const element = document.createElement("li");
  element.classList.add("user__item");

  element.innerHTML = `
    <img class="user__img" src="${picture.large}" alt="User photo" />
    <p class="user__name">${name.first} ${name.last}</p>
    <p class="user__age">Age: <span class="user__age-span">${dob.age}</span></p>
    <p class="user__location">${location.country}</p>`;

  addGenderHeader(gender, element);
  cardList.append(element);
}

function addGenderHeader(gender, element) {
  const friendGender = document.createElement("div");
  if (gender === "male") {
    friendGender.innerHTML = `<h4 class="user__gender user__gender--male">${gender}</h4>`;
  } else {
    friendGender.innerHTML = `<h4 class="user__gender user__gender--female">${gender}</h4>`;
  }
  element.prepend(friendGender);
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
const compareByName = (a, b) =>
  a.name.first.toLowerCase() <= b.name.first.toLowerCase() ? -1 : 1;
const compareByAge = (a, b) => a.dob.age - b.dob.age;

const compareByGender = (friend, type) => friend.gender === type;

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function filterBySearch(arr, target) {
  return arr.filter((friend) => {
    const fullName = `${friend.name.first} ${friend.name.last}`;
    return fullName.toLowerCase().includes(target.toLowerCase());
  });
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function filterUsers({ target }) {
  let resultUsers = [...users];
  if (searchInput.value !== "") {
    resultUsers = filterBySearch(resultUsers, searchInput.value);
  }

  if (target.checked) {
    switch (form.gender.value) {
      case "male":
        resultUsers = resultUsers.filter((friend) =>
          compareByGender(friend, "male")
        );
        break;
      case "female":
        resultUsers = resultUsers.filter((friend) =>
          compareByGender(friend, "female")
        );
        break;
      case "all":
        resultUsers;
        break;
    }

    if (target.value === "age-up") {
      resultUsers.sort((a, b) => compareByAge(b, a));
    } else if (target.value === "age-down") {
      resultUsers.sort((a, b) => compareByAge(a, b));
    }

    if (target.value === "name-up") {
      resultUsers.sort((a, b) => compareByName(b, a));
    } else if (target.value === "name-down") {
      resultUsers.sort((a, b) => compareByName(a, b));
    }
  }

  cardList.innerHTML = "";
  renderCards(resultUsers);
}

function resetFilters() {
  resultUsers = [...users];
  cardList.innerHTML = "";
  renderCards(resultUsers);
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  loadCards();

  sortName.addEventListener("click", filterUsers);
  sortAge.addEventListener("click", filterUsers);
  filterGender.addEventListener("click", filterUsers);
  searchInput.addEventListener("input", filterUsers);
  resetBtn.addEventListener("click", resetFilters);
});
