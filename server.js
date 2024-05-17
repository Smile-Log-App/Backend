const express = require('express')
const app = express()
const port = 3000 // 선언 해줘야 함

/*app.get('/', function (req, res) { // ver1
res.send('Hello World')
})*/

/*app.use(express.json())
app.post('user/:id', (req, res) => { // exios, fetch 이용해서 body에 값을 담아 보냄(json 데이터임)
    const p = req.params
    console.log(p);
    const b = req.body
    console.log(b)

    res.send({ 'message': 'Hello world!' })
})*/

app.get('/sound/:name', (req, res) => {
    const { name } = req.params
    if (name == 'dog') {
        res.json({'sound' : 'bowwow'})
    } else if (name == 'cat') {
        res.json({ 'sound': 'meow' })
    } else {
        res.json({ 'sound': 'unknown' })
    }
})

app.get('/user/:id', (req, res) => {
/*    const q = req.params // params : 변수명으로 받기
    console.log(q.id) // q, q.id 약간다름*/
    const q = req.query // query : ?name=petite&...
    console.log(q)

    res.json({ 'userid': q.name }) // q, q.id 약간다름
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/dog', (req, res) => {
    res.send({ 'sound': 'bow wow' })
    // 한글은 인코딩 변환 사이트 이용
    // send 대신 json 써도됨
    // res.send("<a href='https://www.youtube.com/'> youtube</a>")
    // res.send('<h1>bowwow</h1>')
})

app.get('/cat', (req, res) => {
    res.send('meow')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`); // 1옆
})