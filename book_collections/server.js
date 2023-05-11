const express = require("express");
const body = require('body-parser');
const app = express();
const PORT = 3000;
app.use(body.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let books = [];

app.get("/books", (req, res) => {
  res.json(books);
});

app.post("/books", (req, res) => {
  const { title, author, publishedDate } = req.body;

  const random = Math.floor(Math.random()*10000000000000)+1;
  const id = random.toString(36);

  if(!title || !author){
    res.json(`Title and Author is require....`);
  }
  else{
    books.push({ id, title, author, publishedDate });

    res.json({ id, title, author, publishedDate });
  }
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex >= 0) {
    books.splice(bookIndex, 1);
    res.json(`Book with ID ${id} successfully deleted.`);
  } else {
    res.status(404);
    res.json(`Book id ${id} not found!`);
  }
});


app.listen(PORT, () => {
  console.log(`Server Runing on ulr http://localhost:${PORT}`);
});