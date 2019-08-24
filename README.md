
# Delivery Service

### How to Use This

First build the web app by running

#### `npm run build`

Now, there are two options to run the application

## Using Docker as a Container

Make sure that you have Docker installed on your machine then run:

#### `docker-decomponse up`

After the image is built, and the server is running, the site can be accessed at:

#### `localhost`

## Serving without a Container

Make sure that you have MongoDB available on your machine then start the database server in a separated terminal:

#### `mongod`

Then, start the server using the command

#### `npm run start`

Now, the site ca be accessed at:

#### `localhost:5000`

## Testing

To test the server simply run

#### `npm run test`

Please note that the criterias are taken from problem statement with serveral added tests.

## Documentations

Since in the real life situation, the graph (the delivery map) would be stored on the server not the client, it is important to have a database to store these structures. Thus, apart from the 3 use cases, the api must also support the get query to obtain all the graph options as well as the ability to post new graph. Since the web app does not require constant connection, simple API calls are utilized.

####  Use Case 1: Delivery Cost of a Specified Route
+ GET the delivery cost of a specified route
+ URL: `/api/getRouteCost`
+ params:
	- graphId: the `_id` of the graph in the database
	- route:  the nodes separated by a dash (e.g. A-B-E)
+ returns:
	+ The cost of following the given route. "No Such Route" if the route does not exists.

####  Use Case 2: Number of Possible Routes
+ GET the number of possible delivery routes with given conditions
+ URL: `/api/getNumberOfRoutes`
+ params:
	- graphId: the `_id` of the graph in the database
	- origin: the start node
	- endpoint: the destination
	- noRepeat: whether going through the same path twice is allowed
	- maxStop: (optional) the maximum number of stop allowed
	- maxCost: (optional) the maximum cost allowed
+ returns:
	+ The number of possible routes

####  Use Case 3: Cheapest Cost between Two Nodes
+ GET the cheapest delivery route between two towns
+ URL: `/api/getCheapestCost`
+ params:
	- graphId: the `_id` of the graph in the database
	- origin: the start node
	- endpoint: the destination
+ returns:
	- The cost of the cheapest route. "No Such Route" if the route does not exists.
+  Notes:
	+  The cheapest cost is calculated using Djikstra's algorithm. To increase the efficiency, the cheapest cost to each node from the origin are stored after it is calculated. Thus, if the origin has already been used in a calculation, the server will simply respond with the stored cheapest cost.

#### Others 1: Create a New Graph
+ POST create a new graph
+ URL: `/api/createNewGraph`
+ params:
	- graph: the string representing the graph (e.g. AB1, AC4, AD10, BE3, CD4, CF2, DE1, EB3, EA2, FD1)
+ returns:
	- The `_id` of the graph in the database (Create one if not already existed. If already exists, simply returns the `_id`)
+ Notes:
	- The order of edges in the input does not matter.

#### Others 2: Get All Graphs
+ GET get all graphs
+ URL: `/api/getAllGraphs`
+ returns:
	+ The array of `_id` and the string representing each graph.

## Future Improvements
If the case of more heavy traffics, caching responses could help improve the response time.
