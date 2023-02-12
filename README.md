# Backend Project

I'm just starting using Node.JS and Express to work on APIs. This project works with the [Envolope Budgeting](https://www.thebalancemoney.com/what-is-envelope-budgeting-1293682). This is part of the Backend Engineer path from Codecademy.

Since I didn't learn to work with databases yet, this will create a very simple array of envelopes, and the schema for each envelope is:

    { 
        "category" : categoryName, 
        "budget": assignedBudget 
    }

The following code will be listening on the PORT 4001 and has the following working endpoints and methods:

* ## GET /envelopes
    You will retrieve all the envelopes created. If you want to retrieve an specific envelope you can use the query parameter "name" to get it.
    For example: 

       GET http://localhost:4001/envelopes?name=savings

        Expected Response: 
        {
            "category": "savings",
            "budget": 750
        }

* ## POST /envelopes
    Allows you to create a new envelope. For example:

        POST http://localhost:4001/envelopes    
        
        {
            "category": "savings",
            "budget": 750
        }
        
        Expected Response:

        {
            "response": "Envelope Added"
        }


* ## PUT /envelopes/{{category}}
    Allows you to update the information on an envelope, such as the category and the budget assigned. For example
        
        PUT http://localhost:4001/envelopes    
        
        {
            "category": "savings",
            "budget": 750
        }
        
        Expected Response:

        {
            "response": "Envelope Updated"
        }

* ## DELETE /envelopes/{{envelopeCategory}}
    Deletes an envelope with its category name.


* ## POST /envelopes/transfer/{{from}}/{{to}}
    Allows you to transfer part of your budget from one envelope to another. You need to specified the amount you want to transfer. For Example:

        POST http://localhost:4001/envelopes    
        
        {
            "budget": 750
        }
        
        Expected Response:

        {
            "response": "Envelope transfer succesful"
        }

This will be updated on the future, but this is a first approach for this project.