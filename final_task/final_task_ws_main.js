let scatter_plot;
let bar_chart;
let filter = [];
let detail_number = 0;
let data2 = [];


d3.csv("https://sukekuuaosou.github.io/InfoVis2022/final_task/ws.csv")
    .then(data => {  
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
        let players = [];
        let color = [];
        let game_1_result = [];
        let game_2_result = [];
        let game_3_result = [];
        let game_winner = [];
        let game_1_each_scores = {};
        let game_2_each_scores = [];
        let game_3_each_scores = [];


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
                game_1_each_scores = [];
                game_2_each_scores = [];
                game_3_each_scores = [];
                color = [];


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
                    game_1_each_scores.push({ team_one: score[0], team_two: score[1] });
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
                    game_2_each_scores.push({ team_one: score[0], team_two: score[1] });
                }
                max_gap_game.push(max_gap);
                score = [];
                pre_score = [];
                gap = 0;
                max_gap = 0;

                //第三試合(どちらかが2セット先取していれば行われない)
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
                        game_3_each_scores.push({ team_one: score[0], team_two: score[1] });
                    }
                    max_gap_game.push(max_gap);
                }

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

                players[0] = data[j].team_one_players + " vs " + data[j].team_two_players + "(first game)" + data[j].date;
                players[1] = data[j].team_one_players + " vs " + data[j].team_two_players + "(second game)"+ data[j].date;


                //１ゲーム目に逆転があったかどうか（色分け用）
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
                //2ゲーム目の棒グラフの色分け
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

                data2.push({
                    all_game_score_gap: max_gap_game[0], all_players: players[0], color: color[0], game_score: data[j].game_1_score,
                    tournament: data[j].tournament, city: data[j].city, date: data[j].city, country: data[j].country, date: data[j].date,
                    tournament_type: data[j].tournament_type, round: data[j].round, team_one_players: data[j].team_one_players, team_two_players: data[j].team_two_players,
                    each_scores: game_1_each_scores, team_one_scores: game_1_each_scores.team_one, team_two_scores: game_1_each_scores.team_two
                },
                    {
                        all_game_score_gap: max_gap_game[1], all_players: players[1], color: color[1], game_score: data[j].game_2_score,
                        tournament: data[j].tournament, city: data[j].city, date: data[j].city, country: data[j].country, date: data[j].date,
                        tournament_type: data[j].tournament_type, round: data[j].round, team_one_players: data[j].team_one_players, team_two_players: data[j].team_two_players,
                        each_scores: game_2_each_scores, team_one_scores: game_2_each_scores.team_one, team_two_scores: game_2_each_scores.team_two
                    });

                if (data[j].nb_sets == 3) {
                    players[2] = data[j].team_one_players + " vs " + data[j].team_two_players + "(third game)"+ data[j].date;
                    //3ゲーム目の棒グラフの色分け用
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
                    data2.push({
                        all_game_score_gap: max_gap_game[2], all_players: players[2], color: color[2], game_score: data[j].game_3_score,
                        tournament: data[j].tournament, city: data[j].city, date: data[j].city, country: data[j].country, date: data[j].date,
                        tournament_type: data[j].tournament_type, round: data[j].round, team_one_players: data[j].team_one_players, team_two_players: data[j].team_two_players,
                        each_scores: game_3_each_scores, team_one_scores: game_3_each_scores.team_one, team_two_scores: game_3_each_scores.team_two
                    });
                }
            }

        }

        const color_scale = d3.scaleOrdinal(d3.schemeCategory10);
        color_scale.domain(["no_reversal", "reversal", "normal", "max_gap"]);

        //使えるかわからないけど一応
        const color_scale_scatter = d3.scaleOrdinal(d3.schemeCategory10);
        color_scale_scatter.domain(["team_one_players", "team_two_players"]);

        scatter_plot = new ScatterPlot({
            parent: '#drawing_region_scatterplot',
            width: 300,
            height: 300,
            margin: { top: 10, right: 10, bottom: 50, left: 50 },
            xlabel: 'Scores of A',
            ylabel: 'Scores of B',
            cscale: color_scale
        }, data2);
        scatter_plot.update();

        bar_chart = new BarChart({
            parent: '#drawing_region_barchart',
            width: 150000,
            height: 600,
            margin: { top: 30, right: 250, bottom: 400, left: 50 },
            title: '',
            xlabel: 'Match',
            ylabel: 'Maximum score gap [point]',
            cscale: color_scale
        }, data2);
        bar_chart.update();

        d3.select('#reverse').on('click', d => { bar_chart.sort('reverse'); bar_chart.update(); });
        d3.select('#descend').on('click', d => { bar_chart.sort('descend'); bar_chart.update(); });
        d3.select('#ascend').on('click', d => { bar_chart.sort('ascend'); bar_chart.update(); });
    })
    .catch(error => {
        console.log(error);
    });