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

const paginationContainer = document.querySelector(".pagination-container");
const paginationNumbers = document.querySelector(".pagination-numbers");
const listItems = cardsList.querySelectorAll("li");
const nextButton = document.querySelector("#next-button");
const prevButton = document.querySelector("#prev-button");
const paginationLimit = 20;
const pageCount = Math.ceil(numberOfUsers / paginationLimit);
let currentPage = 1;

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
      createCards(users);
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
    .slice(0, paginationLimit)
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

  return resultUsers;    
}

function resetFilters() {
  resultUsers = [...users];
  createCards(resultUsers);
}

// ==========================================
// ==========================================
// ==========================================

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};

const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }

  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("active");
    }
  });
};

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);

  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = () => {
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};
const setCurrentPage = (pageNum = 1) => {
  resultUsers = [...users];
  currentPage = pageNum;

  handleActivePageNumber();
  handlePageButtonsStatus();

  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;

  currentUsers = [];
  resultUsers.forEach((item, index) => {
    if (index >= prevRange && index < currRange) {
      currentUsers.push(item);
    }
  });
  createCards(currentUsers);
};

document.addEventListener("DOMContentLoaded", function () {
  loadUsersData();

  getPaginationNumbers();
  setCurrentPage(1);

  prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });

  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });

  form.addEventListener("input", (e) => {
    filterUsers();
    createCards(resultUsers);
  });
  resetButton.addEventListener("click", resetFilters);
});
