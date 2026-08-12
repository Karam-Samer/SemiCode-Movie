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
            return swal.fire({
                icon: "warning",
                title: "UserName must be 3-20 characters long and contain only letters and numbers.",
                showConfirmButton: false,
                timer: 1500,
                theme: "dark",
            });

        if (!Regex.Email.test(user.Email))
            return swal.fire({
                icon: "warning",
                title: "Invalid Email",
                showConfirmButton: false,
                timer: 1500,
                theme: "dark",
            });

        if (!Regex.Password.test(user.Password))
            return swal.fire({
                icon: "warning",
                title: "Password must contain at least 8 characters, one letter and one number.",
                showConfirmButton: false,
                timer: 1500,
                theme: "dark",
            });

        if (user.Password !== confirmPassword)
            return swal.fire({
                icon: "warning",
                title: "Passwords do not match.",
                showConfirmButton: false,
                timer: 1500,
                theme: "dark",
            });

        if (users.some(u => u.Email === user.Email))
            return swal.fire({
                icon: "warning",
                title: "Email already exists.",
                showConfirmButton: false,
                timer: 1500,
                theme: "dark",
            });

        if (users.some(u => u.UserName === user.UserName))
            return swal.fire({
                icon: "warning",
                title: "UserName already exists.",
                showConfirmButton: false,
                timer: 1500,
                theme: "dark",
            });

        users.push(user);

        saveUsers(users);
        saveCurrentUser(user);

        swal.fire({
            icon: "success",
            title: `Welcome ${user.UserName}`,
            showConfirmButton: false,
            timer: 1500,
            theme: "dark",
        });

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
        return swal.fire({
            icon: "warning",
            title: "Wrong UserName or Password",
            showConfirmButton: false,
            timer: 1500,
            theme: "dark",
        }); Z

    saveCurrentUser(user);

    swal.fire({
        icon: "success",
        title: `Welcome ${user.UserName}`,
        showConfirmButton: false,
        timer: 1500,
        theme: "dark",
    });

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