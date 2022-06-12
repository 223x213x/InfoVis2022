class BarChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale,
            duration: config.duration || 1000
        };

        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleBand()
            .range([0, self.inner_width])
            .paddingInner(0.2)
            .paddingOuter(0.1);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(10)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const title_space = 5;
        self.svg.append('text')
            .style('font-size', '15px')
            //.style('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .attr('x', self.config.margin.left - title_space * 2)
            .attr('y', self.config.margin.top - title_space * 3)
            .text(self.config.title);

        const xlabel_space = 300;
        self.svg.append('text')
            .transition().duration(self.config.duration)
            .style('font-size', '12px')
            .attr('x', self.config.width / xlabel_space)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text(self.config.xlabel);

        const ylabel_space = 50;
        self.svg.append('text')
            .transition().duration(self.config.duration)
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 3))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text(self.config.ylabel);
    }

    update() {
        let self = this;
        const ymax = d3.max(self.data, d => Math.abs(d.all_game_score_gap));
        self.yscale.domain([0, ymax]);
        self.xscale.domain(self.data.map(d => d.all_players));
        self.render();
    }

    render() {
        let self = this;
        let rect = self.chart.selectAll(".bar")
            .data(self.data)
            .join('rect');

        rect
            .data(self.data)
            .join("rect")
            .attr("class", "bar")
            .transition().duration(self.config.duration)
            .attr("x", d => self.xscale(d.all_players))
            .attr("y", d => self.yscale(Math.abs(d.all_game_score_gap)))
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.yscale(Math.abs(d.all_game_score_gap)))
            .attr("fill", d => self.config.cscale(d.color));

        rect
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.all_players}</div>
                    result: ${d.game_score}
                    <br>
                    maximum score gap: ${Math.abs(d.all_game_score_gap)}
                    <br>
                    classification: ${d.color}
                    <br>
                    index: ${self.data.indexOf(d)}
                    `);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px')
                // .style('transform', `translate(${self.xscale(d.all_players) + self.xscale.bandwidth()/2+ 'px'}, ${self.yscale(Math.abs(d.all_game_score_gap))-60+ 'px'})`);

            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            })
            .on('click', function (ev, d) {
                detail_number = self.data.indexOf(d);
                scatter_plot.update();
            });

        self.xaxis_group
            .transition().duration(self.config.duration)
            .call(self.xaxis)
            .selectAll("text")
            .attr("transform", "rotate(45)")    // 文字を時計回りに90度回転させる
            .style("text-anchor", "start");

        self.yaxis_group
            .transition().duration(self.config.duration)
            .call(self.yaxis);



    }

    sort(order) {
        let self = this;

        switch (order) {
            case 'reverse':
                self.data.reverse();
                break;
            case 'descend':
                self.data.sort((a, b) => Math.abs(b.all_game_score_gap) - Math.abs(a.all_game_score_gap));
                break;
            case 'ascend':
                self.data.sort((a, b) => Math.abs(a.all_game_score_gap) - Math.abs(b.all_game_score_gap));
                break;
        }
    }


}
