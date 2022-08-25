// const form = document.querySelector("#form");
// const cardList = document.querySelector(".cards__list");

// let users = [];

// async function getUsers(url) {
//   let res = await fetch(url);

//   if (!res.ok) {
//     cardList.innerHTML = `Could not fetch ${url}, status: ${res.status}`;
//   }
//   return await res.json();
// }

// // fetch(
// //   "https://randomuser.me/api/?results=20&nat=us,ua,de&inc=picture,name,dob,gender"
// // )
// //   .then((response) => response.json())
// //   .then((data) => {
// //     users = data.results;
// //     renderCard(users);
// //     filterUsers(users);
// //   })
// //   .catch(() => showError());

// getUsers(
//   "https://randomuser.me/api/?results=20&nat=us,ua,de&inc=picture,name,dob,gender"
// )
//   .then((data) => {
//     users = data.results;
//     renderCard(users);
//     filterUsers(users);
//   })
//   .catch(() => showError());

// function showError() {
//   const element = document.createElement("div");
//   element.classList.add("error-block");
//   element.innerHTML = "Sorry for any technical problems, try again later";

//   cardList.append(element);
// }

// function renderCard(arr) {
//   arr.forEach(({ picture, name, dob, gender }) => {
//     createCard({ picture, name, dob, gender });
//   });
// }

// function createCard({ picture, name, dob, gender }) {
//   const element = document.createElement("li");
//   element.classList.add("card__item");

//   element.innerHTML = `
//     <img class="card__img" src="${picture.large}" alt="User photo" />
//     <h3 class="card__name">${name.first} ${name.last}</h3>
//     <h4 class="card__age">Age: <span class="age__span">${dob.age}</span></h4>`;

//   addGenderHeader(gender, element);
//   cardList.append(element);
// }
// /////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

// function addGenderHeader(gender, element) {
//   const friendGender = document.createElement("div");
//   if (gender === "male") {
//     friendGender.innerHTML = `<h4 class="card__gender card__gender--male">${gender}</h4>`;
//   } else {
//     friendGender.innerHTML = `<h4 class="card__gender card__gender--female">${gender}</h4>`;
//   }

//   console.log(element);
//   element.prepend(friendGender);
// }

// /////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////

// const compareByName = (a, b) =>
//   a.name.first.toLowerCase() <= b.name.first.toLowerCase() ? -1 : 1;
// const compareByAge = (a, b) => a.dob.age - b.dob.age;

// const compareByGender = (friend, type) => friend.gender === type;

// /////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
// let newFriendsArr = [];
// function filterUsers(arr) {
//   newFriendsArr = [...arr];
//   form.addEventListener("input", ({ target }) => {
//     switch (target.value) {
//       case "name-down":
//         newFriendsArr.sort((a, b) => compareByName(a, b));
//         break;
//       case "name-up":
//         newFriendsArr.sort((a, b) => compareByName(b, a));
//         break;
//       case "age-down":
//         newFriendsArr.sort((a, b) => compareByAge(a, b));
//         break;
//       case "age-up":
//         newFriendsArr.sort((a, b) => compareByAge(b, a));
//         break;
//       case "male":
//         // Повиноо брати значення не з відсортованого масиву,а з початкового
//         newFriendsArr = newFriendsArr.filter((friend) =>
//           compareByGender(friend, "male")
//         );
//         break;
//       case "female":
//         // Повиноо брати значення не з відсортованого масиву,а з початкового
//         newFriendsArr = arr.filter((friend) =>
//           compareByGender(friend, "female")
//         );
//         break;
//       case "all":
//         newFriendsArr = arr;
//         break;
//     }

//     if (target.name === "name") {
//       // не повертає усі картки при пустому інпуті
//       newFriendsArr = arr.filter((friend) => {
//         const fullName = `${friend.name.first} ${friend.name.last}`;
//         return fullName.toLowerCase().includes(target.value.toLowerCase());
//       });
//     }

