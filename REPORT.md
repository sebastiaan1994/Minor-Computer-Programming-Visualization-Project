# Report

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Header%20image.PNG "Header")

## Personal Information
<b>Name:</b> Sebastiaan de Vries<br>
<b>Student Number:</b> 10666168<br>
<b>University:</b> University of Amsterdam<br>
<b>Course:</b> Programmeerproject<br>
<b>Date:</b> 29 June 2017<br>
<b>Link:</b> https://sebastiaan1994.github.io/Project/index.html

© 2017 Sebastiaan de Vries. All Rights Reserved.

## Description
This application is made for football fans who want to get insight in data statistics of the 4 best compitions in the world.
All different kinds of variables of the football clubs and players are presented in three views containing a map, a table and
a parallel coordinates. The website will be mainly used as an interactive, informative encyclopedia to view football statistics as you have never done before. 

## Technical Design - Overview
On first hand, when entering the website, the user sees a header image with a topbar menu where you can scroll down to all the different
sections on the website. Underneath the page title 'European Football Statistics' is a animated auto-scroll icon which brings you to the main content of the page. 

On the left hand side is a geographic map located where you can click and zoom to search for your club of preference. When a country is clicked all the logo's will line up on the left to easily select a club with a tooltip stating the names. Alongside it, a datatable modifies when browsing through the map and representing the domain you've selected. On top of the table you can sort on all kinds of variables and even search for clubs and competitions. Every row in the table is clickable to view the squad of a selected team. Underneath the table the user can view a parallel coordinates to compare players and check for any relations between the variables. Clicking a player in the table results in a highlighted line in the parallel coordinates. Hovering on the lines will pop up a tooltip containing the player's name.

When scrolling down you will find my personal details to e-mail me and view my LinkedIn page. Besides it, a short introduction is given
about the webpage and explaining it's functionality. The footer of the website contains a Google Map with a pin located at Science Park with some UvA credentials.

## Technical Desing - Functionality Visual Elements
One of the powers of this webpage is that it's very interactive with all the elements. For example, all headers and links are clickable and have animated scrolling to the right object. Furthermore, the three visual elements have various linked views with each other. When clicking the map on a country will affect both other elements by filtering in the same way as the map does. So with every different layer the user chooses, all elements will adjust to the same domain. The data table is interactive with the parallel coordinates in a way that selecting players will highlight the line in the parallel coordinates' domain. In the parallel coordinates you can brush along the axis will domain you want to view and hover over the lines to check which player it represents.

## Development Challenges
The first challenge I had to cover was a major data problem. There are several resources available to retrieve the data but they were not comprehensive enough. This resulted in having to write multiple python scripts (see directory) to merge all the data together to use it for my web application. As you can see in my DESIGN.md I skipped the 'Hierarchical Menu' and the 'Interactive Stats Menu' and combined them together in the data table. Along the way I noticed that I wanted to compare players in just one view resulting in making the parallel coordinates element. In the end to get all elements linked up with one another was quite hard because I had to take keep track of a lot variables and passing it through to other functions.

## Design Decisions
At the start of the project I wanted to create an attractive web application which is very easy in it's use and multi interactive.
This is one of the reasons why I put the visual elements next to each other (and a scrollable section). If you look at most football
statistics it's literally very static visualized in tables and the browsing is very hard. The comparison tool, speaking of the paralell coordinates, is what I think the best change I've made designwise. This makes the data relevant compared to other players instead of looking at just a random number. The trade-off have been that I only created statistics for 4 countries and when I would have had more time I would definitely add more competitions and seasons. Because subscriptions costs on large databases are quite high, I would have made some scrapers to collect my data.










