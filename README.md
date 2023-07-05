# Crowdfunding-Smart-contract
The Crowdfund contract enables individuals to propose projects by providing a title, description, funding goal, and deadline. Projects are stored in an array and can be accessed publicly. Users can contribute funds to a specific project by calling the contribute function and providing the project index and the amount of funds to contribute. The contract keeps track of the total donations for each project and the individual contributions made by each user.

If a project reaches its funding goal before the deadline, it is marked as complete. At that point, the project owner can withdraw the donated funds using the withdrawDonations function. If a project doesn't reach its funding goal or the deadline passes, contributors can request a refund of their contributions by calling the getRefund function.

The contract also provides functions to modify the project details such as the title, description, and funding goal. Only the project owner can make these modifications.

Overall, this Crowdfunding contract facilitates the process of proposing projects, collecting donations, and managing project funds. It ensures transparency and accountability in the crowdfunding process.
