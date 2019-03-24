
//check session variable
$(document).ready(
    () => {
        new Vue({
            el: '#userLogin',
            created: function () {
                //check if session is available
                $.ajax({
                    url: "/checkSession",
                    type: "POST",
                    success: (data) => {
                        if (data.status === "success") {
                            let cleanNode = document.getElementById("userLogin");
                            while (cleanNode.lastChild) {
                                cleanNode.removeChild(cleanNode.lastChild);
                            }
                            let newDiv = document.createElement('h3');
                            newDiv.innerText = "Welcome " + data.name;

                            document.getElementById("userLogin").appendChild(newDiv);
                            document.getElementById("checkout").style.display = "block";
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
