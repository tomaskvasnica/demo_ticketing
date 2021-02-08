import express from 'express';
const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    req.session = null;
    res.send(' post [signout] ');
});

router.get('/api/users/signout', (req, res) => {
    req.session = null;
    res.send(' post [signout] ');
});

export { router as signOutRouter };