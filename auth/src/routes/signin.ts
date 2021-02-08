import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestErr } from  '@tk-test-org/tk-test-common';
import { User } from '../dbmodels/user';
import { PassHash } from '../services/pwdhash';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',  
    [
        body('mail').isEmail().withMessage('Invalid email address provided !'),
        body('pass').trim().notEmpty().withMessage(' Password information must be provided ! ')
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const {mail, pass} = req.body;
        const exstUsr = await User.findOne({ email: mail });
        if (!exstUsr) {
            //throw new BadRequestErr(' Login request failed ! ');
            return res.status(500).send({errors: [{message: ' Login request failed ! '}]});
        }
        const pwdOk = await PassHash.compare(pass, exstUsr.password);
        if (!pwdOk) {
            //throw new BadRequestErr(' Login request failed ! ');
            return res.status(500).send({errors: [{message: ' Login request failed ! '}]});
        }
        const userJwt = jwt.sign( {id: exstUsr.id, email: exstUsr.email}, process.env.JWT_SALT!);
        req.session = { jwt: userJwt };
        res.status(200).send(exstUsr);
    });

export { router as signInRouter };