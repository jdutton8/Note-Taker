const express = require("express");
const path = require("path");
const fs = require("fs");
const noteData = require('./db/db');
const {v4: uuidv4} = require("uuid");


const PORT = 3001;

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
    return res.json(JSON.parse(noteData));
})

app.post("/api/notes", (req, res) =>{
    const {title, text} = req.body; 
    
    if(title && text){
        
        const newNote = {
            title,
            text, 
            id: uuidv4()
        };

        fs.readFile("./db/db.json", "utf8", (err, data) =>{
            if (err){
                console.error(err);
            }else{
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);
                const stringNotes = JSON.stringify(parsedNotes);

                fs.writeFile("./db/db.json", stringNotes, (err) => err ? console.log(err) : console.log("success!"));
            }
        });

        const response = {
            status: 'success',
            body: newNote,
          };

          console.log(response);
          res.status(201).json(response);
        } else {
          res.status(500).json('Error in saving notes');
        }  
    
})




app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}!`)
);
