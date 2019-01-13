// startApp();

$('#register').click(function (event) {
    event.preventDefault();
    $('#login-area').hide();
    $('#register-area').show();
    $('#main-content').hide();
})

$('#login').click(function (event) {
    event.preventDefault();
    isGuest()
})

$('#login_submit').click(function(event) {
    event.preventDefault();
    let data = {
        email: $('#email_login').val(),
        password: $('#password_login').val()
    }
    if ( !$('#email_login').val() ||  !$('#password_login').val()) {
        swal("Error", "Email / Password cannot be empty", "error");
    } else {
        login(data);
    }
})

$('#register_submit').click(function (event) {
    event.preventDefault();
    if ( !$('#email_register').val() ||  !$('#password_register').val() || !$('#fullname_register').val()) {
        swal("Error", "Email, Password and Fullname cannot be empty", "error");
    } else if ($('#password_register').val() != $('#confirm_password_register').val()){
        swal("Error", "Password and Password Confirmation did not match", "error");
    } else {
        let data = {
                fullname: $('#fullname_register').val(),
                email: $('#email_register').val(),
                password: $('#password_register').val(),
                picture_url: $('#picture_url_register').val()
            }
        register(data);
    }
})

$('#logout').click(function (event) {
    event.preventDefault();
    localStorage.clear();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        swal("Success", "User signed out.", "success");
    });
    check();
})



function isGuest() {
    $('#main-content').hide();
    $('#login-area').show();
    $('#register-area').hide();
}

function isLogin() {
    $('#main-content').show();
    $('#login-area').hide();
    $('#register-area').hide();
}

function check() {
    if (!localStorage.getItem('token_todo')) {
        isGuest();
    } else {
        $.post({
            url: 'http://localhost:3000/login/token',
            headers: {
                token: localStorage.getItem('token_todo')
            }
        }).done(response => {
            $('#avatar').attr('src', localStorage.getItem('picture_url'));
            $('#fullname').text(localStorage.getItem('fullname'));
            loadData();
            swal("Welcome", "Login Succes", "success")
            isLogin();
        }).fail( error => {
            localStorage.clear();
            check();
        })
    }
}

function register(params) {
    $.post({
        url: 'http://localhost:3000/register',
        data: params
    }).done( response => {
        setLocal(response);
    }).fail(error => {
        let errors = [];
        for (const key in error.responseJSON.error.errors) {
            errors.push(error.responseJSON.error.errors[key].message)
        }
        console.log(errors.join('\n'));
        
        swal("Error", errors.join(','), "error");
    })
}

function login(params) {
    $.post({
        url: 'http://localhost:3000/login',
        data: params
    }).done( response => {
        setLocal(response);
    }).fail(error => {
        swal("Error", error.responseJSON.error, "error");
    })
}

function setLocal(response) {
    localStorage.setItem('token_todo', response.token);
    localStorage.setItem('picture_url', response.picture_url);
    localStorage.setItem('fullname', response.fullname);
    check();
}

