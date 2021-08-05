import express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';

export const servicesRoutes = express.Router();

/*
-----------------
    Auth Routes
-----------------
*/
servicesRoutes.use('/auth', authRouter);

/*
-----------------
    User Routes
-----------------
*/
servicesRoutes.use('/user', userRouter);
