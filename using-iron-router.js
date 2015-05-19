Articles = new Meteor.Collection('articles');

Router.configure({
  layoutTemplate: 'Layout',
  loadingTemplate: 'Loading'
});

Router.plugin('authorize', {
  only: ['article.new'],
  notAuthorizedRoute: 'home'
});

Router.use(Router.bodyParser.json());

Router.route('/', {name: 'home'});
Router.route('/blog/new', {name: 'article.new'});
Router.route('/blog/:_id', {name: 'article.show'});

Router.route('/webhooks/stripe', {name: 'webhooks.stripe', where: 'server'})
  .get('get')
  .post('post');

if (Meteor.isServer) {
  var Future = Npm.require('fibers/future');

  Meteor.publish('articles', function () {
    var future = new Future;

    // simulate a 5 second delay before the subscription
    // is "ready"
    setTimeout(Meteor.bindEnvironment(function () {
      future.return(Articles.find());
    }), 5000);

    return future.wait();
  });

  Meteor.publish('article', function (id) {
    return Articles.find({_id: id});
  });

  Meteor.startup(function () {
    if (Articles.find().count() > 0)
      return;

    for (var i = 0; i < 3; i++) {
      Articles.insert({
        title: 'Blog Article ' + i,
        body: 'This is the text body for the article I want to show.',
        createdAt: new Date,
        author: 'Chris Mather'
      });
    }
  });
}
