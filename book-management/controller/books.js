const books = require("../models/booksschema"); 

exports.getallbooks = async (req, res) => {
    try {
    const book = await books.find();
    res.json(book);
        
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
        console.log(error);
    }
}

exports.getbookbyid = async (req, res) => {
  try {
    const book = await books.findById(req.params.id);
    if(!book){
        res.status(404).json({ error: "Requested book not found"});
    }else{
        res.json(book);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error"});
    console.log(error);
  }
}

exports.createbooklist = async (req, res) => {
    try {
     const {Title, Author} = req.body; 

     if(!Title.trim()){
        return res.json({ msg: "Please input the valid data"})
     }; 
     if(!Author.trim()){
        return res.json({ msg : "Please input the valid data"})
     }

     //check if book name is already there

    const existingbookTitle = await books.findOne({Title}); 
    if(existingbookTitle) {
        return res.json({ Error: "Book already exists"})
    }

    //Create a new book

    const book = await new books({
        Title,
        Author
    }).save();
        

    //Send Response 
    res.json({
        books: {
            Title: book.Title,
            Author: book.Author,
            Description: book.Description,
            PublishedYear: book.PublishedYear
        }
    })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
        console.log(error);
    }
}

exports.updatebook = async (req, res) => {
    try {
        const book = await books.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!book){
            return res.status(404).json({ error: 'Book not found' });
        }else{
            res.json({book})
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
        console.log(error);
    }
}

exports.deletebook = async (req, res) => {
    try {
        const book = await books.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({ error: "Book not found"});
        }else{
            res.status(204).json({book});
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
        console.log(error);
    }
}
