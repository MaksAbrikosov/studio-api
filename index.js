const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const creativeRoutes = require('./routes/creative')
const progressUpload = require("./functions/progressUpload")
const open = require('open');

const PORT = 5000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const progr = progressUpload()


const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
    helpers: {
        progress: () => {
            // const progress = progressUpload()
            console.log('progress', progr)
            return encodeURIComponent(JSON.stringify(progr))
        } ,
        count: (val) => encodeURIComponent(JSON.stringify(val + 1)),
    },
    // jsDir: __dirname + '/views/assets/js/',
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use('/', creativeRoutes)
app.use('/js', express.static(__dirname + '/views/assets/js'));
app.use('/css', express.static(__dirname + '/views/assets/css'));


app.listen(PORT, ()=> {
    console.log(`Server has been started on port ${PORT}...`)
    // open(`http://localhost:${PORT}/`, {app: {name: 'google chrome', }})
    open(`http://localhost:${PORT}/`)

})
