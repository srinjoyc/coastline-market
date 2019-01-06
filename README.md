# Coastline Market Registration | React + Meteor

## Live URL

https://regflowcoastline.herokuapp.com/

**Mailer is LIVE, so emails will be sent.**

## Basic Docs

https://github.com/srinjoyc/coastline-market/wiki/Key-Libraries

https://github.com/srinjoyc/coastline-market/wiki/Registration-Componenets


## Installation
**Only for MacOS**

*`curl https://install.meteor.com/ | sh`

*`cd into local repository`

*`meteor npm install`

*`meteor`

***For the mailer to work, MAIL_URL must be exported in the format export MAIL_URL=smtp://username@domain.com:password@smtp.domain.com:port/***


#### Models
- User with filled in form data stored in their profile field (see wiki)

#### Pages/Routes
- '/' home -> start registration flow
- '/users-list' -> shows json dump of users in db.
