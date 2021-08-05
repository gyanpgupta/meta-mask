import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../util/';
import { User } from '../../models/user.model';

const create = (req: Request, res: Response, next: NextFunction) => {
  const { signature, publicAddress } = req.body;
  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: 'Signature and publicAddress is required.' });

  return (
    User.findOne({ where: { publicAddress } })
      /*
	------------------------------------------------------
	 	Getting the user with the given publicAddress
	------------------------------------------------------
	*/
      .then((user: User | null) => {
        if (!user) {
          res.status(401).send({
            error: `User with publicAddress ${publicAddress} is not registered.`,
          });

          return null;
        }

        return user;
      })
      /*--------------------------------------
       	  Verifying digital signature
      --------------------------------------
	  */
      .then((user: User | null) => {
        if (!(user instanceof User)) {
          // Should not happen, already sent the response
          throw new Error('User is not defined in "Verify digital signature".');
        }

        const msg = `Hey,I am signing my first nonce: ${user.nonce}`;

        /*
		---------------------------------------------
			Extracting the address from the signature
        ---------------------------------------------
		*/
        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));

        const recoveredAddress = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
        });

        if (recoveredAddress.toLowerCase() === publicAddress.toLowerCase()) {
          return user;
        } else {
          res.status(401).send({
            error: 'Signature verification failed',
          });

          return null;
        }
      })
      /*-----------------------------------------
      	  Generate a new nonce for the user
      --------------------------------------------
      */
      .then((user: User | null) => {
        if (!(user instanceof User)) {
          // Should not happen, we should have already sent the response
          throw new Error(
            'User is not defined in now Generating a new nonce for the user.'
          );
        }

        user.nonce = Math.floor(Math.random() * 10000);
        return user.save();
      })
      /*---------------------------
      	 Create JWT
      -----------------------------
       */
      .then((user: User) => {
        return new Promise<string>((resolve, reject) =>
          jwt.sign(
            {
              payload: {
                id: user.id,
                publicAddress,
              },
            },
            config.secret,
            {
              algorithm: config.algorithms[0],
            },
            (err, token) => {
              if (err) {
                return reject(err);
              }
              if (!token) {
                return new Error('Empty token');
              }
              return resolve(token);
            }
          )
        );
      })
      .then((accessToken: string) => res.json({ accessToken }))
      .catch(next)
  );
};

export default { create };
