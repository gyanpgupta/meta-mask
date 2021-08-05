import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';

/*
---------------------------------
	Find User By Public Address
---------------------------------
*/
const findByPublicAddress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  const { publicAddress } = query || {};

  const whereClause =
    query && publicAddress
      ? {
          where: { publicAddress: publicAddress },
        }
      : undefined;

  return User.findAll(whereClause)
    .then((users: User[]) => res.json(users))
    .catch(next);
};

/*
---------------------
	Get User By Id
---------------------
*/
const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { params } = req;
  const { userId } = params || {};

  if ((req as any).user.payload.id !== +userId) {
    return res.status(401).send({ error: 'User not found.' });
  }
  return User.findByPk(userId)
    .then((user: User | null) => res.json(user))
    .catch(next);
};

/*
------------------
	Create User
------------------
*/
const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;

  User.create(body)
    .then((user: User) => res.json(user))
    .catch(next);
};
/*
------------------
	Update User
------------------
*/
const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { params, body } = req;
  const { userId } = params || {};

  if ((req as any).user.payload.id !== +userId) {
    return res.status(401).send({ error: 'User not found.' });
  }
  return User.findByPk(userId)
    .then((user: User | null) => {
      if (!user) {
        return user;
      }

      Object.assign(user, body);
      return user.save();
    })
    .then((user: User | null) => {
      return user
        ? res.json(user)
        : res.status(401).send({
            error: `User with publicAddress ${userId} is not found.`,
          });
    })
    .catch(next);
};

export default {
  findByPublicAddress,
  getUser,
  createUser,
  updateUser,
};
