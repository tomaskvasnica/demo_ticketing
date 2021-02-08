import express, { Request, Response} from 'express';
import { body } from 'express-validator';
// import { DbConnErr } from '../errors/dbConnErr';
import { User } from '../dbmodels/user';
import { BadRequestErr, validateRequest } from '@tk-test-org/tk-test-common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', 
    [
        body('mail').isEmail().withMessage(' Email must be valid '), 
        body('pass').trim().isLength({min: 4, max: 20}).withMessage(' Password must be 4-20 characters long')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {mail, pass} = req.body;
        const userExists = await User.findOne({ email: mail });
        if (userExists) {
            const myErr = new BadRequestErr(' Email in use already !!! ');
            return res.status(myErr.statCode).send({errors: myErr.serializeErr()});
        }

        const user = User.build({ email: mail, password: pass });
        await user.save();

        // generate jwt 
        const userJwt = jwt.sign( {id: user.id, email: user.email}, process.env.JWT_SALT!);
        req.session = { jwt: userJwt };
        //store jwt on session

        res.status(201).send(user);
});

export { router as registrRouter };