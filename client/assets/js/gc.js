check();
var googleUser = {};

// Client ID and API key from the Developer Console
var CLIENT_ID = '547124584046-erv89dlvt396mtdaa6lr8cudcqfnvgbu.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDiZPKCy4ocLSI1rRE6a3R0Tb5un6ixlzQ';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('login-google');
var signoutButton = document.getElementById('logout');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);  
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    cookiepolicy: 'single_host_origin',
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    
    handleAuthClick(authorizeButton);
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    listUpcomingEvents();
  } else {
    appendPre('Not connected');
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(element) {
  gapi.auth2.getAuthInstance().attachClickHandler(element, {},
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

/**
 *  Sign out the user upon button click.
 */

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}