# QuickStart

## Installation

### With modern build process
```npm i --save clearblade-js-client```

```javascript
import 'clearblade-js-client/lib/mqttws31'; 
import { ClearBlade } from 'clearblade-js-client';

const cb = new ClearBlade();
```

### With script tag


Download and place https://raw.githubusercontent.com/ClearBlade/JavaScript-API/master/index.js as well as https://raw.githubusercontent.com/ClearBlade/JavaScript-API/master/lib/mqttws31.js inside your project directory and include them in your HTML file's header

## Usage
The ClearBlade object attaches to window after being included.

Calling ClearBlade.init(configObject) will initialize ClearBlade settings and functions and pass it as an argument to a callback.

```javascript

ClearBlade.init({
	URI: 'platform address',  // e.g., 'https://platform.clearblade.com'
	systemKey: 'theSystemKey',
	systemSecret: 'theSystemSecret',
	email: "userEmail",  // use registerEmail instead if you wish to create a new user
	password: "userPassword",
	callback: initCallback,
});

function initCallback(err, cb) {  // err is a boolean, cb has APIs and constructors attached
	if (err) {
	  throw new Error(cb);
	} else {
	  var collection = cb.Collection();
	  collection.fetch(someQuery, collectionFetchCallback(err, rows) {
	  	if (err) {
		  	throw new Error(rows);
		} else {
			// do something with the collection rows
		}
	  });

	  var messaging = cb.Messaging();
	  messaging.subscribe('someTopic', {timeout: 120}, subscribeCallback(err, message) {
	  	if (err) {
	  		throw new Error(message);
	  	} else {
	  		// do something with response
	  	}
  	});

	}
}

```


# API Reference

## Setup
var cb = new ClearBlade();
#### cb.init(Options)
		Options // object
		* systemKey // string
			Required. The systemKey of the system to connect to. Retrievable from the Console's System Settings.
		* systemSecret // string
			Required. The systemSecret of the system to connect to. Retrievable from the Console's System Settings.
		* logging // boolean
		    Enable logging by setting logging key to true.
		* email // string
			Email of non-dev user to connect to system as. If registerUser key is not provided, the user must be registered through the Auth tab of the console, and given appropriate roles.
		* password // string
			Password of non-dev user to connect to system as.
		* registerUser // boolean
			If registerUser key is present and set to true, a new user will be created in the system using the values set to email and password.
		* callback // function
			Callback to be asynchronously fired when the connection to the system is established.
		* callTimeout // integer
			Seconds to wait before timing out requests
		* URI
			Platform instance to connect to. Defaults to "https://platform.clearblade.com" if not provided.
		* messagingURI
			Platform instance to connect to for messaging. Defaults to "platform.clearblade.com" if not provided.
		* messagingPort
			Port to use when connecting to messaging server.
## Authentication
#### cb.setUser(email, authToken)
		Set which user will make requests to the platform
		* email // string
			Required. The email of the user
		* authToken // string
			Required. The authToken returned by the platform as an argument to the init callback
#### cb.registerUser(email, password, callback)
		Register a new user with the platform.
		* email // string
			Required. The email of the new user
		* password // string
			Required. The password of the new user
		* callback // function
			Asynchronously fired after user is registered with the platform
#### cb.isCurrentUserAuthenticated(callback)
		Check if currently set user has an active session in the platform
		* callback // function(err, response)
			Asynchronously fired after response is received
#### cb.logoutUser(callback)
		End session for currently set user
		* callback // function(err, response)
			Asynchronously fired after platform returns repsonse
#### cb.loginAnon(callback)
		Authenticate with platform as anonymous user
		* callback // function(err, response)
			Asynchronously fired after platform creates new anonymous session
#### cb.loginUser(email, password, callback)
		Authenticate with platform as provided user
		* email // string
			Required. The email for an existing user
		* password // string
			Required. The password for an existing user
		* callback // function(err, response)
			Asynchronously fired after platform creates new session for provided user
## Collections
#### var collection = cb.Collection(Options)
		Options // object or serialized string
		Required. Provide either:
		* collectionName
			Name of the collection on current system to connect to.
		* collectionID
			ID of the collection on current system to connect to. Available on data tab of console.
#### collection.fetch(query, callback)
		Retrieve array of items from the collection
		* query // object
			key-value pairs representing column names and desired values
		* callback // function(err, dataArray)
			Asynchronously fired after platform returns response
#### collection.create(newItem, callback)
		Create new item in the collection
		* newItem // object
			Required. An object with key-value pairs representing column names and desired values
		* callback // function(err, newItem)
			Asynchronously fired after platform returns response
