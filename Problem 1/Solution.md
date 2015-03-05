Problem 1
=========

**Problem 1.1)**
List all the names of subscribers and their directory numbers (the area, office, station code of their lines).

**Solution:**

$$
\Pi_{name, area, office, station }(Subscriber \bowtie Line)
$$

**Problem 1.2)**
List the names, email address and line id's of all subscribers who subscribe to at least one distinctive ring tone (Based on your design from the previous assignment).

**Solution:**

$$
\Pi_{name, email\_address, line\_id}((Contacts \bowtie Subscriber) \bowtie Lines)
$$

*I'm not totally sure if this is what's expected, because my implementation of his question in the last assignment was different than what was expected.*

**Problem 1.3)**
List the portID's and foreign switch name of all the trunks that are have at least one idle channel

**Solution:**

$$
\Pi_{port\_id, foreign\_switch}(Trunks \bowtie Trunk Channels)
$$

**Problem 1.4)**
List the name of the originator and the name of the terminator for any two people who are currently talking on a line to line call. A line to line call is when one of the lines is talking to another on of the lines, so there are no trunks involved.

**Solution:**

First, we'll get the name of the originator of the call:

$$
\alpha = $$ $$\Pi_{name, port\_id}(\rho_{originating\_facility/port\_id, oname/name}(subscribers)) \bowtie \Pi_{call\_id,originating\_facility,och}(calls)
$$

**Note:** We're keeping the call_id in the table so we can do a natural join later.

Next we'll do the same for the destination(terminator):

$$
\beta = $$ $$\Pi_{name, port\_id}(\rho_{terminating\_facility/port\_id, tname/name}(subscribers)) \bowtie \Pi_{call\_id,terminating\_facility,tch}(calls)
$$

Finally, we can put it all together with a natural join:

$$
\Pi_{oname,tname}(\sigma_{och=0 \wedge tch=0}(\alpha \bowtie \beta))
$$

**Problem 1.5)**
The CALL_FORWARD_NUMBERS table provides the numbers to forward to when the call forward service must be activated. However there should only be an entry in this table if the customer subscribes to a call forward service. Find all the lines that have an entry in the Call_Forward_Numbers table but who do not subcribe to a call forward service. Call forward serices have one of the following service codes: "CFD", "CFB", "CFN"

**Solution:**

First, we'll get all the lines who have numbers in the call_forward_numbers table and rename the line_id field:

$$
\alpha = \rho_{line\_id/port\_id}(\Pi_{port\_id}(call\_forward\_numbers))
$$

Next, let's get the lines from the service_subscribers table who subscribe to call forwarding:

$$
\beta = \Pi_{line\_id}(\sigma_{service\_code=CFD \vee service\_code=CFB \vee service\_code=CFN}(service\_subscribers))
$$

Finally, our answer will just be the set difference of the two:

$$
\alpha - \beta
$$


**Problem 1.6)**
Suppose the originator of the call with callID 101 called someone who has the call forward service. Find the number to which the call should be forwarded. That is produce a table that has the call forward number in it.

**Solution:**

First we'll isolate the area, office and station code of the destination line:

$$
\alpha = \Pi_{area\_code, office\_code, station\_code}(\sigma_{call\_id=101}(calls))
$$

*There wasn't enough room to put this above, but we'd need to rename the area, ofc, and stn fields in the calls table. This can be done with*
$$\rho_{area\_code/area, office\_code/ofc, station\_code/stn}(calls)$$

Next, we'll get the port_id of the line whose number we just found:

$$
\beta = \Pi_{port\_id}(\alpha \bowtie lines)
$$

Lastly, we can just natural join this again with the call_forward_numbers table, and our result should be a single tuple with the new destination line:

$$
\beta \bowtie call\_forward\_numbers
$$

**Problem 1.7)**
(This query is based on the modifications that you proposed in the previous assignment to implement distinctive ring tones.)

Suppose Joe who rents a line with portID 202 and directory number 613-234-1165 calls Sue who, on the same switch, rents portID 301 and directory number 613 576-8897. Suppose further that Sue has a distinctive ring tone for Joe (based on your modification proposed in the previous assignment). Write a relational algebra query to find the appropriate ring tone based on the originator, terminator of the call and the dialled digits.

**No solution yet**

**Problem 1.8)**
Suppose the originator of a call dialed the number (905) 238-1243 which is a number not located on the callers switch (so its a call requiring a trunk). Find all the trunks that can be used to route this call.

**No solution yet**

**Problem 1.9)**
Produce a table that lists for each service (give the name of the service) and the number of lines that subscribe to that service.

**No solution yet**

**Problem 1.10)**
List the portID's of all lines that subscribe to all of the available services.

**Solution:**

We can just divide the service_subscribers by a table with all of the services, and the resultant table will have only the people who have all services. Taking a projection of only the port_id will take care of duplicate port_id's.

$$
\Pi_{port\_id}(service\_subscribers \div \rho_{scode/service\_code}(services))
$$

