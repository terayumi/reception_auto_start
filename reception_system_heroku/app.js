var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
const PORT=process.env.PORT || 8000;
server.listen(PORT);
console.log('Server is running on port'+PORT);
var { Server } = require('socket.io');
const io = new Server(server);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var receptionRouter = require('./routes/reception');
var roomsRouter = require('./routes/rooms');
var accountingRouter = require('./routes/accounting');
var correctRouter = require('./routes/correct');
var callMonitorRouter = require('./routes/callMonitor');
var informationText = require('./routes/informationText');
var exchangeRouter=require('./routes/exchange');
// socket.io routes
let Data = require('./data');
let num = 0;
io.on('connection', function (socket) {
  socket.on('add', (data) => {
    let a = Data.add(data.room);
    io.emit('print', a);
    io.emit('resList', { value: Data.fileOutput() })
  })
  socket.on('call', (data) => {
    let a = Data.call('add', data.num);
    io.emit('call', a);
    io.emit('resList', { value: Data.fileOutput() });
  })
  socket.on('enter', (data) => {
    Data.changeStatus(data.num, '診察室');
    Data.call('dell', data.num);
    io.emit('resList', { value: Data.fileOutput() })
  })
  socket.on('leave', (data) => {
    Data.changeStatus(data.num, '会計');
    io.emit('resList', { value: Data.fileOutput() })
  })
  socket.on('end', (data) => {
    Data.changeStatus(data.num, '終了');
    Data.call('dell', data.num);
    io.emit('resList', { value: Data.fileOutput() })
  })
  socket.on('reqList', (data) => {
    io.emit('resList', { value: Data.fileOutput() })

  })
  socket.on('newRoom', (data) => {
    Data.changeRoom(data.num, data.newRoom);
    io.emit('resList', { value: Data.fileOutput() });
    io.emit('correct', { meth:'change' ,num: data.num, detail: data.newRoom });
  })
  socket.on('newStatus', (data) => {
    Data.changeStatus(data.num, data.newStatus);
    io.emit('resList', { value: Data.fileOutput() });
    io.emit('correct', { meth:'change' ,num: data.num, detail: data.newStatus });
  })
  socket.on('cancel', (data) => {
    Data.call('dell', data.num);
    io.emit('resList', { value: Data.fileOutput() })
    io.emit('correct', { meth:'cancel' ,num: data.num });
  })
  socket.on('infoText', (data) => {
    switch (data.meth) {
      case 'req'://モニター表示文章要求
        io.emit('resText', { text: Data.InTeOUT() });
        break;
      case 'send'://モニター表示文章送る
        io.emit('infoText', { text: data.text });
        break;
    }
  })
})




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//ルーターの登録
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/reception', receptionRouter);
app.use('/rooms', roomsRouter);
app.use('/accounting', accountingRouter);
app.use('/correct', correctRouter);
app.use('/monitor', callMonitorRouter);
app.use('/informationText', informationText);
app.use('/exchange',exchangeRouter);

app.use(express.static('public'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
