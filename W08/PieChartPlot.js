class PieChart{

      constructor(config, data){
            this.config = {
                  parent: config.parent,
                  width: config.width || 256,
                  height: config.height || 256,
                  margin: config.margin || {top:10, right:10, bottom:10, left:10},
                  title: config.title || '',
                  xlabel: config.xlabel || '',
                  ylabel: config.ylabel || ''
            }
            this.data = data;
            this.init();
      }

      init(){
            let self = this;

            self.svg = d3.select( self.config.parent )
                  .attr('width', self.config.width)
                  .attr('height', self.config.height);

            self.chart = self.svg.append('g')
                  //.attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
                  .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

            self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
            self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
            self.inner_radius = Math.min(self.inner_width,self.inner_height)/2;
            
           /* self.xscale = d3.scaleLinear()
                  .range( [0, self.inner_width] );

            self.yscale = d3.scaleLinear()
                  .range( [0, self.inner_height] );
                  //.paddingInner(0.1); */

            self.pie = d3.pie()
                  .value( d => d.w ); 
            
            self.arc = d3.arc()
                .innerRadius(self.inner_radius/2)
                .outerRadius(self.inner_radius);

            self.label_arc = d3.arc()
                .innerRadius(self.inner_radius-20)
                .outerRadius(self.inner_radius-20);

           /* self.pieGroup = this.chart.selectAll("self.pie")
                .data(pie(dataset))
                .enter()
                .append("g")
                .attr("class", "pie"); */

            /*self.xaxis = d3.axisBottom( self.xscale )
                  .ticks(5);

            self.yaxis = d3.axisLeft( self.yscale )
                  .tickSize(5);
                  //.tickSizeOuter(0);*/
            
            const title_space = 10;
            self.svg.append('text')
                .style('font-size', '20px')
                .style('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .attr('x', self.config.width / 2)
                .attr('y', self.config.margin.top - title_space)
                .text( self.config.title );
          
      }

      update() {
            let self = this;
            self.render();
        }

      
      render() {
            let self = this;
    
            self.chart.selectAll('pie')
                .data( self.pie(self.data) )
                .enter()
                .append('path')
                .attr('d', self.arc)
                .data(self.data)
                .attr('fill', d => d.c)
                .attr('stroke', 'white')
                .style('stroke-width', '2px');

            self.chart.selectAll('text')
                .data(self.pie(self.data))
                .enter()
                .append('text')
                //.attr('transform',`translate(${self.arc.centroid(d)} )`)
                 .attr("transform", function(d) { return "translate("+self.arc.centroid(d)+ ")" })
                //.attr("dy", "5px")
                .attr("font", "10px")
                .attr("text-anchor", "middle")
                .data(self.data)
                .text(d => d.l);
                //.text("text"); 

           /* self.pieGroup.append("text")
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + text.centroid(d) + ")"; })
                .attr("dy", "5px")
                .attr("font", "10px")
                .attr("text-anchor", "middle")
                .data(self.data)
                .text(function(d) { return d.l; });*/
        }
}

