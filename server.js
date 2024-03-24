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

app.use(express.static(__dirname + '/public'));

// nodemon 임시로 사용가능한 명령어 : Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

app.get('/', function(요청, 응답) {
  응답.sendFile(__dirname + '/index.html')
})

app.get('/news', ()=>{
  db.collection('post').insertOne({title : '어쩌구'})
})

app.get('/list', async (요청,응답)=>{
  let result = await db.collection('post').find().toArray()
  console.log(result[0].title)
  응답.send('db에 있던 게시물')
})