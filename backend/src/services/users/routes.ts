import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../util';
import controller from './controller';

const { findByPublicAddress, getUser, createUser, updateUser } = controller;

export const userRouter = express.Router();

/*
----------------
    Get Users
-----------------
*/
userRouter.route('/').get(findByPublicAddress);

/*
---------------------
    Get User By Id
--------------------
*/
userRouter.route('/:userId').get(jwt(config), getUser);

/*
-------------------
    Create User
-------------------
*/
userRouter.route('/').post(createUser);

/*
-------------------
    Update User
-------------------
*/
userRouter.route('/:userId').patch(jwt(config), updateUser);
