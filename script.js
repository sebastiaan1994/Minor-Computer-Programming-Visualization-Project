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