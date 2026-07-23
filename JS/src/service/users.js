$("#RegisterForm").on("submit", function (e) {

    e.preventDefault();

    let mode = $("#Registeration .title").text(),
        users = JSON.parse(localStorage.getItem("Users")) || [];

    // ================= Register =================
    if (mode === "Register") {

        let user = {
            UserName: $("#UserName").val().trim(),
            Email: $("#Email").val().trim(),
            Password: $("#Password").val().trim(),
            WatchList: []
        },

            confirmPassword = $("#ConfirmPassword").val().trim();

        if (!Regex.UserName.test(user.UserName))
            return alert("Invalid UserName");

        if (!Regex.Email.test(user.Email))
            return alert("Invalid Email");

        if (!Regex.Password.test(user.Password))
            return alert("Password must contain at least 8 characters, one letter and one number.");

        if (user.Password !== confirmPassword)
            return alert("Passwords do not match.");

        if (users.some(u => u.Email === user.Email))
            return alert("Email already exists.");

        if (users.some(u => u.UserName === user.UserName))
            return alert("UserName already exists.");

        users.push(user);

        saveUsers(users);
        saveCurrentUser(user);

        alert(`Welcome ${user.UserName}`);

        closePopup();
        updateUserMenu();
        updateWatchListCount();
        renderWatchList();

        return;
    }

    // ================= Login =================

    let userName = $("#UserName").val().trim(),
        password = $("#Password").val().trim(),

        user = users.find(u =>
            u.UserName === userName &&
            u.Password === password
        );

    if (!user)
        return alert("Wrong UserName or Password");

    saveCurrentUser(user);

    alert(`Welcome ${user.UserName}`);

    closePopup();
    updateUserMenu();
    updateWatchListCount();
    renderWatchList();
});

function currentUser() {
    return JSON.parse(localStorage.getItem("CurrentUser"));
}

function saveCurrentUser(user) {
    localStorage.setItem("CurrentUser", JSON.stringify(user));
}

function saveUsers(users) {
    localStorage.setItem("Users", JSON.stringify(users));
}

function Logout() {

    localStorage.removeItem("CurrentUser");

    updateWatchListCount();
    renderWatchList();
    ChangeButtonWatchList();
    updateUserMenu();

    closePopup();
}