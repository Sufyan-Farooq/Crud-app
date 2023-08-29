const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const app = express()
app.use(express.json())
//app.use(express.static('public'));
let dbConnection

MongoClient.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(client => {
    dbConnection = client.db()
    app.listen(4000, () => {
      console.log('app listening on port 4000')
    })
  })
  .catch(err => {
    console.log(err)
  })

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/front2.html');
  });

  app.get('/books/1', (req, res) => {
    res.sendFile(__dirname + '/public/bookfront.html');
  });
  
app.get('/books', (req, res) => {
  const page = req.query.p || 0
  const booksPerPage = Infinity;


  let books = []

  dbConnection.collection('books')
    .find()
    .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books)
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch the documents'})
    })
})

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id

  if (ObjectId.isValid(bookId)) {
    dbConnection.collection('books')
      .findOne({ _id: new ObjectId(bookId) })
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
  } else {
    res.status(500).json({error: 'Could not fetch the document'})
  }
})

app.post('/books', (req, res) => {
  const book = req.body

  dbConnection.collection('books')
    .insertOne(book)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({error: 'Could not create new document'})
    })
})

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id

  if (ObjectId.isValid(bookId)) {
    dbConnection.collection('books')
      .deleteOne({ _id: new ObjectId(bookId) })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not delete document'})
      })
  } else {
    res.status(500).json({error: 'Could not delete document'})
  }
})

app.patch('/books/:id', (req, res) => {
  const bookId = req.params.id
  const updates = req.body

  if (ObjectId.isValid(bookId)) {
    dbConnection.collection('books')
      .updateOne({ _id: new ObjectId(bookId) }, { $set: updates })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not update document'})
      })
  } else {
    res.status(500).json({error: 'Could not update document'})
  }
})
