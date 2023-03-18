const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const notesRoutes = require('./routes/notes');
const userRoutes = require('./routes/users');
const checkAuth = require('./middlewares/checkAuth');
require('./config/db');

//inti app
const app = express();

//middlewares for good dev experience`
app.use(cors());
app.use(morgan('dev'));

//init body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app routes
app.use('/api/users', userRoutes);
app.use('/api/notes', checkAuth, notesRoutes);

//define port
const PORT = process.env.PORT || 8000;

//start server
app.listen(PORT, () => console.log(`Server is Alive on PORT:${PORT}`));
