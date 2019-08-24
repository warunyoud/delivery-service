# Delivery Service

## How to Use This

First build the web app by running

#### `npm run build`

Now, there are two options to run the application

### Using Docker as a Container

Make sure that you have Docker installed on your machine then run:

#### `docker-decomponse up`

After the image is built, and the server is running, the site can be accessed at:

#### `localhost`

### Serving without a Container

Make sure that you have MongoDB available on your machine then start the database server in a separated terminal:

#### `mongod`

Then, start the server using the command

#### `npm run start`

Now, the site ca be accessed at:

#### `localhost:5000`