//     // sortByGender(target.value);
//     // sortByAge(target.value, newFriendsArr);
//     // sortByName(target.value, newFriendsArr);
//     // filterBySearch(target, arr);
//     resetFilters(arr);
//     console.log(newFriendsArr);

//     cardList.innerHTML = "";
//     renderCard(newFriendsArr);
//   });
// }

// function sortByAge(target, arr) {
//   switch (target) {
//     case "age-down":
//       arr.sort((a, b) => compareByAge(a, b));
//       break;
//     case "age-up":
//       arr.sort((a, b) => compareByAge(b, a));
//       break;
//   }
// }

// function sortByName(target, arr) {
//   switch (target) {
//     case "name-down":
//       arr.sort((a, b) => compareByName(a, b));
//       break;
//     case "name-up":
//       arr.sort((a, b) => compareByName(b, a));
//       break;
//   }
// }

// function sortByGender(target) {
//   switch (target) {
//     case "male":
//       newFriendsArr = newFriendsArr.filter((friend) =>
//         compareByGender(friend, "male")
//       );
//       break;
//     case "female":
//       newFriendsArr = newFriendsArr.filter((friend) =>
//         compareByGender(friend, "female")
//       );
//       break;
//     case "all":
//       newFriendsArr = users;
//       break;
//   }
// }

// function filterBySearch(target, arr) {
//   if (target.name === "name") {
//     newFriendsArr = arr.filter((friend) => {
//       let friendFullName = friend.name.first + " " + friend.name.last;
//       friendFullName = friendFullName.toLowerCase();
//       let tempTarget = target.value.toLowerCase();
//       if (friendFullName.indexOf(tempTarget) >= 0) return true;
//     });
//   }
// }

// function resetFilters(arr) {
//   document.querySelector(".form__button").addEventListener("click", () => {
//     newFriendsArr = [...arr];
//     cardList.innerHTML = "";
//     renderCard(newFriendsArr);
//   });
// }


function filteredUsers({ target }) {
  let filteredArr = [...users];

  console.log(target.value);
  // console.log(target.closest('input[value="age-down"]'));

  if (target.value === "age-up") {
    filteredArr.sort((a, b) => compareByAge(b, a));
  } else if (target.value === "age-down") {
    filteredArr.sort((a, b) => compareByAge(a, b));
  }

  if (target.value === "name-up") {
    filteredArr.sort((a, b) => compareByName(b, a));
  } else if (target.value === "name-down") {
    filteredArr.sort((a, b) => compareByName(a, b));
  }

  if (target.value === "male") {
    filteredArr = filteredArr.filter((friend) =>
      compareByGender(friend, "male")
    );
  } else if (target.value === "female") {
    filteredArr = filteredArr.filter((friend) =>
      compareByGender(friend, "female")
    );
  } else if (target.value === "all") {
    filteredArr;
  }

  if (searchInput.value !== "") {
    filteredArr = filterBySearch(filteredArr, searchInput.value);
  }

  cardList.innerHTML = "";
  renderCards(filteredArr);
}























function filteredUsers({ target }) {
  let filteredArr = [...users];

  if (searchInput.value !== "") {
    filteredArr = filterBySearch(filteredArr, searchInput.value);
  }
  if (filterMale.checked) {
    filteredArr = filteredArr.filter((friend) =>
      compareByGender(friend, "male")
    );
  }
  if (filterFemale.checked) {
    filteredArr = filteredArr.filter((friend) =>
      compareByGender(friend, "female")
    );
  }
  if (nameUp.checked) {
    filteredArr.sort((a, b) => compareByName(b, a));
  }
  if (nameDown.checked) {
    filteredArr.sort((a, b) => compareByName(a, b));
  }
  if (ageUp.checked) {
    filteredArr.sort((a, b) => compareByAge(b, a));
  }
  if (ageDown.checked) {
    filteredArr.sort((a, b) => compareByAge(a, b));
  }

  cardList.innerHTML = "";
  renderCards(filteredArr);
}