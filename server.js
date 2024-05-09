const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb') // id 찾을려면
const methodOverride = require('method-override')
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.use(methodOverride('_method')) 

let db
const url = process.env.MONGO_URL;
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(3000, () => {
    console.log('http://localhost:3000 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})

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
  //ejs에서 사용할 수 있는 변수명이 글목록임
})

app.get('/write', (req, res) => {
  res.render('write.ejs')
})

//add는 /write폼에서 입력 후 제출 누르면 /add요청이 되도록 설계되어있음
app.post('/add', async (요청, 응답) => {
  if (요청.body.title == '') {
    응답.send('제목안적었는데')
    //제목 안적으면 디비에 저장안되게 예외처리하기
  } else {
    await db.collection('post').insertOne({ title : 요청.body.title, content : 요청.body.content })
    // db에 title과 content 타이틀로 저장, insertOne으로 document 발행가능
    응답.redirect('/list') 
  }



  // 위의 코드 오류시 아래코드 ㄱㄱ
  // try {
  //   if (요청.body.title == '') {
  //     응답.send('제목안적었는데')
  //     //제목 안적으면 디비에 저장안되게 예외처리하기
  //   } else {
  //     await db.collection('post').insertOne({ title : 요청.body.title, content : 요청.body.content })
  //     // db에 title과 content 타이틀로 저장
  //     응답.redirect('/list') 
  //   }
  // } catch (e) {
  //   console.log(e)
  //   응답.status(500).send('서버에러남')
  // } 
})
//detail/:id라고 해논건 게시물이 100개면 일일이 1부터 100까지 다 app.get해줘야하기때문에 앞에 :을 붙여서 처리하도록 함
app.get('/detail/:id', async (요청, 응답) => {
  try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
    if (result == null) {
      응답.status(400).send('그런 글 없음')
    } else {
      응답.render('detail.ejs', { result : result })
    }
    
  } catch (err){
    응답.send('이상한거 넣지마라')
  }

})

app.get('/edit/:id', async (요청, 응답) => {
  let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
  응답.render('edit.ejs', {result : result})
})

app.put('/edit', async (요청, 응답)=>{
  await db.collection('post').updateOne({ _id : new ObjectId(요청.body.id) },
    {$set : { title : 요청.body.title, content : 요청.body.content }
  })
  응답.redirect('/list')
}) 

app.get('/abc/:id', async (요청, 응답) => {
  console.log(요청.params)
})

app.delete('/delete', async (요청, 응답) => {
  let result = await db.collection('post').deleteOne( { _id : new ObjectId(요청.query.docid) } )
  응답.send('삭제완료')
})


app.get('/list/:id', async (요청, 응답) => {
  let result = await db.collection('post').find()
    .skip( (요청.params.id - 1) * 5 ).limit(5).toArray() 
  응답.render('list.ejs', { 글목록 : result })

}) 

app.get('/list/next/:id', async (요청, 응답) => {
  let result = await db.collection('post').find({_id : {$gt : new ObjectId(요청.params.id) }}).limit(5).toArray()
  응답.render('list.ejs', { 글목록 : result })
}) 
