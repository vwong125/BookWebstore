$(document).ready(() => {
    console.log("cart.js has being loaded")
    let vmCart = new Vue({
        el: '#app',
        data: {
            books: {},
            // status: false,
            failure: true,
        },
        // function to run an ajax call to the server to receive information on books to load
        created: () => {
            $.ajax({
                url: "/checkSession",
                type: "POST",
                data: {
                    status: "success"
                },
                success: (data) => {
                    //check if user is logged in              
                    if (data.status === "success") {
                        $.ajax({
                            url: "/getCart",
                            type: "POST",
                            success: (data1, res) => {
                                console.log("res.rdystate" + res.ready)
                                console.log("res.status" + res.status)
                                if (data1.status === "success" && data1.cart){
                                    console.log(data1.cart)
                                    
                                    this.books = data1.cart
                                    console.log(this.books)
                                    this.status = true;
                                } else {
                                    //write your cart was empty
                                }                                
                            },
                            complete: (jqXHR, textStatus)=>{
                                if (this.status && textStatus == "success"){
                                    console.log("complete " + data1)
                                }
                            },           
                        })
                    } else {
                        window.location.href = "/search.html";
                    }
                },
                
                error: function (data) {
                    console.log('An error occurred. checkOUT in cart.js');
                    console.log(data);
                },
            })

            
        },
        methods: {
            openForm: () => {
                document.getElementById("myForm").style.display = "block";
            },
            closeform: () => {
                document.getElementById("myForm").style.display = "none";
            },
        }
    })

})
