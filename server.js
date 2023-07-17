const express = require("express");
const path = require("path");
const fs = require("fs");
const noteData = require('./db/db');
const {v4: uuidv4} = require("uuid");


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get("/api/notes", (req, res) => {
    console.info(`${req.method} request received to get notes`);
    fs.readFile('./db/db.json', (err, data) => {
        if(err) throw err;

        res.json(JSON.parse(data));
    })
});


app.post("/api/notes", (req, res) =>{
    const {title, text} = req.body; 
    
    if(title && text){
        
        const newNote = {
            title,
            text, 
            id: uuidv4()
        };

        noteData.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(noteData));
        res.json(noteData);
    }
});


app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}!`)
);
