# Design Document 


Authors: 

Date:

Version:


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

<discuss architectural styles used, if any>
<report package diagram, if needed>



![highLevelDesign](/images/highLevelDesign.jpg)




# Low level design

<for each package in high level design, report class diagram. Each class should detail attributes and operations>



![lowLevelDesign](/images/lowLevelDesign.jpg)



# Verification traceability matrix

\<for each functional requirement from the requirement document, list which classes concur to implement it>

| Function | Supplier | Item | TransportNote | RestockOrder | EzWh | ReturnOrder | Customer | InternalOrder | SKUItem | TestDescriptor | TestResult | Inventory | SKU  | Position | User |
| - | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | - | :-: | :-: | - | :-: |
| FR1 |  |  |  |  | X |  |  |  |  |  |  |  |  |  | X |
| FR2 |  |  |  |  |  |  |  |  |  | X |  | X | X |  |  |
| FR3 |  |  |  |  | X |  |  |  |  |  |  | X |  |  |  |
| FR4 |  |  |  |  | X |  | X |  |  |  |  |  |  |  |  |
| FR5 | X | X | X | X | X |  |  |  | X |  |  |  |  |  |  |
| FR6 |  |  |  |  | X |  | X | X | X |  |  |  | X |  |  |
| FR7 | X | X |  |  | X |  |  |  |  |  |  |  |  |  |  |


# Verification sequence diagrams 
\<select key scenarios from the requirement document. For each of them define a sequence diagram showing that the scenario can be implemented by the classes and methods in the design>



![Scenario 3.1](./images/Scenario%203.1.jpg)



![Scenario 5.1.1](./images/Scenario%205.1.1.jpg)



![Scenario 10.1](images/Scenario%2010.1.jpg)



![Scenario 11.2](images/Scenario%2011.2.jpg)