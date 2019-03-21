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
            // $.ajax({
            //     url: "/checkSession",
            //     type: "POST",
            //     data: {
            //         status: "success"
            //     },
            //     success: (data) => {
            //         //check if user is logged in              
            //         if (data.status === "success") {
                        
            //         } else {
            //             window.location.href = "/search.html";
            //         }
            //     },
                
            //     error: function (data) {
            //         console.log('An error occurred. checkOUT in cart.js');
            //         console.log(data);
            //     },
            // })

            $.ajax({
                url: "/getCart",
                type: "POST",
                success: (data1) => {
                    // console.log("res.rdystate" + res.ready)
                    // console.log("res.status" + res.status)
                    // this.books = data1;
                    if (data1.status === "success"){
                        console.log(data1.cart)
                        
                        // this.books = data1.cart
                        
                        // this.status = true;
                        // Vue.nextTick;
                        // for(let i = 0; i < data1.cart.length;i++){
                        //     console.log("adding " + element)
                        //     this.books.$set(i, element) 
                        // }
                        // // console.log(this.books)

                        this.books = data1.cart;
                        

                        // let someObject = Object.assign({}, this.someObject,{status: "success", cart: data1.cart})
                        // this.books = someObject;
                        // Vue.$set(this.books, someObject)
                        
                    } else {
                        //write your cart was empty
                    }                                
                },
                // complete: (jqXHR, textStatus)=>{
                //     if (this.status && textStatus == "success"){
                //         console.log("complete " + data1)
                //     }
                // },           
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
