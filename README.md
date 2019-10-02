# Harmonie

Keep your band up to date with real time alerts with this band management app, utilizing MongoDB/Mongoose, Express, Node.js, Twilio and more!

# App Info

This is a back-end app, with Twilio text-message integration. The data you will get back when going to our app will be in JSON. This project was to practice back-end development with the idea that it could be combined with a front-end in the future. 

There are users, bands, concerts, and rehearsals currently seeded in our database. We also performed data aggregations to find out band stats!

# How to interact with the App

Try a GET request: <br>

* https://alchemy-band-manager.herokuapp.com/api/v1/bands
* https://alchemy-band-manager.herokuapp.com/api/v1/concerts
* https://alchemy-band-manager.herokuapp.com/api/v1/rehearsals
* https://alchemy-band-manager.herokuapp.com/api/v1/bands/stats

The following two GET requests require a specific band id number in place of :bandid <br>
* https://alchemy-band-manager.herokuapp.com/api/v1/bands/:bandid/next-rehearsals
* https://alchemy-band-manager.herokuapp.com/api/v1/concerts/byband/:bandid

More complex features involve creating a user and sending out text messages to the entire band when a concert or rehearsal is added or updated.

# Tech Stack

* MongoDB
* Mongoose
* Express
* Node.js
* Jest
* Twilio
* Heroku

# Team Members:
* [sepuckett86](https://github.com/sepuckett86)
* [zbutler93](https://github.com/zbutler93)
* [carlosus](https://github.com/carlosus)

