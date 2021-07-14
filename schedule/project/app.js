const express = require('express')
const app = express()
const router = require('./router/router.js')
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path');
const passport = require('passport')
let port = (process.env.PORT || '3001');

app.use(express.json())
app.use(cors());
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router)
app.use(passport.initialize())

app.use((req, res, next) => { // 404 처리 부분
    res.status(404).send('일치하는 주소가 없습니다!');
});
app.use((err, req, res, next) => { // 에러 처리 부분
    console.error(err.stack); // 에러 메시지 표시
    res.status(500).send('서버 에러!'); // 500 상태 표시 후 에러 메시지 전송
});

app.listen(port);

module.exports = app;