#### collection.update(query, changes, callback)
		Updates existing item in the collection
		* query // ClearBlade.Query
		* changes // object
			Required. An object with key-value pairs representing column names to be updated and new values
		* callback // function(err, updatedItem)
			Asynchronously fired after platform returns response
#### collection.remove(query, callback)
		Removes every item in the collection matching query
		* query // ClearBlade.Query
		* callback // function(err, removedItem)
			Asynchronously fired after platform returns response
#### collection.columns(callback)
		Retrieve column names, data types and whether the column is a primary key
		* callback // function(err, columnsArray)
			Asynchronously fired after platform returns response
#### collection.count(query, callback)
		Count items in collection matching query
		* query // ClearBlade.Query
		* callback // function(err, count)
			Asynchronously fired after platform returns response
## Query
#### var query = cb.Query(Options)
		Creates new ClearBlade.Query to be used in Collection operations
		Options // object or serialized string
		Required. Provide either:
			* collectionName
				Name of the collection on current system to connect to.
			* collectionID
				ID of the collection on current system to connect to. Available on data tab of console.
#### query.addSortToQuery(queryObj, direction, fieldName)
		Sort results according to direction by fieldName
		* queryObj // object
		* direction // string
			Required. Choose from "ASC" or "DESC"
		* fieldName // name of column to sort by
#### query.addFilterToQuery(queryObject, condition, key, value)
		Filter results accord to queryObject
		* queryObj // object
		* condition // string, choose from "=", "!=", ">", "<", ">=", "<="
		* key // string
		* value // string, integer, float
#### query.ascending(fieldName)
		Sort results ascending by fieldName
		* fieldName // string
#### query.descending(fieldName)
		Sort results descending by fieldName
		* fieldName // string
#### query.equalTo(fieldName, value)
		Query where field is equal to value
		* fieldName // string
		* value // string, integer float
#### query.greaterThan(fieldName, value)
		Query where field is greater than value
		* fieldName // string
		* value // string, integer float
#### query.greaterThanEqualTo(field, value)
		Query where field is greater than value
		* fieldName // string
		* value // string, integer float
#### query.lessThan(fieldName, value)
		* fieldName // string
		* value // string, integer, float
#### query.lessThanEqualTo(fieldName, value)
		* fieldName // string
		* value // string, integer, float
#### query.notEqualTo(fieldName, value)
		* fieldName // string
		* value // string, integer, float
#### query.matches(fieldName, regexPattern)
		* fieldName // string
		* value // string
#### query.or(otherQuery)
		* otherQuery // ClearBlade.Query
#### query.setPage(pageSize, pageNum)
		* pageSize // int
		* pageNum // int
#### query.fetch(callback)
		Execute built query and retrieve matching item(s)
		* callback // function(err, itemsArray)
#### query.update(changes, callback)
		Execute built query and update matching item(s)
		* callback // function(err, itemsArray)
#### query.remove(callback)
		Execute built query and remove matching item(s)
		* callback // function(err, itemsArray)
## Item
#### var item = cb.Item(data, collectionID)
		* data // object, contains structure of collection item
		* collectionID // string, data collection ID in current system
#### item.save(callback)
		* callback // function(err, result)
#### item.refresh(callback)
		* callback // function(err, result)
#### item.destroy(callback)
		* callback // function(err, result)
## Code Services
#### var code = cb.Code()
#### code.execute(name, options, callback)
		Run a named code service that exists on the system with options
		* name // string
			Required. The name of code service to be executed
		* options // object
			The request object to be passed to the code service function on execution
		* callback // function(err, response)
#### code.getCompletedServices(callback)
		* callback // function(err, response)
#### code.getFailedServices(callback)
		* callback // function(err, response)

## User Management
#### var user = cb.User()
ClearBlade User Object
#### user.getUser(callback)
		Retrieve info on the current set user
		* callback // function(err, userInfo)
#### user.setUser(userInfo, callback)
		Set info on the current active user
		* userInfo // object, contains key-value pairs representing the user info to be updated
		* callback // function(err, userInfo)
#### user.allUsers(query, callback)
		Return all users that match the specified query
		* query // ClearBlade.query
		* callback // function(err, usersArray)
#### user.setPassword(old, new, callback)
		Change current set user's password
		* old // string, old password of user
		* new // string, new password of user
		* callback // function(err, response)
#### user.count(query, callback)
		Return a count of all users that match the specified query
		* query // ClearBlade.query
		* callback // function(err, count)
