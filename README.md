# Football Statistics Web Application

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Header%20image.PNG "Header")

## Personal Information
<b>Name:</b> Sebastiaan de Vries<br>
<b>Student Number:</b> 10666168<br>
<b>University:</b> University of Amsterdam<br>
<b>Course:</b> Programmeerproject<br>
<b>Date:</b> 29 June 2017<br>

© 2017 Sebastiaan de Vries. All Rights Reserved.

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

__**Parallel Coordinates**__<br>
Last but not least, to create a comparison tool a parrallel coordinates element is introduced. All the lines in this element represent players in the database playing in the 4 countries. The lines get filtered when selecting a certain country or club. When selecting a player in the table the line in the parallel coordinates gets highlighted. Furthermore you can swap axis to see other correlations in the graph and hover on the line to check the player names.

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/pc.png "Parallel Coordinates")

## Data
To create this data visualization there are plenty of API's available but for the main purpose this http://api.football-data.org/index
database is used in particular for the league information. Furthermore I paid 15 euro for player statistics on https://football-api.com/ to use for the table and parallel coordinates. For the club's coordinates on the maps I used https://query.wikidata.org/ to retrieve the data.

## External Code and Content
A big part of the parallel coordinates element is made thanks to Jason Davies' https://bl.ocks.org/jasondavies/1341281.
Secondly, the HTML template is retrieved from https://www.w3schools.com/w3css/w3css_templates.asp.
The header image on top of the webpage is copied from EA Sports FIFA 17.
I do not claim any of these content's rights.

## Limitations
The main limitation of this project was retrieving appropriate data. Good data was very costly so I had to retrieve my data from various sources resulting in a lot of work merging those datasets into one piece.

## General Overview Website

## Design Sketch (4 weeks ago)

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Design%20Data%20Visualization.JPG "Design")

[![BCH compliance](https://bettercodehub.com/edge/badge/sebastiaan1994/Project?branch=master)](https://bettercodehub.com/)




