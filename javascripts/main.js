/*
Sebastiaan de Vries
10666168

Universiteit van Amsterdam
Minor Programmeren
Programmeerproject
*/
window.onload = function() {

	// Set dimensions for the geo map
	var width = 800, height = 800;
	var logoWidth = 20, logoHeight = 20, logoAdjust = logoWidth / 2;

	// Keep track of map being zoomed or not
	var active = d3.select(null);

	// Define map projection
	var projection = d3.geo.mercator()
						   .center([ 5, 48 ])
						   .translate([ width/2, height/2 ])
						   .scale([width + 400]);

	// Define paths of countries
	var path = d3.geo.path()
					 .projection(projection);

	// Create SVG for the geo map
	var svg = d3.select("#svg")
				.append("svg")
				.attr("id", "map")
				.attr("width", width)
				.attr("height", height);

	// Set the tooltip properties
	var tooltip = d3.select("body")
		.append("div")
		.attr("class", "tool")
		.style("position", "absolute")
		.style("z-index", "10")                 
	    .style("height","40px")                 
	    .style("padding","5px")                  
	    .style("border-radius","0px") 
	    .style("border-style", "outset")
	    .style("border-width", "1px")
	    .style("color", "white")
	    .style("font-family", "Andada, serif")
	    .style("background-color", "black")
	    .style("display", "inline-block") 
		.style("visibility", "hidden");

	// Set the stroke on geo map hover
	var g = svg.append("g")
    		   .style("stroke-width", "1.5px");

    // Load map, team and logo data for the geo map
    queue()
		.defer(d3.json, "data/map.json")
		.defer(d3.json, "data/teams2.json")
		.defer(d3.json, "data/allteamdata.json")
		.await(drawMap);

	// Global variables to reuse data files
	var teamdata = {}
	var allteamdata = {}
	var players = {}
	var clickedCountry = false
	var clickedClub;

	// Call main table view, animated scrolling on the website and mail function on click
	firstTableView()
	elementScrolling()
	sendMail()

	// Load data for the parallel coordinates and make player data global
	d3.csv("data/playerdata2.csv", function(error, playerdata) {
	  if (error) throw error;
	  players = playerdata
	  parCor('None', clickedCountry, clickedClub, playerdata)
	});

	function drawMap(error, map, teams, allnewteamdata) {

		// Select the four countries' paths and draw them in the svg
		g.selectAll("path")
	     .data(map.features)
	     .enter()
	     .append("path")
	     .attr("id", map.features.properties)
	     .attr("d", path)
	     .attr("stroke", "rgba(8, 81, 156, 0.2)")
	     .attr("fill", "rgba(8, 81, 156, 0.6)")
	     .on("click", clicked);

	    // link data to global variables
	  	teamdata = teams 
	  	allteamdata = allnewteamdata
	  	
	  	// Convert data to informative strings
	  	for (i = 0; i < allteamdata.length; i++) {
	  		for (j = 0; j < allteamdata[i]['squad'].length; j++) {
	  			if (allteamdata[i]['squad'][j]['position'] == 'G') {
	  				allteamdata[i]['squad'][j]['position'] = 'Goalkeeper'
	  			}
	  			if (allteamdata[i]['squad'][j]['position'] == 'D') {
	  				allteamdata[i]['squad'][j]['position'] = 'Defender'
	  			}
	  			if (allteamdata[i]['squad'][j]['position'] == 'M') {
	  				allteamdata[i]['squad'][j]['position'] = 'Midfielder'
	  			}
	  			if (allteamdata[i]['squad'][j]['position'] == 'A'){
	  				allteamdata[i]['squad'][j]['position'] = 'Attacker'
	  			}
	  			if (allteamdata[i]['squad'][j]['number'] == '0') {
	  				allteamdata[i]['squad'][j]['number'] = 'Not Available'
	  			}	
	  		}
	  	}

	  	// Append club logo's to the map
		g.selectAll("#mark")
		 .data(teams)
		 .enter()
		 .append("image")
		 .attr('id', 'mark')
		 .attr('position', 'relative')
		 .style('z-index', "10")
		 .attr('class', function(d) { return d.league + ' ' + d.name})
		 .attr('x', -logoAdjust)
		 .attr('y', -logoAdjust)
		 .attr('width', logoWidth)
		 .attr('height', logoHeight)
		 .attr("xlink:href", function(d) { return d.crestUrl})
		 .attr("transform", function(d) {
		   return "translate(" + projection([d.longitude, d.latitude]) + ")";
		 })
	};

	// When clicked on map align logo's to the left of the map
	function logoTransit(teamdata, league) {

		if (league == 'Premier.League'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return -3 + (i * 17) })
		 	.attr('width', logoWidth - 4)
			.attr('height', logoHeight - 4)
			.attr("x", "50");
		}
		if (league == 'Bundesliga'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return 228 + (i * 10) })
		 	.attr('width', logoWidth - 10)
			.attr('height', logoHeight - 10)
			.attr("x", "400");
		}
		if (league == 'Primera.Division'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return 620 + (i * 16) })
		 	.attr('width', logoWidth - 5)
			.attr('height', logoHeight - 5)
			.attr("x", "-65");
		}
		if (league == 'Serie.A'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return 430 + (i * 14) })
		 	.attr('width', logoWidth - 7)
			.attr('height', logoHeight - 7)
			.attr("x", "415");
		}

		// When aligned logo's are clicked return to original location and show club data
		d3.selectAll("#mark").on("click", function(d) {
		  d3.select(this)
		  	.transition()
			.duration(750)
			.attr("x", -logoAdjust)
			.attr("y", -logoAdjust)
			.attr("width", logoWidth)
			.attr("height", logoHeight)
			.attr("transform", function(d) {
	      		return "translate(" + projection([d.longitude, d.latitude]) + ")"
	      	});
	      	showClubData(d.name, teamdata)
	      	d3.selectAll('.foreground path').style('stroke', 'steelblue').style('stroke-width', '1')
		})	  
	};
	
	// Transitions when map is zoomed and unzoomed
	function clicked(d) {

		// When map is unzoomed return logo's to original position
		if (active.node() === this) {
			d3.selectAll("#mark")
				.transition()
				.duration(750)
				.attr("x", -logoAdjust)
				.attr("y", -logoAdjust)
				.attr("width", logoWidth)
				.attr("height", logoHeight)
				.attr("transform", function(d) {
		      return "translate(" + projection([d.longitude, d.latitude]) + ")"; 
		    })

			// Hide tooltip
			d3.selectAll("#mark")
				.on("mouseover", function() {
					tooltip.style("visibility", "hidden")
				})

			// Get back to original views of visual elements
			d3.selectAll('.foreground').style('stroke', 'steelblue').style('stroke-width', '1').style('opacity', 1)
			firstTableView()
			clickedCountry = false
			parCorUpdate('None')
			$('.parCorTitle').html('European League Players')
			d3.selectAll('.foreground path').style('stroke', 'steelblue').style('stroke-width', '1')
			return reset();
		}

		// When map is in zoomed state
		else {
			active.classed("active", false);
			active = d3.select(this).classed("active", true);

			d3.selectAll('.foreground').style('stroke', 'steelblue').style('stroke-width', '1').style('opacity', 1)
			clickedCountry = true

			// Append tooltip to aligned club logo's
			d3.selectAll("#mark")
					.on("mouseover", function(d){
						tooltip.transition().duration(500)
			            tooltip.text(d.name);
			           	tooltip.style("visibility", "visible")
			           	return tooltip.style("top", (event.pageY-20)+"px").style("left",(event.pageX+30)+"px");})
			        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			
			// Set country properties and append competition logo and league data in DataTable and parallel coordinates     
			if (d.properties.admin == 'United Kingdom') {
				svg.append('image')
			 	   .attr('class', 'logoLeague')
			 	   .attr('position', 'absolute')
				   .attr('y', -200)
				   .attr('opacity', 0)
				   .transition()
				   .duration(1000)
				   .attr('y', -0)
				   .attr('opacity', 100)
				   .attr('width', 200)
				   .attr('height', 100)
				   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg");

				logoTransit(teamdata, 'Premier.League')
				drawTable(premierLeague);
				parCorUpdate('England')
				$('.parCorTitle').html('Premier League Players')	
			}

			if (d.properties.admin == 'Germany') {
				svg.append('image')
			 	   .attr('class', 'logoLeague')
				   .attr('y', -200)
				   .attr('opacity', 0)
				   .transition()
				   .duration(1000)
				   .attr('y', 0)
				   .attr('opacity', 100)
				   .attr('width', 180)
				   .attr('height', 180)
				   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg");

				logoTransit(teamdata, 'Bundesliga')
				drawTable(bundesliga);
				parCorUpdate('Germany')
				$('.parCorTitle').html('Bundesliga Players')

			}
			if (d.properties.admin == 'Spain') {
				svg.append('image')
			 	   .attr('class', 'logoLeague')
				   .attr('y', -200)
				   .attr('opacity', 0)
				   .transition()
				   .duration(1000)
				   .attr('y', 0)
				   .attr('opacity', 100)
				   .attr('width', 180)
				   .attr('height', 180)
				   .attr("xlink:href","https://files.laliga.es/seccion_logos/laliga-v-600x600.png");

				logoTransit(teamdata, 'Primera.Division')
				drawTable(primeraDivision);
				parCorUpdate('Spain')
				$('.parCorTitle').html('La Liga Players')
			}

			if (d.properties.admin == 'Italy') {
				svg.append('image')
			 	   .attr('class', 'logoLeague')
				   .attr('y', -200)
				   .attr('x', 600)
				   .attr('opacity', 0)
				   .transition()
				   .duration(1000)
				   .attr('y', 50)
				   .attr('opacity', 100)
				   .attr('width', 180)
				   .attr('height', 220)
				   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/f/f7/LegaSerieAlogoTIM.png");

				logoTransit(teamdata, 'Serie.A')
				drawTable(serieA);
				parCorUpdate('Italy')
				$('.parCorTitle').html('Serie A Players')
			}

			var widthScale = screen.width * 0.41666667
			var heightScale = screen.height * 0.74074
			var bounds = path.bounds(d),
		    	dx = bounds[1][0] - bounds[0][0],
		    	dy = bounds[1][1] - bounds[0][1],
		    	x = (bounds[0][0] + bounds[1][0]) / 2,
		    	y = (bounds[0][1] + bounds[1][1]) / 2,
		    	scale = 1 / Math.max(dx / widthScale, dy / heightScale),
		    	translate = [widthScale / 2 - scale * x, heightScale / 2 - scale * y];

			g.transition()
		     .duration(750)
		     .style("stroke-width", 1.5 / scale + "px")
		     .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	    }
	}

	// Reset all competition logo's and zoom out in map
	function reset() {
		active.classed("active", false);
		active = d3.select(null);

		g.transition()
	     .duration(750)
	     .style("stroke-width", "1.5px")
	     .attr("transform", "");

	    d3.select('.logoLeague')
	      .transition()
	      .duration(1000)
	      .attr('y', -200)
	      .remove();
	}

	function firstTableView() {

		// Set column headers
		tableColumns = [
		            { title: "Position" },
		            { title: "League" },
		            { title: "Team", className: 'Team' },
		            { title: "Played" },
		            { title: "Wins" },
		            { title: "Draws" },
		            { title: "Losses" },
		            { title: "Goals Scored" },
		            { title: "Goals Conceded" },
		            { title: "Difference" },
		            { title: "Points" }
		        ]

		// Initialize DataTable with certain properties
		var table = $(document).ready(function() {
		    $('#table').DataTable( {
		    	language: {
			        search: "_INPUT_",
			        searchPlaceholder: "Search..."
			    },
		        data: leagueTables,
		        lengthChange: false,
		        dom: '<"toolbar">frtip',
		        destroy: true,
		        columns: tableColumns,
		        scrollY: "500px",
		        scrollX: false,
		        scrollCollapse: false,
		        paging: false
		    });

		    // Remove text next to search bar
			$('#table_wrapper > label:nth-child(2)').remove()
		    tableClubClick()
		});

		// Set DataTable title
		$(".toolbar").html('<h2 id="clubName"> European Leagues Club Table </h2>')
		$(".toolbar").before(document.getElementsByTagName("label"))
	}

	// Draw table when map is clicked on country
	function drawTable(league) {
		
		// Destroy table and plug in new data
		table = $('#table').DataTable().clear().destroy();
		table = $('#table').DataTable( {
				columns: tableColumns,
				language: {
			        search: "_INPUT_",
			        searchPlaceholder: "Search..."
			    },
		        data: league,
		        dom: '<"toolbar">frtip',
		        lengthChange: false,
		        destroy: true,
		        scrollY: "500px",
		        scrollX: false,
		        scrollCollapse: false,
		        paging: false,
		        aaSorting: [[0, 'asc']]
		    });
		tableClubClick()

		// Set new league title for DataTable
		$(".toolbar").html('<h2 id="clubName">'+ league[0][1] +'</h2>')
		$(".toolbar").before(document.getElementsByTagName("label"))
	}

	function tableClubClick() {
		
		// Convert table and parallel coordinates containing players of clicked club
		d3.selectAll('.foreground path').style('stroke', 'steelblue').style('stroke-width', '1')
		$('#table tbody tr').on( 'click', function (event) {
	    	$('tr').removeClass('selected')
	        $(this).toggleClass('selected')
	        clickedClub = $('tr.selected td.Team').text()
	        $('.parCorTitle').html(clickedClub + ' Players')
	        parCorUpdate(clickedClub)
	        showClubData(clickedClub, teamdata)
	    });
	}

	// Modify table to player statistics with certain club
	function showClubData (club, logo) {

		// Update parallel coordinates and the title
		parCorUpdate(club)
		$('.parCorTitle').html(club + ' Players')

		// Create new headers for table
		tableColumnsPlayers = [
	            { title: "Number" },
	            { title: "Name" },
	            { title: "Position" },
	            { title: "Minutes" },
	            { title: "Assists" },
	            { title: "Goals" },
	            { title: "Yellow Cards"},
	            { title: "Red Cards"},
	            { title: "Appearances"},
	            { title: "Injured"},
	            { title: "Substituted out"}
	        ]

	    // Check for right logo of club and copy link address
		for (j = 0; j < logo.length; j++) {
			if (logo[j]['name'] == club) {
				link = logo[j]['crestUrl']
			}
		}

		// Check for right team data for chosen club
		for (i = 0; i < allteamdata.length; i++)  {
			if (allteamdata[i]['name'] == club) {

				// Destory table and input new info about the players
				clubData = allteamdata[i]
				$('#table').DataTable().clear().destroy();
				$('#table').DataTable( {
			        columns: tableColumnsPlayers
			    })

			    table = $('#table').DataTable( {
			    	language: {
				        search: "_INPUT_",
				        searchPlaceholder: "Search..."
				    },
			        aaData: clubData['squad'],
			        lengthChange: false,
			        destroy: true,
			        search: false,
			        dom: '<"toolbar">frtip',
			        scrollY: "500px",
			        scrollX: false,
			        scrollCollapse: false,
			        paging: false,
			        aaSorting: [[3, 'dsc']],	        
			        aoColumns: [
			            { "mDataProp": "number" },
			            { "mDataProp": "name", "className" : "playerName" },
			            { "mDataProp": "position" },
			            { "mDataProp": "minutes" },
			            { "mDataProp": "assists" },
			            { "mDataProp": "goals" },
			            { "mDataProp": "yellowcards" },
			            { "mDataProp": "redcards" },
			            { "mDataProp": "appearences" },
			            { "mDataProp": "injured" },
			            { "mDataProp": "substitute_out" }
			        ]
			    });

			    // Set new title for DataTable
			    $(".toolbar").html('<h2 id="clubName">' + clubData['name'] + '</h2><img class="linkLogo" src="' + link + '"><br>' + '<b>Coach: </b>' + clubData['coach_name'] + '<br>' + '<b>Stadium: </b>' + clubData['venue_name'] + ', ' + clubData['venue_capacity'] + ' seats<br>' + '<b>City: </b>' + clubData['venue_city'] )
			    $(".toolbar").before(document.getElementsByTagName("label"))
			    break    
			}
		}

		// When player is selected in the table highlight row and path
		selectPlayerTable(club)
	}

	function selectPlayerTable(club) {

		$('#table tbody tr').on( 'click', function (event) {

			// Make all paths grey except for the player select
			d3.selectAll('.foreground path').style('stroke', '#ddd').style('stroke-width', '1')
	    	if ($(this).hasClass('selectedPlayer')) {
	    		playerName = $('tr.selectedPlayer td.playerName').text()
		        $("[id='" + playerName + "']").css('stroke', 'steelblue').css('stroke-width', '1')
	    		$(this).removeClass('selectedPlayer')
	    		d3.selectAll('.foreground path').style('stroke', 'steelblue').style('stroke-width', '1')
	    		d3.selectAll('.background path').style('stroke', '#ddd !important').style('stroke-width', '1').style('shape-rendering', 'crispEdges')
	    		$('.parCorTitle').html(club + ' Players')
	    	}
	    	else {
	    		d3.selectAll('.foreground path').style('stroke', '#ddd !important').style('stroke-width', '1')
		    	$('tr').removeClass('selectedPlayer')
		        $(this).toggleClass('selectedPlayer')
		        playerName = $('tr.selectedPlayer td.playerName').text()
		        $("[id='" + playerName + "']").css('stroke', '#008000').css('stroke-width', '4')
		        d3.selectAll('.background path').style('stroke', '#ddd !important').style('stroke-width', '1').style('shape-rendering', 'crispEdges')
		        $('.parCorTitle').html('Selected Player: ' + playerName)
		    }
		});	
	}

	/* 
	Creates a parallel coordinates object with multiple axes
	to show data statistics in a line graph model

	Concept used: https://bl.ocks.org/jasondavies/1341281
	 */
	function parCor(section, clickedCountry, clickedClub, data) {
		
		// Set dimenions
		var marginParCor = {top: 150, right: 100, bottom: 100, left: 0},
	    widthParCor = 1100 - marginParCor.left - marginParCor.right,
	    heightParCor = 600 - marginParCor.top - marginParCor.bottom;

	    // Set scales in relation to the dimensions
		var x = d3.scale.ordinal().rangePoints([0, widthParCor], 1),
		    y = {},
		    dragging = {};

		// Instantiate the axis and the lines
		var line = d3.svg.line(),
		    axis = d3.svg.axis().orient("left"),
		    background,
		    foreground;

		// Append svg element for the parallel coordinates
		var svgParCor = d3.select("#tablediv").append("div").append("svg")
			.attr('class', 'parcor')
			.attr('id', 'parcor')
		    .attr("width", widthParCor + marginParCor.left + marginParCor.right)
		    .attr("height", heightParCor + marginParCor.top + marginParCor.bottom)
		  .append("g")
		    .attr("transform", "translate(" + marginParCor.left + "," + marginParCor.top + ")");

		// Create a Title for the parallel coordinates
		var parCorTitle = svgParCor.append('text')
				.attr('class', 'parCorTitle')
				.text('European League Players')
				.attr('position', 'relative')
				.attr('y', -60)

		// Extract the list of dimensions and create a scale for each
		x.domain(dimensions = d3.keys(data[0]).filter(function(d) {

		  	// Disable name, team and country variables to enter
		    if (d == "name") return false;
		    if (d == "team") return false;
		    else if (d == "country") return false;

		    else if (d == "position") {
		    	y[d] = d3.scale.ordinal()
		    		.domain(data.map(function(p) { return p[d]}))
		    		.rangePoints([heightParCor, 0]);
		    }

		    else {
		     (y[d] = d3.scale.linear()
		        .domain(d3.extent(data, function(p) { return +p[d]; }))
		        .range([heightParCor, 0]));
		 	}

		 	return true;
		}));

		// Set properties for the tooltips
	    var tooltips = d3.select("body")
	      .append("div")
		  .attr("class", "tooltips")
	   	  .style("position", "absolute")
		  .style("z-index", "10")                 
	      .style("height","40px")                 
	      .style("padding","5px")                  
	      .style("border-radius","0px") 
	      .style("border-style", "outset")
	      .style("border-width", "1px")
	      .style("background-color", "black")
	      .style("display", "inline-block") 
		  .style("visibility", "hidden");;

		// Add grey background lines for context
		background = svgParCor.append("g")
		  .attr("class", "background")
		  .selectAll("path")
		  .data(data)
		  .enter().append("path")
		  .attr('id', function(d) { return d.name})
		  .attr('class', function(d) { return (d.country + ' ' + d.team + ' lines')})
		  .attr("d", path);

		
		// Add blue foreground lines for focus
		foreground = svgParCor.append("g")
		    .attr("class", "foreground")
		    .selectAll("path")
		    .data(data)
		    .enter().append("path")
		    .attr('id', function(d) { return d.name})
		    .attr("d", path)
		    .attr('class', function(d) { return (d.country + ' ' + d.team + ' lines')})
		    .on("mouseover", function(d) {
		      	d3.select(this)
		      	.style({'stroke' : '#F00'})
		      	.style({'stroke-width': '4'});
		      	tooltips.text(d.name);
				return tooltips.style("visibility", "visible");
			})
			.on("mousemove", function(){return tooltips.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(d){
				d3.select(this)
				.style({'stroke': 'steelblue' })
				.style({'stroke-width': '1'})
				return tooltips.style("visibility", "hidden");
			})
			    
		// Add a group element for each dimension
		var g = svgParCor.selectAll(".dimension")
		    .data(dimensions)
		    .enter().append("g")
		    .attr("class", "dimension")
		    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
		    .call(d3.behavior.drag()
		    .origin(function(d) { return {x: x(d)}; })
		    .on("dragstart", function(d) {
		          dragging[d] = x(d);
		          background.attr("visibility", "hidden");
		    })
		    .on("drag", function(d) {
		          dragging[d] = Math.min(widthParCor, Math.max(0, d3.event.x));
		          foreground.attr("d", path);
		          dimensions.sort(function(a, b) { return position(a) - position(b); });
		          x.domain(dimensions);
		          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
		    })
		    .on("dragend", function(d) {
		        delete dragging[d];
		        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
		        transition(foreground).attr("d", path);
		        background
		            .attr("d", path)
		            .transition()
		            .delay(500)
		            .duration(0)
		            .attr("visibility", null);
		    }));

		// Add an axis and title
		g.append("g")
		    .attr("class", "axis")
		    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
		    .append("text")
		    .style("text-anchor", "middle")
		    .attr("y", -9)
		    .text(function(d) { return d; });

		// Add and store a brush for each axis.
		g.append("g")
		    .attr("class", "brush")
		    .each(function(d) {
		    	d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
		    })
		    .selectAll("rect")
		    .attr("x", -8)
		    .attr("width", 16);
		
		// Initialize where dragging starts 
		function position(d) {
		  var v = dragging[d];
		  return v == null ? x(d) : v;
		}

		// Transition of lines selected while 
		function transition(g) {
		  return g.transition().duration(500);
		}

		// Returns the path for a given data point
		function path(d) {
		  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
		}

		// Initialize start of the brush
		function brushstart() {
		  d3.event.sourceEvent.stopPropagation();
		}

		// Handles a brush event, toggling the display of foreground lines
		function brush() {
		  	var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
		      extents = actives.map(function(p) { return y[p].brush.extent(); });
		  	foreground.style("display", function(d) {
		    	return actives.every(function(p, i) {
		      		return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		    	}) ? null : "none";
		  	});
		}
	}

	// Filter parallel coordinates paths on chosen selection
	function parCorUpdate(selection) {

		selection = selection.replace(/\s/g, '.');
		
		// Display all paths of all players available
		if (selection == 'None') {
			d3.selectAll('.lines').style('visibility', 'visible')
			
		}

		// Only show a selection of the lines depending on chosen club or compeition
		else {
			d3.selectAll('.lines').style('visibility', 'hidden')
			d3.selectAll('.' + selection).style('visibility', 'visible')
		}
	}

	// Open mail client when clicking on contact button
	function sendMail() {

		$('#contact').click(function () {
			window.open('mailto:sebastiaan-1994@hotmail.com?subject=Football Statistics')
		})
	}

	// Create animated scrolling when clicking on headers
	function elementScrolling () {

	    $('.linkPC').click(function () {
	    			$('body,html').animate({ scrollTop: $('#visuals').position().top - 50 }, 1000);
	                $('#tablediv').animate({ scrollTop: $('#tablediv').position().top + 300 }, 1000);
	                return false;
	            });
	    $('.linkMap, .linkDT, .scroll-down').click(function () {
	                $('body,html').animate({ scrollTop: $('#visuals').position().top - 50 }, 1000);
	                $('#tablediv').animate({ scrollTop: 0 }, 1000);
	                return false;
	            });
	    $('.home').click(function () {
	    			$('body,html').animate({ scrollTop: $('body').position().top }, 1000);
	                return false;
	            });
	    $('.info').click(function () {
	    			$('body,html').animate({ scrollTop: $('#uva').position().top }, 1000);
	                return false;
	            });
	}
}
