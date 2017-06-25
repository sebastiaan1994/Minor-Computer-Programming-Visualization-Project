window.onload = function() {

	//Width and height
	var width = 800, height = 800;
	var logoWidth = 20, logoHeight = 20, logoAdjust = logoWidth / 2;

	var active = d3.select(null);

	//Define map projection
	var projection = d3.geo.mercator()
						   .center([ 5, 48 ])
						   .translate([ width/2, height/2 ])
						   .scale([width + 400]);

	//Define path generator
	var path = d3.geo.path()
					 .projection(projection);

	var tooltips;


	//Create SVG
	var svg = d3.select("#svg")
				.append("svg")
				.attr("id", "map")
				.attr("width", width)
				.attr("height", height);

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
	    .style("background-color", "black")
	    .style("display", "inline-block") 
		.style("visibility", "hidden");

	var g = svg.append("g")
    		   .style("stroke-width", "1.5px");

    var pathFunction;

    queue()
		.defer(d3.json, "data/map.json")
		.defer(d3.json, "data/teams2.json")
		.defer(d3.json, "data/allteamdata.json")
		.await(drawMap);

	var teamdata = {}
	var allteamdata = {}
	var players = {}

	// queue()
	// 	.defer(d3.csv, "data/playerdata2.csv")
	// 	.await(drawChart);

	var clickedCountry = false
	var clickedClub;

	firstTableView()

	d3.csv("data/playerdata2.csv", function(error, playerdata) {
	  if (error) throw error;
	  
	  players = playerdata
	  parCor('None', clickedCountry, clickedClub, playerdata)

	});
	

	function firstTableView() {

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
		 
		var table = $(document).ready(function() {
		    $('#table').DataTable( {
		        data: leagueTables,
		        lengthChange: false,
		        dom: '<"toolbar">frtip',
		        destroy: true,
		        columns: tableColumns,
		        scrollY: "500px",
		        scrollCollapse: false,
		        paging: false
		    });
		    
		    tableClubClick()


		});


		$(".toolbar").html('<b> European Leagues Club Table </b>')
		$(".toolbar").before(document.getElementsByTagName("label"))

	}

	function drawChart(error, playerData) {

		playerData.forEach(function (d, i) {
			d.age = +d.age
			d.goals = +d.goals
			d.minutes = +d.minutes
			d.red = +d.red
			d.yellow = +d.yellow
			})

		players = playerData

		var margin = { top: 50, right: 300, bottom: 50, left: 50 },
		    outerWidth = 1000,
		    outerHeight = 400,
		    chartWidth = outerWidth - margin.left - margin.right,
		    chartHeight = outerHeight - margin.top - margin.bottom;

		var xChart = d3.scale.linear()
		    .range([0, chartWidth]).nice();

		var yChart = d3.scale.linear()
		    .range([chartHeight, 0]).nice();

		var wCat = "name"
			xCat = "goals",
		    yCat = "minutes",
		    rCat = "age",
		    colorCat = "team";

		  var xMax = d3.max(playerData, function(d) { return d[xCat]; }) * 1.05,
		      xMin = d3.min(playerData, function(d) { return d[xCat]; }),
		      xMin = xMin > 0 ? 0 : xMin,
		      yMax = d3.max(playerData, function(d) { return d[yCat]; }) * 1.05,
		      yMin = d3.min(playerData, function(d) { return d[yCat]; }),
		      yMin = yMin > 0 ? 0 : yMin;

		  xChart.domain([xMin, xMax]);
		  yChart.domain([yMin, yMax]);

		  var xAxis = d3.svg.axis()
		      .scale(xChart)
		      .orient("bottom")
		      .tickSize(-chartHeight);

		  var yAxis = d3.svg.axis()
		      .scale(yChart)
		      .orient("left")
		      .tickSize(-chartWidth);

		  color = d3.scale.category10();
			      

		  var tip = d3.tip()
		      .attr("class", "d3-tip")
		      .offset([-10, 0])
		      .html(function(d) {
		        return wCat + ": " + d[wCat] + "<br>" + rCat + ": " + d[rCat] + "<br>" + colorCat + ": " + d[colorCat] + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
		      });

		  var zoomBeh = d3.behavior.zoom()
		      .x(xChart)
		      .y(yChart)
		      .scaleExtent([0, 500])
		      .on("zoom", zoom);

		  var chartSvg = d3.select("#chart")
		    .append("svg")
		      .attr("class", "scatter")
		      .attr("width", outerWidth)
		      .attr("height", outerHeight)
		    .append("g")
		      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		      .call(zoomBeh);

		  chartSvg.call(tip);

		  chartSvg.append("rect")
		      .attr("width", chartWidth)
		      .attr("height", chartHeight);

		  chartSvg.append("g")
		  	  .attr("id", "axis")
		      .classed("x axis", true)
		      .attr("transform", "translate(0," + chartHeight + ")")
		      .call(xAxis)
		    .append("text")
		      .classed("label", true)
		      .attr("x", chartWidth)
		      .attr("y", margin.bottom - 10)
		      .style("text-anchor", "end")
		      .text(xCat);

		  chartSvg.append("g")
		  	  .attr("id", "axis")
		      .classed("y axis", true)
		      .call(yAxis)
		    .append("text")
		      .classed("label", true)
		      .attr("transform", "rotate(-90)")
		      .attr("y", -margin.left)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text(yCat);

		  var objects = chartSvg.append("svg")
		      .classed("objects", true)
		      .attr("width", chartWidth)
		      .attr("height", chartHeight);

		  objects.append("svg:line")
		      .classed("axisLine hAxisLine", true)
		      .attr("x1", 0)
		      .attr("y1", 0)
		      .attr("x2", chartWidth)
		      .attr("y2", 0)
		      .attr("transform", "translate(0," + chartHeight + ")");

		  objects.append("svg:line")
		      .classed("axisLine vAxisLine", true)
		      .attr("x1", 0)
		      .attr("y1", 0)
		      .attr("x2", 0)
		      .attr("y2", chartHeight);

		  objects.selectAll(".dot")
		      .data(playerData)
		    .enter().append("circle")
		      .classed("dot", true)
		      .attr("r", function (d) { return 3 * Math.sqrt(d[rCat] / Math.PI); })
		      .attr("transform", transform)
		      .style("fill", function(d) { return color(d[colorCat]); })
		      .on("mouseover", tip.show)
		      .on("mouseout", tip.hide);

		  d3.select("input").on("click", change);

		    function change() {
			    xCat = "Goals";
			    xMax = d3.max(playerData, function(d) { return d[xCat]; });
			    xMin = d3.min(playerData, function(d) { return d[xCat]; });

			    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

			    var svgChart = d3.select("#svgChart").transition();

			    svgChart.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

			    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
			  }

			  function zoom() {
			    chartSvg.select(".x.axis").call(xAxis);
			    chartSvg.select(".y.axis").call(yAxis);

			    chartSvg.selectAll(".dot")
			        .attr("transform", transform);
			  }

			  function transform(d) {
			    return "translate(" + xChart(d[xCat]) + "," + yChart(d[yCat]) + ")";
			  }
	}

	function drawTable(league) {
			


			table = $('#table').DataTable().clear().destroy();
			table = $('#table').DataTable( {
					columns: tableColumns,
			        data: league,
			        dom: '<"toolbar">frtip',
			        lengthChange: false,
			        destroy: true,
			        scrollY: "500px",
			        scrollCollapse: false,
			        paging: false,
			        aaSorting: [[0, 'asc']]
			    });
			
			tableClubClick()

			$(".toolbar").html('<b>'+ league[0][1] +'</b>')
			$(".toolbar").before(document.getElementsByTagName("label"))
		
	}

	function tableClubClick() {

		$('#table tbody tr').on( 'click', function (event) {
		    	if ($(this).hasClass('selected')) {
		    		$(this).removeClass('selected')
		    	}
		    	else {
			    	$('tr').removeClass('selected')
			        $(this).toggleClass('selected')
			        clickedClub = $('tr.selected td.Team').text()

			        parCorUpdate(clickedClub)
			        parCorUpdate(clickedClub)
			    }
		    });
	}

	function drawMap(error, map, teams, allnewteamdata) {
		//Bind data and create one path per GeoJSON feature
		g.selectAll("path")
	     .data(map.features)
	     .enter()
	     .append("path")
	     .attr("id", map.features.properties)
	     .attr("d", path)
	     .attr("stroke", "rgba(8, 81, 156, 0.2)")
	     .attr("fill", "rgba(8, 81, 156, 0.6)")
	     .on("click", clicked);

	  	teamdata = teams 

	  	allteamdata = allnewteamdata
	  	
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

		g.selectAll("#mark")//adding mark in the group
		 .data(teams)
		 .enter()
		 .append("image")
		 .attr('id', 'mark')
		 .attr('position', 'relative')
		 .style('z-index', "10")
		 .attr('class', function(d) { return d.league})
		 .attr('x', -logoAdjust)
		 .attr('y', -logoAdjust)
		 .attr('width', logoWidth)
		 .attr('height', logoHeight)
		 .attr("xlink:href", function(d) { return d.crestUrl})
		 .attr("transform", function(d) {
		   return "translate(" + projection([d.longitude, d.latitude]) + ")";
		 })

		 

	};
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
	      	showClubData(d.name)

		})

		  
		};
			
	
	function clicked(d) {
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

			d3.selectAll("#mark")
				.on("mouseover", function() {
					tooltip.style("visibility", "hidden")
				})

			firstTableView()
			clickedCountry = false
			// d3.select(".parcor").transition().duration(500).style("opacity", 0.1).remove()
			parCorUpdate('None', clickedCountry)
			return reset();
		}
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

		clickedCountry = true
		// d3.select(".parcor").transition().duration(500).style("opacity", 0.1).remove()
		
		var tip = d3.tip()
		      .attr("class", "d3-tip")
		      .offset([-10, 0])
		      .html(function(d) {
		        return wCat + ": " + d[wCat] + "<br>" + rCat + ": " + d[rCat] + "<br>" + colorCat + ": " + d[colorCat] + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
		      });

		d3.selectAll("#mark")
				.on("mouseover", function(d){
					tooltip.transition().duration(500)
		            tooltip.text(d.name);
		           	tooltip.style("visibility", "visible")
		           	return tooltip.style("top", (event.pageY-20)+"px").style("left",(event.pageX+30)+"px");})
		        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
		        


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
			parCorUpdate('None', clickedCountry, 'England')
			parCorUpdate('None', clickedCountry, 'England')
			
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
			parCorUpdate('None', clickedCountry, 'Germany')
			parCorUpdate('None', clickedCountry, 'Germany')

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
			parCorUpdate('None', clickedCountry, 'Spain')
			parCorUpdate('None', clickedCountry, 'Spain')
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
			parCorUpdate('None', clickedCountry, 'Italy')
			parCorUpdate('None', clickedCountry, 'Italy')
		}

		var bounds = path.bounds(d),
	    	dx = bounds[1][0] - bounds[0][0],
	    	dy = bounds[1][1] - bounds[0][1],
	    	x = (bounds[0][0] + bounds[1][0]) / 2,
	    	y = (bounds[0][1] + bounds[1][1]) / 2,
	    	scale = 1 / Math.max(dx / width, dy / height),
	    	translate = [width / 2 - scale * x, height / 2 - scale * y];

		g.transition()
	     .duration(750)
	     .style("stroke-width", 1.5 / scale + "px")
	     .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

	}

	function showClubData (club) {
		
		parCorUpdate(club)
		parCorUpdate(club)
		tableColumnsPlayers = [
	            { title: "Number" },
	            { title: "Name", className: 'Name' },
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
		
		for (i = 0; i < allteamdata.length; i++)  {
			if (allteamdata[i]['name'] == club) {
				clubData = allteamdata[i]


				$('#table').DataTable().clear().destroy();
				$('#table').DataTable( {
			        columns: tableColumnsPlayers
			    })

			    table = $('#table').DataTable( {
			        aaData: clubData['squad'],
			        lengthChange: false,
			        destroy: true,
			        search: false,
			        dom: '<"toolbar">frtip',
			        scrollY: "500px",
			        scrollCollapse: false,
			        paging: false,
			        aaSorting: [[3, 'dsc']],	        
			        aoColumns: [
			            { "mDataProp": "number" },
			            { "mDataProp": "name" },
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
			    $(".toolbar").html('<b>' + clubData['name'] + '</b><br>' + '<b>Coach: </b>' + clubData['coach_name'] + '<br>' + '<b>Stadium: </b>' + clubData['venue_name'] + ', ' + clubData['venue_capacity'] + ' seats<br>' + '<b>City: </b>' + clubData['venue_city'] )
			    $(".toolbar").before(document.getElementsByTagName("label"))
			    break
			    
			}
		}	
			console.log('TEST')
			$('#table tbody tr').on( 'click', function (event) {
		    	if ($(this).hasClass('selectedPlayer')) {
		    		$(this).removeClass('selectedPlayer')
		    	}
		    	else {
			    	$('tr').removeClass('selectedPlayer')
			        $(this).toggleClass('selectedPlayer')
			    }    
			});


		
	}


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
	function parCorUpdate(clickedClub, clickedCountry, country) {

		data = players


		if (clickedCountry == true) {
			var sections = []
			players.forEach(function(d, i) {
				if (players[i]['country'] == country) {
					sections.push(players[i])
					console.log('hoi')
				}
			})
			data = sections
		}


		if (clickedClub != 'None') {
			var clubdata = []
			players.forEach(function(d, i) {
				if (players[i]['team'] == clickedClub) {
					clubdata.push(players[i])
				}
			})
			data = clubdata
			console.log(data)
		}
		// console.log(data['name'])
		// console.log(clickedClub)

		tooltips = d3.select("body")
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

		var updateBackground = d3.select('g.background').selectAll("path").remove().data(data).enter().append('path')
		var updateForeground = d3.select('g.foreground').selectAll("path").remove().data(data).enter().append('path')

		updateBackground.attr("d", pathFunction).attr("id", 'hallo')
		updateForeground.attr("d", pathFunction).attr("id", 'hallo')

		console.log($('tr.selectedPlayer td.Name').text())
		data.forEach(function(d, i) {
			if (data[i]['name'] == $('tr.selectedPlayer td.Name').text()) {
				console.log(data[i]['name'])
			}
		})

		updateForeground
			.on("mouseover", function(d) {
		      	d3.select(this)
		      		.style({'stroke' : '#F00'})
		      		.style({'stroke-width': '4'});
		      	tooltips.text(d.name);
		      	console.log(d)
				return tooltips.style("visibility", "visible");
			    })
			    .on("mousemove", function(){return tooltips.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			    .on("mouseout", function(d){
				d3.select(this)
				.style({'stroke': 'steelblue' })
				.style({'stroke-width': '1'})
				return tooltips.style("visibility", "hidden");
			    });


		

	}
	function parCor(section, clickedCountry, clickedClub, data) {
	
		var marginParCor = {top: 30, right: 10, bottom: 10, left: 10},
	    widthParCor = 1500 - marginParCor.left - marginParCor.right,
	    heightParCor = 500 - marginParCor.top - marginParCor.bottom;

		var x = d3.scale.ordinal().rangePoints([0, widthParCor], 1),
		    y = {},
		    dragging = {};

		var line = d3.svg.line(),
		    axis = d3.svg.axis().orient("left"),
		    background,
		    foreground;

		var svgParCor = d3.select(".w3-row-padding").append("div").append("svg")
			.attr('class', 'parcor')
		    .attr("width", widthParCor + marginParCor.left + marginParCor.right)
		    .attr("height", heightParCor + marginParCor.top + marginParCor.bottom)
		  .append("g")
		    .attr("transform", "translate(" + marginParCor.left + "," + marginParCor.top + ")");

	
		
		// if (clickedCountry == true) {
		// 	var sections = []
		// 	data.forEach(function(d, i) {
		// 		if (data[i]['country'] == section) {
		// 			sections.push(data[i])
		// 		}
		// 	})
		// 	data = sections
		// }	
		

		  // Extract the list of dimensions and create a scale for each.
		  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {

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

		  // Add grey background lines for context.
		  background = svgParCor.append("g")
		      .attr("class", "background")
		    .selectAll("path")
		      .data(data)
		    .enter().append("path")
		      .attr("d", path);

		  var color = d3.scale.category10();
		  // Add blue foreground lines for focus.
		  foreground = svgParCor.append("g")
		      .attr("class", "foreground")
		    .selectAll("path")
		      .data(data)
		    .enter().append("path")
		    // .attr({'style': function(d) {
	     //      return "stroke-width: " + d.age / 20
	     //    }})
		      .attr("d", path)
		      .attr('class', 'lineParCor')
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
				return tooltips.style("visibility", "hidden");})
				.on('click', function(d, i) {
					d3.select(this)
					.attr('class', 'lineClicked')
				})
			    
		      

		  // Add a group element for each dimension.
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

		  // Add an axis and title.
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
		
		  
		function position(d) {
		  var v = dragging[d];
		  return v == null ? x(d) : v;
		}

		function transition(g) {
		  return g.transition().duration(500);
		}

		// Returns the path for a given data point.
		function path(d) {
		  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
		}

		function brushstart() {
		  d3.event.sourceEvent.stopPropagation();
		}

		// Handles a brush event, toggling the display of foreground lines.
		function brush() {
		  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
		      extents = actives.map(function(p) { return y[p].brush.extent(); });
		  foreground.style("display", function(d) {
		    return actives.every(function(p, i) {
		      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		    }) ? null : "none";
		  });
		}

		pathFunction = path;
	}
	
}
	