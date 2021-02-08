import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { errHandler, BadRequestErr } from '@tk-test-org/tk-test-common';
import {User} from '../dbmodels/user';

const router = express.Router();

router.get('/api/users/testcookie',  async (req: Request, res: Response) => {
        const userData = {id: '123', email: 'test@test.test'};
        const userJwt = jwt.sign(userData , process.env.JWT_SALT!);

        const userExists = await User.findOne({ email: 'test@test.test' });
        if (userExists) {
            const myErr = new BadRequestErr(' Email in use already !!! ');
            return res.status(myErr.statCode).send({errors: myErr.serializeErr()});
        }

        const user = User.build({ email: 'test@test.test', password: 'test@test.test' });
        await user.save();

        req.session = { jwt: userJwt };
        res.status(200).send({jwt: userJwt });
    });
router.use(errHandler);

export { router as testcookieRouter };