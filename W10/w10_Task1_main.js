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



    
