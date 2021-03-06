import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import './database/db';

import { servicesRoutes } from './services';

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
-----------------------------
	API Route mount on /api
-----------------------------
*/
app.use('/api', servicesRoutes);

/*
--------------------------
	Server Configuration
--------------------------
*/
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server listening on ${port}`));
