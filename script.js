window.onload = function() {

	//Width and height
	var width = 800, height = 800;
	var logoWidth = 20, logoHeight = 20;

	var active = d3.select(null);

	//Define map projection
	var projection = d3.geo.mercator()
						   .center([ 5, 48 ])
						   .translate([ width/2, height/2 ])
						   .scale([width + 400]);

	//Define path generator
	var path = d3.geo.path()
					 .projection(projection);


	//Create SVG
	var svg = d3.select("#svg")
				.append("svg")
				.attr("id", "map")
				.attr("width", width)
				.attr("height", height);

	var g = svg.append("g")
    		   .style("stroke-width", "1.5px");

    queue()
		.defer(d3.json, "data/map.json")
		.defer(d3.json, "data/teams.json")
		.await(drawMap);

	// queue()
	// 	.defer(d3.json, "data/allteamdata.json")
	// 	.await(drawChart);
	 
	var table = $(document).ready(function() {
	    $('#table').DataTable( {
	        data: leagueTables,
	        lengthChange: false,
	        destroy: true,
	        columns: [
	            { title: "Position" },
	            { title: "League" },
	            { title: "Team" },
	            { title: "Played" },
	            { title: "Wins" },
	            { title: "Draws" },
	            { title: "Losses" },
	            { title: "Goals Scored" },
	            { title: "Goals Conceded" },
	            { title: "Difference" },
	            { title: "Points" }
	        ]
	    });
	});

	// function drawChart(error, teamdata) {

	// 	goalRatio = []

	// 	teamdata.forEach(function (d, i) {
	// 		team = d.name
	// 		d.squad.forEach(function(d, i) {
	// 			d.minutes = +d.minutes
	// 			d.goals = +d.goals
	// 			name = d.name
	// 			goals[name] = d.goals
	// 			minutes[name] = d.minutes
	// 			teams[name] = team
	// 			goalRatio[]

	// 		})
	// 	})
	// 	console.log(goals)
		


	// 	var margin = {top: 20, right: 20, bottom: 30, left: 40}
	// 	var svgChart = d3.select("#chart").append("svg")
	// 		.attr("id", "charts")
	// 		.attr("width", 800 + margin.left + margin.right)
	// 		.attr("height", 500 + margin.top + margin.bottom)
	// 	 	.append("g")
	// 	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 	// setup x 
	// 	var xValue = function(d) { return goals;}, // data -> value
	// 	    xScale = d3.scale.linear().range([0, 800]), // value -> display
	// 	    xMap = function(d) { return xScale(xValue(d));}, // data -> display
	// 	    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// 	// setup y
	// 	var yValue = function(d) { return minutes;}, // data -> value
	// 	    yScale = d3.scale.linear().range([height, 500]), // value -> display
	// 	    yMap = function(d) { return yScale(yValue(d));}, // data -> display
	// 	    yAxis = d3.svg.axis().scale(yScale).orient("left");

	// 	var cValue = function(d) { return teams;},
	// 	    color = d3.scale.category10();

	//     xScale.domain([d3.min(goals, xValue)-1, d3.max(goals, xValue)+1]);
	//     yScale.domain([d3.min(minutes, yValue)-1, d3.max(minutes, yValue)+1]);

	//     svgChart.append("g")
	//       .attr("class", "x axis")
	//       .attr("transform", "translate(0," + height + ")")
	//       .call(xAxis)
	//     .append("text")
	//       .attr("class", "label")
	//       .attr("x", width)
	//       .attr("y", -6)
	//       .style("text-anchor", "end")
	//       .text("Calories");

	//     svgChart.append("g")
	//       .attr("class", "y axis")
	//       .call(yAxis)
	//     .append("text")
	//       .attr("class", "label")
	//       .attr("transform", "rotate(-90)")
	//       .attr("y", 6)
	//       .attr("dy", ".71em")
	//       .style("text-anchor", "end")
	//       .text("Protein (g)");

	//       svg.selectAll(".dot")
	// 	      .data(goals, minutes, teams)
	// 	    .enter().append("circle")
	// 	      .attr("class", "dot")
	// 	      .attr("r", 3.5)
	// 	      .attr("cx", xMap)
	// 	      .attr("cy", yMap)
	// 	      .style("fill", function(d) { return color(cValue(d));}) 
			

	// }

	function drawTable(league) {

		table = $('#table').DataTable().clear().draw();
		    $('#table').DataTable( {
		        data: league,
		        lengthChange: false,
		        destroy: true
		    });

	}

	function drawMap(error, map, teams) {
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

	  	var logoAdjust = logoWidth / 2

		g.selectAll(".mark")//adding mark in the group
		 .data(teams)
		 .enter()
		 .append("image")
		 .attr('class', 'mark')
		 .attr('x', -logoAdjust)
		 .attr('y', -logoAdjust)
		 .attr('width', logoWidth)
		 .attr('height', logoHeight)
		 .attr("xlink:href", function(d) { return d.crestUrl})
		 .attr("transform", function(d) {
		   return "translate(" + projection([d.longitude, d.latitude]) + ")";
		 })
		 .on("mouseover", function() {
		 	d3.select(this)
		 	  .transition()
		 	  .duration(750)
		 	  .attr("transform", function(d) {
				 return "translate(" + projection([(d.longitude - 1),d.latitude]) + ")";
			  })
		 })
		 .on("mouseout", function() {
		 	d3.select(this)
		 	  .transition()
		 	  .duration(750)
		 	  .attr("transform", function(d) {
				 return "translate(" + projection([d.longitude,d.latitude]) + ")";
			  })
		 });

	};

	function clicked(d) {
		if (active.node() === this) return reset();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

		if (d.properties.admin == 'United Kingdom') {
			svg.append('image')
		 	   .attr('class', 'logoLeague')
			   .attr('y', -200)
			   .attr('opacity', 0)
			   .transition()
			   .duration(1000)
			   .attr('y', 0)
			   .attr('opacity', 100)
			   .attr('width', 200)
			   .attr('height', 240)
			   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg");

			drawTable(premierLeague);
			
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
			   .attr('height', 220)
			   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg");

			drawTable(bundesliga);
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
			   .attr('height', 220)
			   .attr("xlink:href","https://files.laliga.es/seccion_logos/laliga-v-600x600.png");

			drawTable(primeraDivision);
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

			drawTable(serieA);
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
}