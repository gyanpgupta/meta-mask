import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

require('dotenv').config();

const app = express();

/*
---------------------
	 Middleware
---------------------
*/
app.use(bodyParser.json());
app.use(cors());

/*
--------------------------
	Server Configuration
--------------------------
*/
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server listening on ${port}`));
