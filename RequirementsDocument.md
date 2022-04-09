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
	
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	- [Context Diagram](#context-diagram)
	- [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	- [Functional Requirements](#functional-requirements)
	- [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	- [Use case diagram](#use-case-diagram)
		- [Use case 1, UC1](#use-case-1-uc1)
				- [Scenario 1.1](#scenario-11)
				- [Scenario 1.2](#scenario-12)
				- [Scenario 1.3](#scenario-13)
		- [Use case 2, UC2](#use-case-2-uc2)
				- [Scenario 2.1](#scenario-21)
				- [Scenario 2.2](#scenario-22)
				- [Scenario 2.3](#scenario-23)
				- [Scenario 2.4](#scenario-24)
				- [Scenario 2.5](#scenario-25)
		- [Use case 3, UC3](#use-case-3-uc3)
				- [Scenario 3.1](#scenario-31)
		- [Use case 4, UC4](#use-case-4-uc4)
				- [Scenario 4.1](#scenario-41)
				- [Scenario 4.2](#scenario-42)
				- [Scenario 4.3](#scenario-43)
				- [Scenario 4.4](#scenario-44)
		- [Use case 5, UC5](#use-case-5-uc5)
				- [Scenario 5.1](#scenario-51)
				- [Scenario 5.2](#scenario-52)
		- [Use case 6, UC6](#use-case-6-uc6)
				- [Scenario 6.1](#scenario-61)
		- [Use case 7, UC7](#use-case-7-uc7)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

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
|   Application administrator     |      Installs the application, maintains it, defines users, assign privileges and define product types     |
|   Quality office     |      Performs quality check on the products       |
|    Competitor   |      Provides the same kind of service      |
|   Organizational unit   |      Orders and receives products       |
|   Delivery unit     |      Places items in the warehouse, collects, prepares and delivers them to pick up areas      |
|   Payment system     |      Handles payments       |


# Context Diagram and interfaces

## Context Diagram
\<Define here Context diagram using UML use case diagram>


\<actors are a subset of stakeholders>

Supplier  
Manager  
Application administrator  
Quality office  
Organizational unit  
Delivery unit  
Payment system  

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Supplier     | GUI | Mouse, keyboard on PC |
|   Manager     | GUI | Mouse, keyboard on PC |
|   Application administrator     | GUI + command line interface | Mouse, keyboard on PC  |
|   Quality office     | GUI | Mouse, keyboard on PC |
|   Organizational unit     | GUI | Mouse, keyboard on PC |
| Delivery Unit | GUI | Mouse, Keyboard on PC |
|   Payment system     | API, see https://developer.visa.com/docs | Internet Connection |

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
|  FR2     | Manage products |
|  FR2.1     | Search a product and show its details |
|  FR2.2     | Add a new type of product to the inventory |
|  FR2.3     | Modify a product type (suppliers, location, etc.) |
|  FR2.4     | Delete a specific type of product from the database |
|  FR3     | Manage orders |
|  FR3.1     | Update the status of both internal and external orders |
|  FR3.2     | Manage internal orders |
|  FR3.2.1    | Issue new internal orders by organizational units |
|  FR3.2.2    | Estimate the delivery time of an internal order |
|  FR3.2.3     | Manage deliveries to the pickup area |
|  FR3.3     | Manage external orders |
|  FR3.3.1     | Issue new external orders to suppliers |
|  FR3.3.2     | Sort the list of available suppliers by price or by time of delivery |
|  FR3.3.3     | Handle payments for external orders |
|  FR3.3.4     | Deal with the items received from suppliers according to the result of the quality check |
|  FR4     | Manage physical space |
|  FR4.1     | Monitor the amount of available space |
|  FR4.2     | Indicate free sections |
|  FR5     | Manage user specified notifications |


## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability  | Users should be able to use the application without any education | All FR|
|  NFR2     | Performance | All functions should complete in less than 0.5 second |All FR|
|  NFR3     | Privacy | Suppliers cannot access company internal data |All FR|
| NFR4 | Correctness | Must guarantee not more than one error per month | All FR |
| NFR5 | Reliability | Must guarantee not more than one defects at month | All FR |	


# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>


\<next describe here each use case in the UCD>
### Use case 1, UC1
| Actors Involved        | Administrator |
| ------------- |:-------------:|
|  Precondition     | Administrator A logged in |
|  Post condition     | User Account Created |
|  Nominal Scenario     | The administrator creates a new account and populates its fields |
|  Variants     | Modification of fields and access rights of a user |
|  Variants     | Delete an account |
|  Exceptions    | Creation of an account that arleady exists |

##### Scenario 1.1 

| Scenario 1.1 | The adminsitrator creates the new user |
| ------------- |:-------------:|
|  Precondition     | user account doesn't exist |
|  Post condition     | User account exist |
| Step#        |   |
|  1     | Adimistrator defines the credentials |
|  2     | Adimistrator defines access permissions and role into the company  |
|  3     | Confirms the creation |

##### Scenario 1.2

| Scenario 1.2 | The Administrator modify a user |
| ------------- |:-------------:|
|  Precondition     | User account exists |
|  Post condition     | user account modified |
| Step#        |  Description |
|  1     | Selection of the user to be modified |
|  2     | Administrator modifies credentials and/or access premission of the user   |
| 3 | Confirm the modification |

##### Scenario 1.3

| Scenario 1.3 |  Delete of a user|
| ------------- |:-------------:|
|  Precondition     | user account exists |
|  Post condition     | user account deleted |
| Step#        |  Description |
|  1     | Selection of the user to be deleted |
|  2     | Confirm the delete |
|  3     | Delete the user  |

### Use case 2, UC2
| Actors Involved        | Manager, Organizational Unit, Delivery unit |
| ------------- |:-------------:|
|  Precondition     | Organization unit logged in |
|  Post condition     | |
|  Nominal Scenario     | Manage internal order |
|Variants| Modify Existing order|
||delete existing order|
|Exception |order doesn't exist|

##### Scenario 2.1

| Scenario 2.1 | Issue new internal order |
| ------------- |:-------------:|
|  Precondition     |  |
|  Post condition     | Order created |
| Step#        |  Description |
|  1     | Organizational Unit select the products required and quantity |
|  2     | Organizational Unit confirms the order |
| 3 | Notify manager of the creation of a new order |
| 4 | Update free sections list |

##### Scenario 2.2

| Scenario 2.2 | Process created order |
| ------------- |:-------------:|
|  Precondition     | Order is arleady created |
|  Post condition     | Order is processed |
| Step#        |  Description |
|  1     | Products contained in the order are checked the availability |
|  2     |  in case the product is available mark it as ready othrwise as not ready |
| 3 | Notify the Delivery Unit about the state of the order |
| 4  | Notify the Organizational unit about the state of the order | 

##### Scenario 2.3

| Scenario 2.3 | Manage Delivers |
| ------------- |:-------------:|
|  Precondition     | Order in ready status |
|  Post condition     | Order delivered |
| Step#        |  Description |
|  1     | Ask the delivery unit pick-up the order |
|  2     | NOtify the organizational unit that the order has been delivered |
|  3     | mark the order as Completed  |

##### Scenario 2.4

| Scenario 2.4 | Modify a order |
| ------------- |:-------------:|
|  Precondition     | Order exists |
|  Post condition     | Order is modified |
| Step#        |  Description |
|  1     | Select the order |
| 2 | Check if the order has not beed arleady delivered (in this case abort the modification)|
|  3     | Modify paramethers  |
|  4     | Confirm the modifcation |

##### Scenario 2.5

| Scenario 2.5 | Delete a order |
| ------------- |:-------------:|
|  Precondition     | Order exists |
|  Post condition     | Order is deleted |
| Step#        |  Description |
|  1     | Select the order |
| 2 | Check if the order has not beed arleady delivered (in this case abort the delete)|
|  3     | Modify paramethers  |
|  4     | Confirm the delete |


### Use case 3, UC3
| Actors Involved        | Manager, Supplier, Payment system |
| ------------- |:-------------:|
|  Precondition     |  |
|  Post condition     |  |
|  Nominal Scenario     | Manage external order |
|  Variants     | External order made by the manager |
| Exceptions | Not enough space in the warehouse|

##### Scenario 3.1

| Scenario 3.1 | Issue a new external order |
| ------------- |:-------------:|
|  Precondition     | Order doesn't exist |
|  Post condition     | Order is created |
| Step#        |  Description |
|  1     | Select supplier |
| 2 | Select product and quantity|
| 3| Check if there is enough free space for the order|
|  4     | Confirm the order |
|  5     | Notify the supplier of the creation of a new order |
| 6 | Update free sections list |


### Use case 4, UC4
| Actors Involved        | Manager |
| ------------- |:-------------:|
|  Precondition     | Manager logged in |
|  Post condition     |  |
|  Nominal Scenario     | Manage Product |
|Variants| delete Product|
||modify product|
|Exceptions| Product doesn't exists|

##### Scenario 4.1

| Scenario 4.1 | Search for a product |
| ------------- |:-------------:|
|  Precondition     | Product in the inventory |
|  Post condition     | details shown |
| Step#        |  Description |
|  1     | Select a product by id/name |
| 2 | display product characteristics |

##### Scenario 4.2

| Scenario 4.2 | Add new type of product to the inventory |
| ------------- |:-------------:|
|  Precondition     | Type of product does not exist |
|  Post condition     | Type of product is created |
| Step#        |  Description |
|  1     | insert the product name, id |
| 2 | insert other characterstics |
| 3 | Insert the product|

##### Scenario 4.3

| Scenario 4.3 | Modify a Product Type |
| ------------- |:-------------:|
|  Precondition     | Product Type exists |
|  Post condition     | Product Type is modified|
| Step#        |  Description |
|  1     | Select Product |
| 2 | insert new characterstics |
| 3 | modify the product|
| 4 | Update free sections list |


##### Scenario 4.4

| Scenario 4.3 | List all Suppliers for a product type |
| ------------- |:-------------:|
|  Precondition     | product type exists |
|  Post condition     | show list  |
| Step#        |  Description |
|  1     | Select Product Type |
| 2 | show list of the suppliers |

### Use case 5, UC5
| Actors Involved        | Manager |
| ------------- |:-------------:|
|  Precondition     |  |
|  Post condition     |  |
|  Nominal Scenario     | Manage physical space |
|Exceptions| no free space|

##### Scenario 5.1

| Scenario 3.1 | Show amount of available space |
| ------------- |:-------------:|
|  Precondition     | Manager logged in |
|  Post condition     | free space amount shown |
| Step#        |  Description |
|  1     | Calculate free space |
| 2 | show free space|
| 3| Notifies manager in case of low available space|

##### Scenario 5.2

| Scenario 5.3 | Show free section |
| ------------- |:-------------:|
|  Precondition     |  |
|  Post condition     | free section shown|
| Step#        |  Description |
|  1     | retrive data from free section list |
| 2 | show free sections|

### Use case 6, UC6
| Actors Involved        | Quality office, Manager |
| ------------- |:-------------:|
|  Precondition     | Quality office is logged in |
|  Post condition     | Quality office executed tests |
|  Nominal Scenario     | Manage Quality check |

##### Scenario 6.1

| Scenario 6.1 | Change quality of a Product |
| ------------- |:-------------:|
|  Precondition     | Test on the product are done |
|  Post condition     | check state of the product is changed|
| Step#        |  Description |
| 1| insert the new state|
| 2 | update the state|
| 3 | notify the manager in case the product doesn't pass the quality checks|


### Use case 7, UC7
| Actors Involved        | Payment system |
| ------------- |:-------------:|
|  Precondition     | The external order is not paid |
|  Post condition     | successful payment |
|  Nominal Scenario     | Payment to suppliers |
|  Exceptions     | Not successful payment |

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




