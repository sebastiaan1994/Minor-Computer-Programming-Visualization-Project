# Project Proposal
<h3>Sebastiaan de Vries<h3/>
<h3>10666168<h3/>

# University
University of Amsterdam<br>
Course: Programmeerproject<br>
Date: 6 juni 2017<br>

## Problem
People love football, but it is hard to memorize every single detail of the teams and players. Therefore, a visualization
of the 4 best European leagues (Premier League, Bundesliga, Serie A and Primera Division) containing all kinds of info about
team and player statistics will be a very useful tool to quickly get an overview about the information the user is searching for. 

## Features
First of all a geographical overview will be available to locate the clubs on a map. The map is clickable to get a zoomed map
and create a linked view with a bar chart with variables containing club budgets, amount of league titles, or an info window
with the league information. Clubs on the map are clickable as well to check information about the stadium, logo, palmares.
Furthermore, the current squad is listed to check their market value, position, prior clubs and nationality and appearances info.


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




