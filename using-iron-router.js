Router.route('/', function () {
  var isLoggedIn = Session.get('isLoggedIn');

  if (isLoggedIn)
    this.render('Home');
  else
    this.render('Login');
});

if (Meteor.isClient) {

}

if (Meteor.isServer) {

}
