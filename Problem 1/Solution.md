Problem 1
=========

Part 1) Queries with Relational Algebra
This part is to get you familiar with expressing queries in Relational Algebra. Relational Algebra provides a good model of how a language like SQL finds data. It is particularly good for modelling performance and query optimization.

PART 1 : Relational Algebra Queries
For each of the following situations provide the required relational algebra to produce the required table. You may use temporary tables (intermediate variables) if you want. The questions are in no particular order, some are probably quite easy, others are probably more tricky.

Problem 1.1)
List all the names of subscribers and their directory numbers (the area, office, station code of their lines).

$$
\Pi_{name, area, office, station }(Subscriber \bowtie Line)
$$

Problem 1.2)
List the names, email address and line id's of all subscribers who subscribe to at least one distinctive ring tone (Based on your design from the previous assignment).

$$
\Pi_{name, email\_address, line\_id}((Contacts \bowtie Subscriber) \bowtie Lines)
$$

*I'm not totally sure if this is what's expected, because my implementation of his question in the last assignment was different than what was expected.*

Problem 1.3)
List the portID's and foreign switch name of all the trunks that are have at least one idle channel

$$
\Pi_{port\_id, foreign\_switch}(Trunks \bowtie Trunk Channels)
$$

Problem 1.4)
List the name of the originator and the name of the terminator for any two people who are currently talking on a line to line call. A line to line call is when one of the lines is talking to another on of the lines, so there are no trunks involved.

$$
\alpha = \rho_{originator(port\_id)}(\Pi_{originating\_facility}(Calls) \bowtie Subscribers)
$$

$$
\beta = \rho_{terminator(port\_id)}(\Pi_{terminating\_facility}(Calls) \bowtie Subscribers)
$$

and finally...

$$
\Pi_{o\_name,t\_name}(\sigma_{och=0 \wedge tch=0}(Calls))
$$

Problem 1.5)
The CALL_FORWARD_NUMBERS table provides the numbers to forward to when the call forward service must be activated. However there should only be an entry in this table if the customer subscribes to a call forward service. Find all the lines that have an entry in the Call_Forward_Numbers table but who do not subcribe to a call forward service. Call forward serices have one of the following service codes: "CFD", "CFB", "CFN"

$$
\sigma_{has Number In Call Forward \wedge doesn't Subscribe}(Lines)
$$

* *Note that I don't use a Pi symbol here because we want the **whole** table*

Problem 1.6)
Suppose the originator of the call with callID 101 called someone who has the call forward service. Find the number to which the call should be forwarded. That is produce a table that has the call forward number in it.

$$
\Pi_{area\_code, office\_code, station\_code}()
$$

Problem 1.7)
(This query is based on the modifications that you proposed in the previous assignment to implement distinctive ring tones.)

Suppose Joe who rents a line with portID 202 and directory number 613-234-1165 calls Sue who, on the same switch, rents portID 301 and directory number 613 576-8897. Suppose further that Sue has a distinctive ring tone for Joe (based on your modification proposed in the previous assignment). Write a relational algebra query to find the appropriate ring tone based on the originator, terminator of the call and the dialled digits.

$$
\Pi_{Stuff again}
$$

Problem 1.8)
Suppose the originator of a call dialed the number (905) 238-1243 which is a number not located on the callers switch (so its a call requiring a trunk). Find all the trunks that can be used to route this call.

$$
\Pi_{more stuff}
$$

Problem 1.9)
Produce a table that lists for each service (give the name of the service) and the number of lines that subscribe to that service.

$$
\Pi_{stuff}
$$

Problem 1.10)
List the portID's of all lines that subscribe to all of the available services.

$$
\Pi_{portID}(service\_subscribers \div \rho_{scode/service\_code}(services))
$$

