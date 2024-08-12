"use strict";
const getUsername = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
//& reusable fetch function
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
//& Displaying the fetched user data
const showResultUI = (singleUser) => {
    const { avatar_url, login, location, url } = singleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
            <img src=${avatar_url} alt=${login} />
            <hr />
            <div class = 'card-footer'>
            <img src = "${avatar_url}" alt = "${login}"/> 
            <p class = "username">${login}</p>
            <a href = "${url}">Github</a>
            </div>
        </div>`);
};
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
        }
    });
}
//& default function call on page load to get the user data
fetchUserData("https://api.github.com/users");
//& Defining search functionality
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        main_container.innerHTML = " "; // Clearing the previous search results before new ones are displayed 
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML("beforeend", `<p class = "empty-msg"> No users found with the given search </p>`);
        }
        else {
            for (const singleUser of matchingUsers) {
                showResultUI(singleUser);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
