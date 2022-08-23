const form = document.querySelector("#form");
const cardList = document.querySelector(".cards__list");

let users = [];

async function getUsers(url) {
  let res = await fetch(url);

  if (!res.ok) {
    cardList.innerHTML = `Could not fetch ${url}, status: ${res.status}`;
  }
  return await res.json();
}

// fetch(
//   "https://randomuser.me/api/?results=20&nat=us,ua,de&inc=picture,name,dob,gender"
// )
//   .then((response) => response.json())
//   .then((data) => {
//     users = data.results;
//     renderCard(users);
//     filterUsers(users);
//   })
//   .catch(() => showError());

getUsers(
  "https://randomuser.me/api/?results=20&nat=us,ua,de&inc=picture,name,dob,gender"
)
  .then((data) => {
    users = data.results;
    renderCard(users);
    filterUsers(users);
    resetCards(users);
  })
  .catch(() => showError());

function showError() {
  const element = document.createElement("div");
  element.classList.add("error-block");
  element.innerHTML = "Sorry for any technical problems, try again later";

  cardList.append(element);
}

function renderCard(arr) {
  arr.forEach(({ picture, name, dob, gender }) => {
    createCard({ picture, name, dob, gender });
  });
}

function createCard({ picture, name, dob, gender }) {
  const element = document.createElement("li");
  element.classList.add("card__item");

  element.innerHTML = `
    <img class="card__img" src="${picture.large}" alt="User photo" />
    <h3 class="card__name">${name.first} ${name.last}</h3>
    <h4 class="card__age">Age: <span class="age__span">${dob.age}</span></h4>`;

  addGenderHeader(gender, element);
  cardList.append(element);
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function addGenderHeader(gender, element) {
  const friendGender = document.createElement("div");
  if (gender === "male") {
    friendGender.innerHTML = `<h4 class="card__gender card__gender--male">${gender}</h4>`;
  } else {
    friendGender.innerHTML = `<h4 class="card__gender card__gender--female">${gender}</h4>`;
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
function filterUsers(arr) {
  let newFriendsArr = [...arr];
  form.addEventListener("input", ({target}) => {
    switch (target.value) {
      case "name-down":
        // працюю з копією масиву
        newFriendsArr.sort((a, b) => compareByName(a, b));
        break;
      case "name-up":
        // працюю з копією масиву
        newFriendsArr.sort((a, b) => compareByName(b, a));
        break;
      case "age-down":
        // працюю з копією масиву
        newFriendsArr.sort((a, b) => compareByAge(a, b));
        break;
      case "age-up":
        // працюю з копією масиву
        newFriendsArr.sort((a, b) => compareByAge(b, a));
        break;
      case "male":
        // копія масиву = вхідний масив через це не фільтруються значення інпуту
        newFriendsArr = arr.filter((friend) => compareByGender(friend, "male"));
        break;
      case "female":
        // копія масиву = вхідний масив через це не фільтруються значення інпуту
        newFriendsArr = arr.filter((friend) =>
          compareByGender(friend, "female")
        );
        break;
      case "all":
        newFriendsArr = arr;
        break;
    }

    if (target.name === "name") {
      newFriendsArr = arr.filter((friend) => {
        const fullName = `${friend.name.first} ${friend.name.last}`;
        if (fullName.toLowerCase().includes(target.value)) {
          return (newFriendsArr = [...newFriendsArr]);
        }
      });
    }

    // sortByGender(target.value, newFriendsArr, arr);
    // sortByAge(target.value, newFriendsArr);
    // sortByName(target.value, newFriendsArr);
    // filterBySearch(target, newFriendsArr, arr);

    cardList.innerHTML = "";
    renderCard(newFriendsArr);
  });
}

function sortByAge(target, arr) {
  switch (target) {
    case "age-down":
      arr.sort((a, b) => compareByAge(a, b));
      break;
    case "age-up":
      arr.sort((a, b) => compareByAge(b, a));
      break;
  }
}

function sortByName(target, arr) {
  switch (target) {
    case "name-down":
      arr.sort((a, b) => compareByName(a, b));
      break;
    case "name-up":
      arr.sort((a, b) => compareByName(b, a));
      break;
  }
}

function sortByGender(target, newArray, arr) {
  switch (target) {
    case "male":
      newArray = arr.filter((friend) => compareByGender(friend, "male"));
      console.log(newArray);
      break;
    case "female":
      newArray = arr.filter((friend) => compareByGender(friend, "female"));
      console.log(newArray);
      break;
    case "all":
      newArray = arr;
      console.log(newArray);
      break;
  }
}

function filterBySearch(target, newArray, arr) {
  if (target.name === "name" && target.value.length > 0) {
    newArray = arr.filter((friend) => {
      const fullName = `${friend.name.first} ${friend.name.last}`;
      if (fullName.toLowerCase().includes(target.value)) {
        return (newArray = [...newArray]);
      }
    });
  }
}

function resetCards(arr) {
  document.querySelector(".form__button").addEventListener("click", () => {
    let newFriendsArr = [...arr];
    cardList.innerHTML = "";
    renderCard(newFriendsArr);
  });
}


// При інпут + гендер фільтруються не дані з інпуту а усі картки