## Messaging
#### var messaging = cb.Messaging(options, callback)
ClearBlade Messaging object
* callback // function(err, data), asynchronously fired upon error or successful connection to messaging server
#### messaging.getMessageHistory(topic, last, count, callback)
		* topic // string that signifies which topic to search
		* count // int that signifies how many messages to return; 0 returns all messages
		* last // int Epoch timestamp in seconds that will retrieve 'count' number of messages before that timestamp
		* callback - Function that handles the response from the server
#### messaging.getMessageHistoryWithTimeFrame(topic, count, last, start, stop, callback)
		* topic // string that signifies which topic to search
		* count // int that signifies how many messages to return; 0 returns all messages
		* last // int Epoch timestamp in seconds that will retrieve 'count' number of messages before that timestamp
		* start // int Epoch timestamp in seconds that will retrieve 'count' number of  messages within timeframe
		* stop // int Epoch timestamp in seconds that will retrieve 'count' number of  messages within timeframe
		* callback - Function that handles the response from the server
#### messaging.getAndDeleteMessageHistory(topic, count, last, start, stop, callback)
		* topic // string that signifies which topic to search
		* count // int that signifies how many messages to return and delete; 0 returns and deletes all messages
		* last // int Epoch timestamp in seconds that will retrieve and delete 'count' number of messages before that timestamp
		* start // int Epoch timestamp in seconds that will retrieve and delete 'count' number of  messages within timeframe
		* stop // int Epoch timestamp in seconds that will retrieve and delete 'count' number of  messages within timeframe
		* callback - Function that handles the response from the server
#### messaging.currentTopics(callback)
		Retrieve all active messaging topics on current system
		* callback // function(err, topicsArray)
#### messaging.publish(topic, payload)
		Publish payload on messaging topic via MQTT
		* topic // string
			Required. Messaging topic publish on
		* payload // object
#### messaging.publishREST(topic, payload, callback)
		Publish payload on messaging topic via HTTP
		* topic // string
			Required. Messaging topic publish on
		* payload // object
			Message payload
		* callback // function(err, data)
#### messaging.subscribe(topic, options, callback)
		Subscribe to MQTT topic
		* topic // string, messaging topic to subscribe to via MQTT
		* options // object
			onSuccess: // function(payload)
				Fired on successful subscription. Defaults to null
			onFailure: // function(err)
				Fired on error with subscription. Defaults to null
		callback // function(err, payload)
#### messaging.unsubscribe(topic, options)
		Unsubcribe from MQTT topic
		* topic // string, name of MQTT topic to unsubscribe from
		* options // object
			onSuccess: // function
				Fired on successful subscription. Defaults to null
				onSuccess: function(response)
			onFailure: // function
				Fired on error with subscription. Defaults to null
				onFailure: function(err)
#### messaging.disconnect()
		Close connection to messaging server
## MessagingStats
#### var messagingStats = cb.MessagingStats()
ClearBlade Messaging Statistics object
#### messagingStats.getAveragePayloadSize(topic, start, stop, callback)
		* topic // string that signifies which topic to search
		* start // int Epoch timestamp in seconds that will retrieve 'count' number of  messages within timeframe
		* stop // int Epoch timestamp in seconds that will retrieve 'count' number of  messages within timeframe
		* callback - Function that handles the response from the server
#### messagingStats.getOpenConnections(callback)
		* callback - Function that handles the response from the server
#### messagingStats.getCurrentSubscribers(topic, callback)
		* topic // string that signifies which topic to search
		* callback - Function that handles the response from the server
## Analytics
#### var analytics = cb.Analytics()
ClearBlade Analytics Object
Example filter object:

~~~
	{
		"scope": {
			"system": "<systemKey>"
		},
		"filter": {
			"module": "users",
			"action": "create",
			"range": {
				"start": 1493010000,
				"end": 1493137098
			}
		}
	}
~~~
#### analytics.getStorage(filter, callback)
		* filter // filter object (see above)
		* callback - Function that handles the response from the server
#### analytics.getCount(filter, callback)
		* filter // filter object (see above)
		* callback - Function that handles the response from the server
#### analytics.getEventList(filter, callback)
		* filter // filter object (see above)
		* callback - Function that handles the response from the server
#### analytics.getEventTotals(filter, callback)
		* filter // filter object (see above)
		* callback - Function that handles the response from the server
#### analytics.getUserEvents(filter, callback)
		* filter // filter object (see above)
		* callback - Function that handles the response from the server
    
# Javadoc

The Javadoc for the JavaScript API can be found at https://docs.clearblade.com/v/3/static/jsapi/index.html

