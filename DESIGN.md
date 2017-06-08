# Design

My first element contains a geo map of the United Kingdom, Spain, Italy and Germany. Functions are to zoom to each country to 
get a better overview of the clubs playing in those national competitions. Furthermore, the logo's will be interactive tools
to create graphs and stats in the other elements. On of those other elements will be an interactive table, which will be able to
sort on all kinds of variables depending on what te current geo map selection is. The third element will contain bar charts or
line graphs on player values, team budgets etc.

![picture alt](https://github.com/sebastiaan1994/Project/blob/master/doc/Design%20Data%20Visualization.JPG "Design")

I'm using the http://football-data.org/index API to retrieve all kinds of team and player info. Furthermore, I'm using Wiki Data Query
to get stadium coordinates for the club logo's and could be extended with other information later on. JQuery, Bootstrap, Queue, D3
and TopoJSON are currently used to visualize the content on the webpage.



