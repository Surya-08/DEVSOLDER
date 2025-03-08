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

- POST /request/send/:status/:userId
  --- ---- corner cases:

  1. allow only for interested and ignored
  2. once request is sent to other user , it can't be sent again i.e., request is sent only once and receiver and sender can't be same
  3. Check if the users are from DB or not bc'z of attacks i.e., any data can be sent in req body . so check if the users are from our db i.e., they are registered to devSolder or not
  4. Can't send request to fromUserId to fromUserId ... i.e., request to same account cannot be sent

- POST /request/review/:status/:requestId

## userConnectionsRouter

- GET /connections
- GET /user/requests/received
- GET /user/feed ---- gets u the users of other users in the platform

Status - intrested, ignored, accepted, rejected
