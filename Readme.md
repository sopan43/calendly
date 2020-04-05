# CALENDLY: booking you meetings without making a trouble of emails

## Highlights
For API structure please refer calendly-postman.json file

Signup:- User need to create account and Login to access the APIs. Two user with same email cantnot be created.

Login:- In order to create slots and book them you must me login. After login you get a token which must me pass as Authorization header in all other APIs. (in Postman the recived token will be added as env variable as token. If you get error then please do it manually).

Create Slots:- You can create your available by giving the details. the end_time cannot be before the start_time and the start_time cannot be less then current time.

List Slots:- You can view all available slots of a user by giving the user id and date for which you want to view available slots. 

Book Slot:- You can book a availabe slot of anothe user by provding the slot id give the list api.

Add to google calender:- By giving the booking _id you can add this to you google calender. (You must be creator of the slot or the user how had make the booking)

## Development Notes

Language:- NodeJS (v12.3.1)
Framework:- Express
Database:- MongoDB (mLab as cloud DB sloution)
Server:- Heroku


Note:- For sensitive information such as DB user,DB Password, google client id, google client secrate and token related information I have user env variables, so you might face difficulty while runing it in local. For google calender currently using oAuth using personal account so you will recive an e-mail from sopanmittal@gmail.com after adding it to google calender.