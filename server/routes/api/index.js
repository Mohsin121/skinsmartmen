const express = require( "express" );
const UserRoute = require( "./user" );
const AuthRoute = require( "./auth" );
const SessionRoute = require( "./session" );





const router = express.Router();

router.use( "/user", UserRoute );
router.use( "/auth", AuthRoute );
router.use( "/session", SessionRoute );





module.exports = router;
