$(document).ready(() => {
    console.log("cart.js has being loaded")
    let vmCart = new Vue({
        el: '#app',
        data: {
            books: {
                status: "failed",
                cart: {}
            },
            failure: true,
        },
        // function to run an ajax call to the server to receive information on books to load
        created: function () {
            
            $.ajax({
                url: "/getCart",
                type: "POST",
                success: (data1) => {
                    
                    if (data1.status === "success"){
                        console.log(data1.cart)   
                        this.books = data1.cart;                        
                    } else {
                        failture = false;
                        //write your cart was empty
                    }                                
                },                      
            })           
        },        
    })
})
