d3.csv("https://sukekuuaosou.github.io/InfoVis2022/W04/w04_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 190,
            margin: {top:30, right:10, bottom:50, left:60},
            title: "Sample Data",
            xlabel: "X label",
        };

        const bar_plot = new BarChart( config, data );
        bar_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

//var svg = d3.select('#drawing_region');

DrawCircles( [5, 10, 15] );
DrawCircles( [20, 40] );

function DrawCircles( data ) {
    // Data-join (circle now contains the update selection)
    let circle = svg.selectAll('circle')
        .data(data);

    // Enter (initialize the newly added elements)
    let circle_enter = circle.enter().append('circle')
        .attr('fill', 'steelblue')

    // Update (set the dynamic properties of the elements)
    circle_enter.merge( circle )
        .attr('r', d => d)
        .attr('cx', (d,index) => (index * 80) + 50)
        .attr('cy', 80);

    // Exit
    circle.exit().remove();
}
