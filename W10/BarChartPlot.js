class BarChart{

      constructor(config, data){
            this.config = {
                  parent: config.parent,
                  width: config.width || 256,
                  height: config.height || 128,
                  margin: config.margin || {top:10, right:10, bottom:10, left:10},
                  title: config.title || '',
                  xlabel: config.xlabel || ''
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
                  .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

            self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
            self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

            self.xscale = d3.scaleLinear()
                  .range( [0, self.inner_width] );

            self.yscale = d3.scaleBand()
                  .range( [0, self.inner_height] )
                  .paddingInner(0.1);

            self.xaxis = d3.axisBottom( self.xscale )
                  .ticks(5)
                  //.tickSize(5)
                  //.tickPadding(5)
                  .tickSizeOuter(0);

            self.yaxis = d3.axisLeft( self.yscale )
                  //.tickSize(5)
                  .tickSizeOuter(0);

            self.xaxis_group = self.chart.append('g')
                  .attr('transform', `translate(0, ${self.inner_height})`);

            self.yaxis_group = self.chart.append('g');
            
            const title_space = 10;
            self.svg.append('text')
                  .style('font-size', '20px')
                  .style('font-weight', 'bold')
                  .attr('text-anchor', 'middle')
                  .attr('x', self.config.width / 2)
                  .attr('y', self.config.margin.top - title_space)
                  .text( self.config.title );
          
            const xlabel_space = 40;
            self.svg.append('text')
                  //.transition().duration(1000)
                  .attr('x', self.config.width / 2)
                  .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
                  .text( self.config.xlabel );

      }

      update() {
            let self = this;
            const xmax = d3.max( self.data, d => Number(d.w) ) ;
            self.xscale.domain( [0, xmax] );
            self.yscale.domain( self.data.map(d => d.l) );
            self.render();
        }

      
      render() {
            let self = this;
    
            self.chart.selectAll("rect")
                .data(self.data)
                .join("rect")
                .transition().duration(1000)
                .attr("x", 0 )
                .attr("y", d => self.yscale( d.l ) )
                .attr("width", d => self.xscale( d.w ) )
                .attr("height", self.yscale.bandwidth())
                .style("fill", d => d.c );

            self.xaxis_group
                .call( self.xaxis );
    
            self.yaxis_group
                .call( self.yaxis );

            d3.select('#reverse')
                .on('click', d => {
                    self.data.reverse();
                    self.update();
                });

            d3.select('#max')
                .on('click', d => {
                    self.data.sort(function(first, second){
                        if (Number(first.w) > Number(second.w)){
                          return -1;
                        }else if (Number(first.w) < Number(second.w)){
                          return 1;
                        }else{
                          return 0;
                        }
                      })
                    self.update();
                });

            d3.select('#label')
                .on('click', d => {
                    self.data.sort(function(first, second){
                        if (first.l < second.l){
                          return -1;
                        }else if (first.l > second.l){
                          return 1;
                        }else{
                          return 0;
                        }
                      })
                    self.update();
                });
        }


}




