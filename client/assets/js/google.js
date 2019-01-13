var googleUser = {};
var startApp = function() {
gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
    client_id: '547124584046-erv89dlvt396mtdaa6lr8cudcqfnvgbu.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    // Request scopes in addition to 'profile' and 'email'
    //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('login-google'));
});
};

function attachSignin(element) {
console.log(element.id);
auth2.attachClickHandler(element, {},
    function(googleUser) {
        $.post({
            url: 'http://localhost:3000/login/google',
            headers: {
                id_token: googleUser.getAuthResponse().id_token,
                'Content-Type': 'application/json'
            } 
        }).done(response => {
            if (response.token) {
                setLocal(response);
            } else {
                $('#picture_url_register').val(response.picture_url);
                $('#fullname_register').val(response.fullname);
                $('#email_register').val(response.email);
                $('#login-area').hide();
                $('#register-area').show();
                $('#main-content').hide();
            }
        }) .fail(error => {
            console.log(error);
        })
        
    }, function(error) {
        console.log(JSON.stringify(error, undefined, 2));
    });
}
