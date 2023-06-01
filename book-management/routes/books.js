const express = require('express');

const router = express.Router(); 


const { getallbooks, getbookbyid, createbooklist, updatebook, deletebook } = require("../controller/books");

router.get("/getallbooks", getallbooks);

router.post("/createbooklist", createbooklist);

router.get("/getbookbyid/:id", getbookbyid);

router.put("/updatebook/:id",updatebook );

router.delete("/deletebook/:id", deletebook);



module.exports = router; 