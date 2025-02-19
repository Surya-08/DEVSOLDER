# DEV Solder API's

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userConnectionsRouter

- GET /connections
- GET /request/received
- GET /feed ---- gets u the users of other users in the platform

Status - intrested, ignored, accepted, rejected
