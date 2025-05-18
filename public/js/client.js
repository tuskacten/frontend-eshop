function login() {
    var username = $('#username-modal').val();
    var password = $('#password-modal').val();
    $.ajax({
        url: "login",
        type: "GET",
        async: false,
        success: function (data, textStatus, jqXHR) {
            $("#login-message").html('<div class="alert alert-success">Login successful.</div>');
            console.log('posted: ' + textStatus);
            console.log("logged_in cookie: " + $.cookie('logged_in'));
            setTimeout(function(){
                location.reload();
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#login-message").html('<div class="alert alert-danger">Invalid login credentials.</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        }
    });
    return false;
}

function register() {
    var username = $('#register-username-modal').val();
    var email = $('#register-email-modal').val();
    var password = $('#register-password-modal').val();
    var firstName = $('#register-first-modal').val();
    var lastName = $('#register-last-modal').val();
    var postvals = JSON.stringify({
		"username": username,
		"password": password,
		"email": email,
		"firstName": firstName,
		"lastName": lastName
	});
	console.log(postvals);
    $.ajax({
        url: "register",
        type: "POST",
        async: false,
	    data: postvals,
	    contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            $("#registration-message").html('<div class="alert alert-success">Registration and login successful.</div>');
            console.log('posted: ' + textStatus);
            console.log("logged_in cookie: " + $.cookie('logged_in'));
            setTimeout(function(){
                location.reload();
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#registration-message").html('<div class="alert alert-danger">There was a problem with your registration: ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}

function logout() {
    $.removeCookie('logged_in');
    location.reload();
}

function setNewPageSize(value) {
    location.search = $.query.set("page", 1).set("size", value);
}

function setNewPage(value) {
    location.search = $.query.set("page", value);
}

function setNewTags(value) {
    location.search = $.query.set("tags", value);
}

function resetTags() {
    location.search = $.query.remove("tags");
}

function order() {
    if (!$.cookie('logged_in')) {
        $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> You must be logged in to place an order.</div>');
        return false;
    }

    var success = false;
    $.ajax({
        url: "orders",
        type: "POST",
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (jqXHR.status == 201) {
                console.log("Order placed.");
                $("#user-message").html('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Order placed.</div>');
                deleteCart();
                success = true;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            response_payload = JSON.parse(jqXHR.responseText)
            console.log('error: ' + jqXHR.responseText);
            if (jqXHR.status == 406) {
                $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Error placing order. ' + response_payload.message + '</div>');
            }
        }
    });
    return success;
}

function deleteCart() {
    $.ajax({
        url: "cart",
        type: "DELETE",
        async: true,
        success: function (data, textStatus, jqXHR) {
            console.log("Cart deleted.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        }
    });
}

function addToCart(id) {
    console.log("Sending request to add to cart: " + id);
    $.ajax({
        url: "cart",
        type: "POST",
        data: JSON.stringify({"id": id}),
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
            console.log('Item added: ' + id + ', ' + textStatus);
            
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            $.get('/api/cart', {})
            .done(function(cartData) {
                $('#numItemsInCart').text(cartData.length);
                console.log('Cart data updated successfully:', cartData);
                
                // Hiển thị thông báo thành công
                showAddToCartNotification(id);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Error updating cart data:', textStatus, errorThrown);
                // Vẫn hiển thị thông báo thành công
                showAddToCartNotification(id);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not add item: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
            alert('Could not add item to cart: ' + (jqXHR.responseJSON ? jqXHR.responseJSON.message : errorThrown));
        }
    });
}

// Hàm hiển thị thông báo thêm vào giỏ hàng thành công
function showAddToCartNotification(productId) {
    // Lấy thông tin sản phẩm để hiển thị trong thông báo
    $.getJSON('/catalogue/' + productId, {}, function(product) {
        if (product) {
            // Tạo thông báo toast
            var toast = $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">' +
                '<div class="toast-header bg-success text-white">' +
                '<strong class="me-auto">Đã thêm vào giỏ hàng</strong>' +
                '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>' +
                '</div>' +
                '<div class="toast-body">' +
                '<div class="d-flex align-items-center">' +
                '<img src="' + product.imageUrl[0] + '" class="me-2" style="width: 50px; height: 50px; object-fit: cover;">' +
                '<div>' +
                '<strong>' + product.name + '</strong><br>' +
                '$' + product.price +
                '</div>' +
                '</div>' +
                '<div class="mt-2 pt-2 border-top">' +
                '<a href="basket.html" class="btn btn-primary btn-sm">Xem giỏ hàng</a>' +
                '</div>' +
                '</div>' +
                '</div>');

            // Thêm toast vào container (tạo nếu chưa có)
            var toastContainer = $('#toast-container');
            if (toastContainer.length === 0) {
                toastContainer = $('<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>');
                $('body').append(toastContainer);
            }
            
            toastContainer.append(toast);
            
            // Hiển thị toast
            var bsToast = new bootstrap.Toast(toast[0]);
            bsToast.show();
        }
    });
}

// function update To Cart(itemId, quantity, callback)
// cart/update request sent to frontend server (index.js - app.post("/cart/update" function...)
function updateToCart(id, quantity, next) {

	console.log("Sending request to update cart: item: " + id + " quantity: " + quantity);
    $.ajax({
        url: "cart/update",
        type: "POST",
        data: JSON.stringify({"id": id, "quantity": quantity}),
        success: function (data, textStatus, jqXHR) {
            console.log('Item updated: ' + id + ', ' + textStatus);
            next();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not update item: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
            next();
        }
    });
}

function username(id, callback) {
    console.log("Requesting user account information " + id);
    $.ajax({
        url: "customers/" + id,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            json = JSON.parse(data);
            if (json.status_code !== 500) {
                callback(json.firstName + " " + json.lastName);
            } else {
                console.error('Could not get user information: ' + id + ', due to: ' + json.status_text + ' | ' + json.error);
                return callback(undefined);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not get user information: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
        }
    });
}

function address() {
    var data = {
        "number": $("#form-number").val(),
        "street": $("#form-street").val(),
        "city": $("#form-city").val(),
        "postcode": $("#form-post-code").val(),
        "country": $("#form-country").val()
    };
    $.ajax({
        url: "addresses",
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Error saving the address. ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}

function card() {
    var data = {
        "longNum": $("#form-card-number").val(),
        "expires": $("#form-expires").val(),
        "ccv": $("#form-ccv").val()
    };
    $.ajax({
        url: "cards",
        type: "POST",
        async: false,
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#user-message").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> Error saving the creditcard. ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}
