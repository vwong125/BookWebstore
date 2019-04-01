

//check session variable
$(document).ready(
    () => {
        var logStuff = new Vue({
            el: '#userLogin',
            created: function () {
                // check if session is available
                $.ajax({
                    url: "/checkSession",
                    type: "POST",
                    success: (data) => {
                        if (data.status === "success") {
                            let cleanNode = document.getElementById("userLogin");
                            while (cleanNode.lastChild) {
                                cleanNode.removeChild(cleanNode.lastChild);
                            }
                            
                            let newName = document.createElement('h3');
                            newName.innerText = "Welcome " + data.name;
                            document.getElementById("userLogin").appendChild(newName);
                            document.getElementById("checkout").style.display = "block";
                            document.getElementById("signup").style.display = "none";

                            let newlogOut = document.createElement('button');
                            newlogOut.innerText = "Log Out";
                            newlogOut.classList = "logbuttons";
                            newlogOut.onclick = logout;
                            document.getElementById("userLogin").appendChild(newlogOut);

                        }
                    },
                    error: function (data) {
                        console.log('An error occurred.');
                        console.log(data);

                    },
                })

                //overwrite login behaviour
                $("#loginbtn").click((e) => {
                    // console.log("cheese");
                    e.preventDefault();

                    let user = document.getElementById("getUserID").value;
                    let psw = document.getElementById("psw").value

                    if (!user || !psw) {
                        window.alert("Your username or password sucks. Try again")
                    } else {
                        $.ajax({
                            url: "/userInfo",
                            type: "POST",
                            data: {
                                type: "getUserInfo",
                                user: user,
                                psw: psw
                            },
                            success: (data) => {
                                if (data.status === "success") {
                                    let cleanNode = document.getElementById("userLogin");
                                    while (cleanNode.lastChild) {
                                        cleanNode.removeChild(cleanNode.lastChild);
                                    }
                                    let newDiv = document.createElement('h3');
                                    console.log("client work happening")
                                    let f = data.first.trim();
                                    let fmod = f.charAt(0).toUpperCase() + f.substring(1, f.length);
                                    let l = data.second
                                    let lmod = l.charAt(0).toUpperCase() + l.substring(1, l.length);
                                    let fullname = fmod + " " + lmod;


                                    newDiv.innerText = fullname;
                                    document.getElementById("userLogin").appendChild(newDiv);
                                    document.getElementById("checkout").style.display = "block";
                                    document.getElementById("signup").style.display = "none";

                                    let newlogOut = document.createElement('button');
                                    newlogOut.innerText = "Log Out";
                                    newlogOut.classList = "logbuttons";
                                    newlogOut.onclick = logout;
                                    document.getElementById("userLogin").appendChild(newlogOut);

                                } else {
                                    window.alert("Your username or password doesnt exist")
                                }
                            },
                            error: function (data) {
                                console.log('An error occurred.');
                                console.log(data);
                            },
                        })
                    }

                })
            },
            methods: {
                openForm: () => {
                    document.getElementById("myForm").style.display = "block";
                },
                closeform: () => {
                    document.getElementById("myForm").style.display = "none";
                },
                
            },

        })
    }


)
function logout() {
    $.ajax({
        url: "/endSession",
        type: "POST",
        success: (data) => {
            if (data.status === "success") {
                window.location.href="/";
            }
        },
        error: function (data) {
            console.log('An error occurred.');
            console.log(data);
        },
    })
}

module.exports = logout;
