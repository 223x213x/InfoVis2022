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


        let game_1_one_scores = 0;
        let game_1_two_scores = 0;
        let game_2_one_scores = 0;
        let game_2_two_scores = 0;
        let game_3_one_scores = 0;
        let game_3_two_scores = 0;
        let score;
        let pre_score;
        let gap = 0;
        let max_gap = 0;
        let max_gap_game = [];
        let count = 0;
        let data2 = [];
        let players = [];
        let color = [];
        let game_1_result = [];
        let game_2_result = [];
        let game_3_result = [];
        let game_winner = [];

        function get_score(score_data) {
            var cut_score_1 = [];
            var cut_score_2 = [];
            var cut_score_3 = [];
            var cut_score_4 = [];
            var return_number = [];
            cut_score_1 = score_data.split('[');
            cut_score_2 = cut_score_1[1].split(']');
            cut_score_3 = cut_score_2[0].split(',');

            for (var i = 0; cut_score_3[i] != null; i++) {
                cut_score_4 = cut_score_3[i].split("'");
                return_number.push(cut_score_4[1]);
            }
            return return_number;
        }

        for (var j = 0; data[j] != null; j++) {
            //document.write(count + "<br>");
            count++;
            //棄権していなかったらFalseが入っている
            if (data[j].retired == "False") {
                game_1_one_scores = 0;
                game_1_two_scores = 0;
                game_2_one_scores = 0;
                game_2_two_scores = 0;
                game_3_one_scores = 0;
                game_3_two_scores = 0;
                score = [];
                pre_score = [];
                gap = 0;
                max_gap = 0;
                max_gap_game = [];
                game_1_result = [];
                game_2_result = [];
                game_3_result = [];
                game_winner = [];

                //document.write(self.data[j].tournament + "<br>");
                //document.write(self.data[j].team_one_players + " vs " + self.data[j].team_two_players + "<br>");

                //第一試合
                pre_score = get_score(data[j].game_1_scores);
                for (var i = 0; pre_score[i] != null; i++) {
                    score = pre_score[i].split('-');
                    if (score[0] != game_1_one_scores) {
                        game_1_one_scores = score[0];
                    } else if (score[1] != game_1_two_scores) {
                        game_1_two_scores = score[1];
                    }
                    gap = game_1_one_scores - game_1_two_scores;
                    if (Math.abs(gap) > Math.abs(max_gap)) {
                        max_gap = gap;
                    }
                }
                max_gap_game.push(max_gap);
                score = [];
                pre_score = [];
                gap = 0;
                max_gap = 0;

                //第二試合
                pre_score = get_score(data[j].game_2_scores);
                for (var i = 0; pre_score[i] != null; i++) {
                    score = pre_score[i].split('-');
                    if (score[0] != game_2_one_scores) {
                        game_2_one_scores = score[0];
                    } else if (score[1] != game_2_two_scores) {
                        game_2_two_scores = score[1];
                    }
                    gap = game_2_one_scores - game_2_two_scores;
                    if (Math.abs(gap) > Math.abs(max_gap)) {
                        max_gap = gap;
                    }
                }
                max_gap_game.push(max_gap);
                score = [];
                pre_score = [];
                gap = 0;
                max_gap = 0;

                //第三試合
                if (data[j].nb_sets == 3) {
                    pre_score = get_score(data[j].game_3_scores);
                    for (var i = 0; pre_score[i] != null; i++) {
                        score = pre_score[i].split('-');
                        if (score[0] != game_3_one_scores) {
                            game_3_one_scores = score[0];
                        } else if (score[1] != game_3_two_scores) {
                            game_3_two_scores = score[1];
                        }
                        gap = game_3_one_scores - game_3_two_scores;
                        if (Math.abs(gap) > Math.abs(max_gap)) {
                            max_gap = gap;
                        }
                    }
                    max_gap_game.push(max_gap);
                }

                data[j].game_1_score_gap = max_gap_game[0];
                data[j].game_2_score_gap = max_gap_game[1];
                if (data[j].nb_sets == 3)
                    data[j].game_3_score_gap = max_gap_game[2];

                game_1_result = data[j].game_1_score.split("-");
                if (Number(game_1_result[0]) > Number(game_1_result[1]))
                    game_winner[0] = 1;
                else if (Number(game_1_result[0]) < Number(game_1_result[1]))
                    game_winner[0] = 2;

                game_2_result = data[j].game_2_score.split("-");
                if (Number(game_2_result[0]) > Number(game_2_result[1]))
                    game_winner[1] = 1;
                else if (Number(game_2_result[0]) < Number(game_2_result[1]))
                    game_winner[1] = 2;

                if (data[j].nb_sets == 3) {
                    game_3_result = data[j].game_3_score.split("-");
                    if (Number(game_3_result[0]) > Number(game_3_result[1]))
                        game_winner[2] = 1;
                    else if (Number(game_3_result[0]) < Number(game_3_result[1]))
                        game_winner[2] = 2;
                }

                players[0] = data[j].team_one_players + " vs " + data[j].team_two_players + "(first game)";
                players[1] = data[j].team_one_players + " vs " + data[j].team_two_players + "(second game)";


                //１ゲーム目のカラー
                if (max_gap_game[0] < 0) {
                    if (game_winner[0] == 1) {
                        color.push("reversal");
                    } else if (game_winner[0] == 2) {
                        color.push("no_reversal");
                    }
                } else if (max_gap_game[0] > 0) {
                    if (game_winner[0] == 1) {
                        color.push("no_reversal");
                    } else if (game_winner[0] == 2) {
                        color.push("reversal");
                    }
                }
                //2ゲーム目のカラー
                if (max_gap_game[1] < 0) {
                    if (game_winner[1] == 1) {
                        color.push("reversal");
                    } else if (game_winner[1] == 2) {
                        color.push("no_reversal");
                    }
                } else if (max_gap_game[1] > 0) {
                    if (game_winner[1] == 1) {
                        color.push("no_reversal");
                    } else if (game_winner[1] == 2) {
                        color.push("reversal");
                    }
                }

                data2.push({ all_game_score_gap: max_gap_game[0], all_players: players[0], color: color[0] },
                    { all_game_score_gap: max_gap_game[1], all_players: players[1], color: color[1] });

                if (data[j].nb_sets == 3) {
                    players[2] = data[j].team_one_players + " vs " + data[j].team_two_players + "(third game)";
                    //3ゲーム目のカラー
                    if (max_gap_game[2] < 0) {
                        if (game_winner[2] == 1) {
                            color.push("reversal");
                        } else if (game_winner[2] == 2) {
                            color.push("no_reversal");
                        }
                    } else if (max_gap_game[2] > 0) {
                        if (game_winner[2] == 1) {
                            color.push("no_reversal");
                        } else if (game_winner[2] == 2) {
                            color.push("reversal");
                        }
                    }
                    data2.push({ all_game_score_gap: max_gap_game[2], all_players: players[2], color: color[2] });
                    // document.write("color = " + data2[j].color + "<br>");
                }
            }

        }
        /*
                document.write("all_data = "+data2.length+"<br>");
                document.write("data2[8000].all_game_score_gap = "+data2[8000].all_game_score_gap+"<br>");
                document.write("data2[8000].all_players = "+data2[8000].all_players+"<br>");
                document.write("data2[8001].all_players = "+data2[8001].all_players+"<br>");
                document.write("data2[8002].all_players = "+data2[8002].all_players+"<br>");
        
        */

        this.data = data;
        this.data2 = data2
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
            //.ticks(['setosa','versicolor','virginica'])
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(10)
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
            .text(self.config.title);

        const xlabel_space = 250;
        self.svg.append('text')
            .transition().duration(self.config.duration)
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
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
        /*
        const data_map = d3.rollup(self.data, v => v.team_one_total_points, d => d.team_one_players);
        self.aggregated_data = Array.from(data_map, ([key, count]) => ({ key, count }));

        self.cvalue = d => d.key;
        self.xvalue = d => d.key;
        self.yvalue = d => d.count;

        const items = self.aggregated_data.map(self.xvalue);
        self.xscale.domain(items);*/


        //　data2用
        const ymax = d3.max(self.data2, d => d.all_game_score_gap);
        self.yscale.domain([0, ymax]);
        self.xscale.domain(self.data2.map(d => d.all_players));

        /*
        const ymax = d3.max(self.data, d => d.team_one_total_points);
        self.yscale.domain([0, ymax]);
        self.xscale.domain(self.data.map(d => d.team_one_players));
        */
        self.render();
    }

    render() {
        let self = this;
        // document.write(self.data2.length+"<br>");



        self.chart.selectAll(".bar")
            .data(self.data2)
            .join("rect")
            .attr("class", "bar")
            .transition().duration(self.config.duration)
            .attr("x", d => self.xscale(d.all_players))
            .attr("y", d => self.yscale(Math.abs(d.all_game_score_gap)))
            .attr("width", self.xscale.bandwidth())
            .attr("height", d => self.inner_height - self.yscale(Math.abs(d.all_game_score_gap)))
            .attr("fill", d => self.config.cscale(d.color))
        /* .on('mouseover', (e,d) => {
             d3.select('#tooltip_bar')
                 .style('opacity', 1)
                 .html(`<div class="tooltip-label">$ ${d.all_players}</div>(${d.all_game_score_gap})`);
         })
         .on('mousemove', (e) => {
             const padding = 10;
             d3.select('#tooltip_bar')
                 .style('left', (e.pageX + padding) + 'px')
                 .style('top', (e.pageY + padding) + 'px');
         })
         .on('mouseleave', () => {
             d3.select('#tooltip_bar')
                 .style('opacity', 0);
         });*/
        /*  .on('click', function (ev, d) {
              const is_active = filter.includes(d.key);
              if (is_active) {
                  filter = filter.filter(f => f !== d.key);
              }
              else {
                  filter.push(d.key);
              }
              Filter();
              d3.select(this).classed('active', !is_active);
          });*/

        /*
       self.chart.selectAll(".bar")
           .data(self.data)
           .join("rect")
           .attr("class", "bar")
           .transition().duration(self.config.duration)
           .attr("x", d => self.xscale(d.team_one_players))
           .attr("y", d => self.yscale(d.team_one_total_points))
           .attr("width", self.xscale.bandwidth())
           .attr("height", d => self.inner_height - self.yscale(d.team_one_total_points))
        */
        self.xaxis_group
            .transition().duration(self.config.duration)
            .call(self.xaxis)
            .selectAll("text")  // スケールに表示された文字を選択する
            //.attr("x", 5)   // X座標を指定する
            //.attr("y", 5)   // Y座標を指定する
            .attr("transform", "rotate(45)")    // 文字を時計回りに90度回転させる
            .style("text-anchor", "start");

        self.yaxis_group
            .transition().duration(self.config.duration)
            .call(self.yaxis);

    }
}
