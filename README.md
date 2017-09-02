# MyTorontoLife

https://polar-reef-5864.herokuapp.com/  
Social Network and Smart Recommendation System for Toronto Residents. The site allow users to receive their daily information feed configured based on their interests, groups and information rated highly by users who share same interests. (Mongo, Node.js, AngularJS)

My Project Contributions: 
---
- Designed and prototyped UI
- Designed and implemented Angular UI Architecture (nested controllers)
- Designed entire backend and implemented all related database functionalities 
  - DB Schema, identified and implemented all database related queries (MongoDB, Mongoose)
- Designed Rest API and partially implemented Rest API calls

How it works:
---
*Profile*: Users create their profile, set up their interests and add themselves to existing
groups (neighborhoods).  
*Post*: Users can initiate a post where he/she identifies its type and links it to an existing
interest and group. Users can add multiple hashtags to identify a keyword or topic of
interest in order to facilitate a search for it in the feed.  
*Comments and Ratings*: Other users can comment on posts and rate them.  

*Search and Recommendation System:* 

User default newsfeed is built based on the following recommendation algorithm:  
Display top 100 posts highly rated (a rating of 4 or 5) by users who have interests and
groups that intersect with this user, created less than a year ago, and have not been
seen by the user yet (e.g. not rated by this user). In case of empty result, display feed
from the user's groups.  
On the main dashboard a user has the option to change newsfeed content by:  
- switching between groups/interests/hashtags.
- by clicking on links for tags/interest/group used in posts
- or adding themselves to the group if they find a group's related posts interesting.  

*Administration*: Users with Admin status can manage users profiles, view/add interests,
view/add/delete groups, view/delete any post, promote other users to admin, or revoke
admin status (except for Super Administrator).


