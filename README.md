# Wordpress Clone

Wordpress clone is, as its name suggests, a very basic clone of the popular blogging website Wordpress. This project is built using the MEAN stack.

## Prerequisites

This project should be run on a system or container with the following dependencies installed:

`npm` `node` `mongo` `angular`

## Project Structure

The `blog-server` subproject contains the code for the backend, and the `angular-blog` subproject contains the code for the frontend. 

The Angular code has been built and "deployed" to the backend, under the `blog-server/public/editor/` directory. If changes are made to the frontend code, run `ng build --base-href=/editor/ --deploy-url=/editor/ --prod=true` and copy the files in `angular-blog/dist/angular-blog/` to `blog-server/public/editor/`.

## How to Run

First, set up the database by running the shell script `blog-server/db.sh`.

Then, navigate to the `blog-server` directory and run `npm start`.

Now, visit `http://localhost:3000/editor/` on your favorite browser to interact with the app.

## Future Improvements

The following represent some, but not all, future improvements that can be done to this project (time permitting):
- Containerizing the runtime environment using docker-compose
- Decouple backend and frontend
- Add styling to the frontend
- Add mechanisim to create account
