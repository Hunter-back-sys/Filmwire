/**
 * FilmWire
 *
 * FilmWire is a Node.js project proof of concept featuring a basic backend and database.
 * This project aims to demonstrate the fundamental structure and functionality of a Node.js
 * application with a simple database integration.
 *
 * @author Hunter O'Brien
 * @version V1.0.0
 */

const Joi = require('joi');
const Express = require('express');
const app = Express();

//Allowing the requests to be parsed by a JSON filter
app.use(Express.json());

let tempDatabase = [
    {id:1 , genre : 'Horror'},
    {id:2 , genre : 'Romance'},
    {id:3 , genre : 'Comedy'}];

/**
 * Get (Read) Requests
 */

app.get('/api/genre', (req , res) => {
    res.send(tempDatabase);
});

app.get('/api/genre/:id', (req , res) => {
    const genre = tempDatabase.find( g => g.id === parseInt(req.params.id));
    if(!genre) {
        return res.status(404).send(`Requested genre of ID: ${req.params.id} not Found`);
    }
    res.send(genre);
});

/**
 * Post (Create) Requests
 */

app.post('/api/genres', (req, res) => {
    const {error} = validateGenre(req.body);
    if(error){
        return res.status(404).send(error.details);
    };

    const newGenre = {
        id: tempDatabase.length + 1,
        genre : req.body.genre,
    }

    tempDatabase.push(newGenre);

    res.send(newGenre);
});

/**
 * Put (Update) Requests
 */

app.put('/api/genres/:id', (req, res) => {
    //Check to make sure the item exists
    const genre = tempDatabase.find( g => g.id === parseInt(req.params.id));
    if(!genre) {
        return res.status(404).send(`Requested genre of ID: ${req.params.id} not found.`);
    }
    
    const {error} = validateGenre(req.body);
    if(error){
        return res.status(404).send(error.details);
    }
    
    genre.genre = req.body.genre;
    res.send(genre);
});

/**
 * Delete (Delete) Requests
 */

app.delete('/api/genres/:id', (req, res) => {
    const genre = tempDatabase.find( g => g.id === parseInt(req.params.id));
    if(!genre){
        return res.status(404).send(`Requested genre of ID: ${req.params.id} not found.`);
    }

    const index = tempDatabase.indexOf(genre);
    tempDatabase.splice(index, 1);

    res.send(genre);
});

/**
 * Server Actions
 */

// set up port number
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port: ${port}.`)
})
/**
 * Aditional functions
 */
function validateGenre(genre){
    const schema = Joi.object({
        genre: Joi.string().min(3).max(20).required(),
    });

    return schema.validate(genre);
}