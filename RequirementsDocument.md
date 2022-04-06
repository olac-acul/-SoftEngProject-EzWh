---
typora-root-url: Images
---


 #Requirements Document 

Date: 22 march 2022

Version: 0.0


| Version number | Change |
| ----------------- |:-----------|
| | |


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description |
| ----------------- |:-----------:|
|   Company     |     Uses the application        |
|   Supplier     |       Provides products      |
|   Manager     |      Manages warehouse       |
|   Application administrator     |      Installs the application, maintains it, defines users, assign privileges       |
|   Inventory manager     |      Manages the inventory database       |
|   Quality office     |      Performs quality check on the products       |
|    Competitor   |      Provides the same kind of service      |
|   Organizational unit   |      Orders and receives products       |
|   Delivery unit     |      Collects, prepares and delivers items to pick up areas      |
|   Payment system     |      Handles payments       |


# Context Diagram and interfaces

## Context Diagram
\<Define here Context diagram using UML use case diagram>


\<actors are a subset of stakeholders>

Supplier
Manager
Application administrator
Inventory manager
Quality office
Organizational unit
Payment system

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Supplier     | GUI | Mouse, keyboard on PC |
|   Manager     | GUI | Mouse, keyboard on PC |
|   Application administrator     | GUI + command line interface | Mouse, keyboard on PC  |
|   Inventory manager     | GUI | Mouse, keyboard on PC |
|   Quality office     | GUI | Mouse, keyboard on PC |
|   Organizational unit     | GUI | Mouse, keyboard on PC |
|   Payment system     | API, see https://developer.visa.com/docs | Internet connection |

# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>



# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

| ID        | Description  |
| ------------- |:-------------:|
|  FR1     | Manage users and privileges |
|  FR1.1     | Create a new user  |
|  FR1.2     | Modify an existing user  |
|  FR1.3     | Delete a user |
|  FR2     | Manage orders |
|  FR2.1     | Trace the status of both internal and external orders |
|  FR2.2     | Manage internal orders |
|  FR2.2.1    | Issue new internal orders by organizational units |
|  FR2.2.2     | Estimate the delivery time of an internal order |
|  FR2.2.3     | Manage deliveries to the organizational units |
|  FR2.3     | Manage external orders |
|  FR2.3.1     | Issue new external orders to suppliers |
|  FR2.3.2     | Sort the list of available suppliers by price |
|  FR2.3.3     | Sort the list of available suppliers by time |
|  FR2.3.4     | Handle payments for external orders |
|  FR2.3.5     | Deal with received external orders according to the result of the quality check |
|  FR3     | Manage products |
|  FR3.1     | Search a product and show its details |
|  FR3.2     | Add a new type of product to the inventory |
|  FR3.3     | Delete a specific type of product from the inventory |
|  FR3.4     | Modify a product type (suppliers, location, etc.) |
|  FR4     | Manage physical space |
|  FR4.1     | Monitor the amount of available space |
|  FR4.2     | Indicate free sections |
|  FR5     | Manage user specified notifications |


## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability  | Users should be able to use the application with less than two hours of education | All FR|
|  NFR2     | Performance | All functions should complete in less than 0.5 second |All FR|
|  NFR3     | Portability| |All FR|
| NFRx .. | | | |


# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>


\<next describe here each use case in the UCD>
### Use case 1, UC1
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | The administrator creates a new account and populates its fields |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |
|  2     |  |
|  ...     |  |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | The administrator modifies an existing user |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

### Use case x, UCx
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | The administrator deletes a user profile |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

### Use case x, UCx
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | The manager issues new order to a supplier |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

### Use case x, UCx
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | An organizational unit issues new internal order and the estimated time will be shown |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

### Use case x, UCx
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | Search the product and shows the results including the quantity and the location to the manager |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

### Use case x, UCx
| Actors Involved        |  |
| ------------- |:-------------:|
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     |  |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




