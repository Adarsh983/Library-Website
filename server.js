require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const authRoute = require('./routes/auth');

app.use(express.json());
app.set('view-engine' , 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret : "VANAKKAMDAMAPLA",
    saveUninitialized: false,
    resave: false
}));

books = ["Batmani", "Batman"];
const PORT = process.env.PORT || 9803;

app.use(authRoute);

app.use((req , res , next) => {
    if (req.session.user == null) return res.redirect('/login');
    next();
});

app.get('/books' , (req , res) => {
    res.json(books);
});

function getDistance(book , text)
{
    book = book.toLowerCase();
    text = text.toLowerCase();
    if (text.includes(book)) return 0;
    let arr = [];
    for (let i = 0; i < book.length + 1; i++)
    {
        temp = [];
        for (let j = 0; j < text.length + 1; j++)
        {
            if (i == 0) temp.push(j);
            else temp.push(i);
        }
        arr.push(temp);
    }
    for (let i = 1; i < book.length + 1; i++)
    {
        for (let j = 1; j <= text.length; j++)
        {
            if (book[i-1] == text[j-1]) arr[i][j] = arr[i-1][j-1];
            else arr[i][j] = 1 + Math.min(arr[i-1][j] , arr[i][j-1] , arr[i-1][j-1]);
        }
    }
    return arr[book.length][text.length];
}

app.get('/' , (req, res)=> {
    books = [];
    req.session.user.books.forEach(book => {
        books.push(book);
    });
    res.json(books);
});

app.get('/search' , (req , res)=> {
    res.render("search.ejs");
});

app.post('/borrow' , (req , res) => {
    const book = req.body.book;
    let userDB = req.session.user;
    if (userDB.books.length >= 3) return res.sendStatus(403);
    const books = userDB.books;
    let hasBorrowed = false;
    books.forEach(element => {
        if (element == book) hasBorrowed = true;
    });
    if (hasBorrowed) return res.sendStatus(403);
    userDB.books.push(book);
    req.session.user = userDB;
    console.log(`${userDB.name} borrowed ${book}`);
    return res.redirect('/');
});

app.get('/books/:book' , (req , res) => {
    const maxDist = 5;
    const book = req.params.book;
    let arr = [];
    books.forEach(text => {
        const dist = getDistance(book, text);
        if (dist <= maxDist) arr.push({dist, text});
    });
    arr.sort((a , b) => {
        if (a.dist == 0 && b.dist == 0) return a.text.length - b.text.length;
        return a.dist - b.dist;
    });
    const arr2 = [];
    arr.forEach(element => {
       arr2.push(element.text); 
    });
    res.json(arr2);
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
