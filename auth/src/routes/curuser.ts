import express, { Request } from 'express';
import { curUser } from '@tk-test-org/tk-test-common';

const router = express.Router();

router.get('/api/users/currentuser', curUser,  (req: Request, res) => {
        console.log('route reached: /api/users/currentuser ');
        console.log('currentUser: ', { currentUser: req.currentUser || null });
        res.send({ currentUser: req.currentUser || null });

});

export { router as currentUserRouter };