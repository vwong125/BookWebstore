
$(document).ready(() => {
    console.log("cart.js has being loaded")
    let vmCart = new Vue({
        el: '#app',
        data: {
            books: {},
            failure: true,
            total_price: {amount: 0},
        },
        // function to run an ajax call to the server to receive information on books to load
        created: function () {
            $.ajax({
                url: "/getCart",
                type: "POST",
                success: (data1) => {    
                    if (data1.status === "success") {
                        console.log(data1.cart)
                        this.books = data1.cart;
                    } 
                    if (Object.keys(this.books).length > 0) {
                        this.failure = false;
                    } else {
                        this.failure = true;
                        
                    }
                    this.books.forEach(element => {
                        this.total_price.amount += parseInt(element.book_price);
                    });
                },
            })

        },
        methods: {
            removeBookFromCart: (book) => {
                console.log("removing " + book + "from backend")
                $.ajax({
                    url: "/removeBookFromCart",
                    type: "POST",
                    data: {
                        // status: "success",
                        book: book
                    },
                    success: (data) => {
                        if (data.status === "successful Delete") {
                            window.alert("Your book was successfully removed from the cart");
                            $.ajax({
                                url: "/getCart",
                                type: "POST",
                                success: (data1) => {    
                                    if (data1.status === "success") {
                                        console.log(data1.cart)
                                        vmCart.books = data1.cart;
                                    } 
                                },
                            })
                            // console.log(Object.keys(vmCart.books).length)
                            // console.log(vmCart.books.length)

                            if (Object.keys(vmCart.books).length - 1 > 0) {
                                vmCart.failure = false;
                            } else {
                                location.reload();
                            }
                            vmCart.total_price.amount -= parseInt(book.book_price);
                        } else {
                            window.alert("Error! Your Book cannot be removed from your cart");

                        }
                    }
                })
            },

            
        }
    })
})
