const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://chlwogur2000:asd00821@test.rurjatd.mongodb.net/'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(3000, () => {
    console.log('http://localhost:3000 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})

app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));

// nodemon 임시로 사용가능한 명령어 : Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

app.get('/', function(요청, 응답) {
  응답.sendFile(__dirname + '/index.html')
})

app.get('/time', (req, res) => {
  res.render('time.ejs', { data : new Date() })
})

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray()
  응답.render('list.ejs', { 글목록 : result })
})