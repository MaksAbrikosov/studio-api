const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const creativeRoutes = require('./routes/creative')

const PORT = 5000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use('/', creativeRoutes)

app.listen(PORT, ()=> {
    console.log(`Server has been started on port ${PORT}...`)
})
