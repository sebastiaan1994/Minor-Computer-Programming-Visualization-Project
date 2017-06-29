# Football Statistics Web Application

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Header%20image.PNG "Header")

## Personal Information
<b>Name:</b> Sebastiaan de Vries<br>
<b>Student Number:</b> 10666168<br>
<b>University:</b> University of Amsterdam<br>
<b>Course:</b> Programmeerproject<br>
<b>Date:</b> 29 June 2017<br>

## Problem
People love football, but it is hard to memorize every single detail of the teams and players. Therefore, a visualization
of the 4 best European leagues (Premier League, Bundesliga, Serie A and Primera Division) containing all kinds of info about
team and player statistics will be a very useful tool to quickly get an overview about the information the user is searching for. 

## Features

__**Geographic Map**__<br>
First of all a geographical overview is available to locate the clubs on a map. The map is clickable to get a zoomed map centering
a country on the user his preference. Logo's will be aligned to the left, as well as a competition logo, to create a better overview of all the clubs in that country. Afterwards, pick a club to see it's location and create a linked view with the data table and parallel coordinates.

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Map.png "Map")

__**Data Table**__<br>
Secondly an interactive table is created to quickly view team statistics all over the 4 most competitive leagues. In the table you
can sort on every variable and search for any data point given in the table. When a country is clicked in the map, the table changes
to the domain where the map is zooming too. The table is clickable too, this will lead to creating a table containing player information of the selected club.

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/table.png "Table")

__**Parallel Coordinates**__

## Data
To create this data visualization there are plenty of API's available but for the main purpose this http://api.football-data.org/index
database will be used in particular. Depending on the progression of the project, more functions could be added later on, which probably will need other data sources. A lot of these other data sources can be found here: https://www.jokecamp.com/blog/guide-to-football-and-soccer-data-and-apis/#openfooty

## Limitations
Probable technical problems in respect to this visualization could be the interactivity between different page divisions. The geo map should be interacting with all the other elements at the right moments.

## Similar Applications
As far as I know these interactive info graphics are not available yet. There are some maps showing the location of different clubs and
this could be done by using TopoJSON for example or by using the Google Maps API. Another element is of the visualisation is some kind of hierarchic menu to browse through Leagues > Teams > Players. These kind of menu's exists on many websites. The last element will cover the info stats about the current selected player/team.

## Mimimum Viable Product
The main concerns of this visualization will be the info shown of the teams and players with great emphasis on the player's details.
A lot of data could be added later on but to make the product work all 3 elements should work with standard details.

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Design%20Data%20Visualization.JPG "Design")

[![BCH compliance](https://bettercodehub.com/edge/badge/sebastiaan1994/Project?branch=master)](https://bettercodehub.com/)




