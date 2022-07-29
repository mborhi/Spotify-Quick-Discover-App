# Work Process

This documents some of the design decisions that I made in making this application.

## Table of Contents

* [Architecture](#architecture)
* [Server and API](#server-and-api)
    + [User Authentication](#user-authentication)
    + [Category and Genre Retreival](category-and-genre-retreival)
* [Database](#database)
* [Client](#client)
* [Testing](#testing)


---

## Architecture

* MicroServices vs Monolith
    - MS
        + API Gateway / Service Discovery
        + Playback Service
        + Retrieval Service
        + User Service
        + Auth Service
    - Monolith
        + API endpoints
        + API architecture

* Pros vs Cons

* Docker / Kubernetes

## Server and API

### User Authentication
While designing a way for users to login to spoitfy and for my application to receive the access token, I ran into several problems.
1. Where should my application store this token?
2. How can this be fast, and provide a good UX?
3. How can it be stored securely?
4. Will the token be easily refreshable?
5. Is this scalable?

**Solution**: Storing the issued refresh token in cookies, while storing the entire OAuth2 token in the database, offers a good solution to all of these problems. The refresh token is unqiue and thus can utilized as a "key" to retreiving the entire OAuth2 token when needed. This is a fast and scalable solution. Since it is stored in a database, it easy to cache results, which can be scaled and offer extremely fast response times. This solution also provides a simple way of getting refreshed token values. It is easy to handle refreshing the token server side, since the refresh token never changes and it is stored client side. Thus, only the database needs to be updated. This is also the most secure solution. The access token is never exposed publicly, so the chance of a cross-site scripting attack is eliminated.


**Alternatives**: An alternative would have been to store everything in cookies. Yet another alternative would have been to store this information in local storage. Storing the access and refresh token in local storage would not have been a secure option. Addtionally, it wouldn't provide a good UX, since switching tabs would clear the storage. Storing everything in cookies seems like a more promising option, however, it is less secure and it doesn't scale well. It limits the option for adding an app login system, whereas with the current solution, it would be easy to scale to that.


### Category and Genre Retreival

The app aims to serve all of Spotify's listed categories and genres, so that the user can choose a section to browse for new songs. The challenge in this was finding a way to quickly deliver these sections to the user. Analyzing the qualities of content that needs to be servred: 

* The data presented on the /categories and /genres page is not user specific and can be pre-rendered ahead of the user's request.
* These sections are not updated frequently, can use a service worker when a catgory or genre changes to update the respective page.

**Solution**: The solution was to "pre-load" this data into the database. This is an optimal solution for several reasons. This allows for server-side rendering of the pages displaying this information. This information does not change very often, and it is rather large compared to other requests, so it is unnecessary to make and API request for this on every page render. A simple database worker can check whether the information stored in the databse is the latest, and update accordingly. This solution fully utilizes Next.js SSR capabilites.

---

## Database

---

## Client

---

## Testing

After getting a basic outline and idea of where I want to take this project, I used ***Test Driven Development*** to build this app.

----describe tdd----

**VERY IMPORTNAT: ADD 'next/babel' TO babel.config.js !!!!**
  