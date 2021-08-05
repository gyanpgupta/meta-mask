import express from 'express';

import controller from './controller';

const { create } = controller;
export const authRouter = express.Router();

/*
------------------
    Auth API
------------------
*/
authRouter.route('/').post(create);
