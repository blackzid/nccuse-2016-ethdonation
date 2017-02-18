var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.io = io;

var home = require('./routes/index');
var projects = require('./routes/projects');
var member = require('./routes/member');
var donee = require('./routes/donee');

var routes = require('./routes/controller.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', {
    layout: true
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('123456789'));
app.use(express.static(path.join(__dirname, 'public')));





// app.use('/', home);
// app.use('/projects', projects);
// app.use('/member', member);
// app.use('/donee', donee); 
app.get('/', routes.index);
app.get('/projects', routes.projects);
app.get('/projects/create', routes.createContract);
app.post('/projects/create', routes.doCreateContract);
app.get('/projects/:projectAddress', routes.project);
app.get('/projects/:projectAddress/manage', routes.manageProject);
app.post('/projects/:projectAddress/manage', routes.transferEther);
app.get('/donees', routes.donees)
app.get('/donee/create', routes.createDonee);
app.post('/donee/create', routes.doCreateDonee);
app.get('/donee/:doneeAddress', routes.donee);

app.get('/login', routes.member);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})

module.exports = app;
