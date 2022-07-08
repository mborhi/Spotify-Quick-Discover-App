# Work Process

## Client

## Server and API

### User Authentication
While designing a way for users to login to spoitfy and for my application to receive the access token, I ran into several problems.
1. Where should my application store this token?
2. How can this be fast, and provide a good UX?
3. How can it be stored securely?
4. Will the token be easily refreshable?
5. Is this scalable?

Storing the issued refresh token in cookies, while storing the entire OAuth2 token in the database, offers a good solution to all of these problems. The refresh token is unqiue and thus can utilized as a "key" to retreiving the entire OAuth2 token when needed. This is a fast and scalable solution. Since it is stored in a database, it easy to cache results, which can be scaled and offer extremely fast response times. This solution also provides a simple way of getting refreshed token values. It is easy to handle refreshing the token server side, since the refresh token never changes and it is stored client side. Thus, only the database needs to be updated. This is also the most secure solution. The access token is never exposed publicly, so the chance of a cross-site scripting attack is eliminated. 

### Category and Genre Retreival

## Database
  