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
//   .catch(() => cardList.innerHTML = `Error`);

getUsers(
  "https://randomuser.me/api/?results=20&nat=us,ua,de&inc=picture,name,dob,gender"
).then((data) => {
  users = data.results;
  renderCard(users);
  filterUsers(users);
});

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
  form.addEventListener("input", ({ target }) => {
    switch (target.value) {
      case "name-down":
        newFriendsArr.sort((a, b) => compareByName(a, b));
        break;
      case "name-up":
        newFriendsArr.sort((a, b) => compareByName(b, a));
        break;
      case "age-down":
        newFriendsArr.sort((a, b) => compareByAge(a, b));
        break;
      case "age-up":
        newFriendsArr.sort((a, b) => compareByAge(b, a));
        break;
      case "male":
        newFriendsArr = arr.filter((friend) => compareByGender(friend, "male"));
        break;
      case "female":
        newFriendsArr = arr.filter((friend) =>
          compareByGender(friend, "female")
        );
        console.log(newFriendsArr);
        break;
      case "all":
        newFriendsArr = arr;
        break;
    }

    if (target.name === "name" && target.value.length > 0) {
      newFriendsArr = arr.filter((friend) => {
        const fullName = `${friend.name.first} ${friend.name.last}`;
        if (fullName.toLowerCase().includes(target.value)) {
          return (newFriendsArr = [...newFriendsArr]);
        }
      });
    } else {
      newFriendsArr =  arr;
    }

    
    // sortByAge(target.value, newFriendsArr);
    // sortByName(target.value, newFriendsArr);
    // sortByGender(target.value, newFriendsArr, arr);
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

function sortByGender(target, array, arr) {
  switch (target) {
    case "male":
      arrayFriends = arr.filter((friend) => compareByGender(friend, "male"));
      break;
    case "female":
      arrayFriends = arr.filter((friend) => compareByGender(friend, "female"));
      break;
    case "all":
      arrayFriends = arr;
      break;
  }
}


function filterBySearch(target, array, arr) {
  if (target.name === "name" && target.value.length > 0) {
    array = arr.filter((friend) => {
      const fullName = `${friend.name.first} ${friend.name.last}`;
      if (fullName.toLowerCase().includes(target.value)) {
        return (array = [...array]);
      }
    });
  } else {
    array = arr;
  }
}
