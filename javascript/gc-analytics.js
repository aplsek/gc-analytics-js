//ref: http://www.script-tutorials.com/highcharts-deeper-practice-for-real-statistics/

$(document).ready(
		function() {

			//test input 
			// G1
			var gcStatsFile = "input/data_csv2.txt";
			var mainTableFile = "input/table.main.txt";
			var tableByGCtype = "input/table-gctype.txt";
			//parOld:
			var gcStatsFile = "input/parOld/gc.stats.txt";
			var mainTableFile = "input/parOld/table.out.txt";
			var tableByGCtype = "input/parOld/table-gctype.out.txt";
			
			function pln(str) {
				console.log(str);
			}
			
			pln("start");

			function addToMap(map, type, x, y) {
				pln("add: " + y);
				if (isNaN(y) ) {
					return;
				}
				if (map[type] == undefined) {
					var arr0 = [];
					var gcevent = {
						name : type,
						data : arr0
					};
					map[type] = gcevent;
				}
				map[type].data.push( [ x, y ]);
			}

			function trimQuote(str) {
				if (str === undefined) {
					return "";
				}
				return str.replace(/"/g,'');
			}
			
			function decodeHeaders (items) {
				hMap =  {};
				
				$.each(items, function(itemNo, item) {
					it = trimQuote(item);
					hMap[it] = itemNo;
				});
				return hMap;
			}
			
			
			
			function initCharts(charts) {
				for (var i = 0; i < charts.length; i++) {
					c = charts[i];
					c.showLoading('Getting stat data ....');
				}
			}
			
			function hideLoadingCharts(charts) {
				for (var i = 0; i < charts.length; i++) {
					c = charts[i];
					c.hideLoading();
				}
			}
			
			function redrawCharts(charts) {
				for (var i = 0; i < charts.length; i++) {
					c = charts[i];
					c.redraw();
				}
			}
			
			function addSeries(chart, map) {
				for (var event in map) {
					chart.addSeries(map[event], false);
				}
			}
			
			pln("creating charts");

			var overviewChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container',
					type : "scatter",
					zoomType: 'x'
				},
				 title: {
		            text: 'Pause Times'
		        },
		        subtitle: {
	                text: 'zoom in'
	            },
		        yAxis: {
		            title: {
		                text: 'Pause Time [s]'
		            } /*,
		            type: 'logarithmic'*/
		        },
		        tooltip: {
		        	headerFormat: '<b>{series.name}</b><br>',
	                pointFormat: '{point.x} , {point.y} s'
	            },
	            plotOptions: {
	                scatter: {
	                    marker: {
	                        radius: 5,
	                        states: {
	                            hover: {
	                                enabled: true,
	                                lineColor: 'rgb(100,100,100)'
	                            }
	                        }
	                    },
	                    states: {
	                        hover: {
	                            marker: {
	                                enabled: false
	                            }
	                        }
	                    },
	                    tooltip: {
	                        headerFormat: '<b>{series.name}</b><br>',
	                        pointFormat: '{point.x} : {point.y} s'
	                    }
	                }
	            }
	            
			});
			
			var oldGenChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container2',
					type : "scatter",
					zoomType: 'x'
				},
				title: {
		            text: 'Old Gen Before'
		        },
		        yAxis: {
		            title: {
		                text: 'OccupationSize [Mb]'
		            }
		        },
		        tooltip: {
	                valueSuffix: 'Mb'
	            }/*,
	            legend: {
	                layout: 'vertical',
	                align: 'right',
	                verticalAlign: 'middle',
	                borderWidth: 0
	            }*/
	        
			});
			
			
			var youngGenChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container3',
					type : "scatter",
					zoomType: 'x'
				},
				title: {
		            text: 'YoungGen Before'
		        }	,
		        yAxis: {
		            title: {
		                text: 'OccupationSize [Mb]'
		            }
		        }
		       

			});
			
			
			
			var liveChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container5',
					type : "scatter",
					zoomType: 'x'
				},
				title : {
		            text: "Live Data Size"
		        },
		        yAxis: {
		            title: {
		                text: 'OccupationSize [Mb]'
		            }
		        }
		        
					
			});
			
			
			var allocChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container6',
					type : "scatter",
					zoomType: 'x'
				},
				title : {
		            text: "Allocation Rate"
		        },
		        yAxis: {
		            title: {
		                text: 'Allocated [Mb/s]'
		            }
		        }
			});
			
			var promoChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container7',
					type : "scatter",
					zoomType: 'x'
				},
				title : {
		            text: "Promotion Rate"
		        },
		        yAxis: {
		            title: {
		                text: 'Promotion Rate [Mb/s]'
		            }
		        }
			});
			
			
			var occOverviewChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container8',
					type : "scatter",
					zoomType: 'x'
				},
				title : {
		            text: "Occuptation Overview"
		        },
		        yAxis: {
		            title: {
		                text: 'Occupation [Mb]'
		            }
		        }
			});
			
			var survivorChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container4',
					type : "scatter",
					zoomType: 'x'
				},
				title: {
		            text: 'Survivor Occ Before'
		        },
		        yAxis: {
		            title: {
		                text: 'OccupationSize [Mb]'
		            }
		        }
			});
			
			//Survivor Occupation</h4>
			
			//<h4>Occupation Overview</h4>
			//<h4>Old TimeSeries</h4>
			//<h4>Young TimeSeries</h4>
			//<h4>Survivor TimeSeries</h4>
			//<h4>LiveData Size</h4>
			//<h4>Allocation Rate</h4>
			//<h4>Promotion Rate</h4>
			
			
			var hMap = {};
			var charts = [];
			charts.push(overviewChart,oldGenChart,youngGenChart,survivorChart,liveChart,allocChart,promoChart,occOverviewChart);
			// 
			function getTimestamp(items) {
				idx = hMap["timestamp"];
				return parseFloat(items[idx]);
			}
			
			function getOldGenOccBefore(items) {
				idx = hMap["old.occ.start"];
				return parseFloat(items[idx]);
			}
			
			function getYoungGenOccBefore(items) {
				idx = hMap["young.occ.start"];
				return parseFloat(items[idx]);
			}
			
			function getSurvivorBefore(items) {
				idx = hMap["survivor.start"];
				return parseFloat(items[idx]);
			}
			
			function getAlloc(items) {
				idx = hMap["allocationRate"];
				return parseFloat(items[idx]);
			}
			
			function getPromo(items) {
				idx = hMap["promoRate"];
				return parseFloat(items[idx]);
			}
			
			function getLive(items) {
				idx = hMap["old.occ.end"];
				return parseFloat(items[idx]);
			}
			
			function getGCtype(items) {
				idx = hMap["gc.type"];
				return items[idx];
			}
			
			function getPauseTime(items) {
				idx = hMap["pause.time"];
				return parseFloat(items[idx]);
			}
			

			$.get(mainTableFile, function(data) {
				var mytable = "<table cellpadding=\"2\" cellspacing=\"2\"><tbody><tr>";
				var lines = data.split('\n');
				
				mytable += "<td><b>Statistic</b></td>" +  "<td><b> Value</b></td></tr></tr>";
				$.each(lines, function(lineNo, line) {
					var items = line.split(',');
					if (lineNo == 0) {
					} else {
						mytable += "<td>" + trimQuote(items[1]) + "</td>" +
									"<td>" + trimQuote(items[2]) + " " + trimQuote(items[3]) + "</td>";
						mytable += "</tr><tr>";
					}
				});
				mytable += "</tr></tbody></table>";
				//document.write(mytable);
				$('#summary-table').html(mytable);
			});
			
			$.get(tableByGCtype, function(data) {
				var mytable = "<table cellpadding=\"2\" cellspacing=\"2\"><tbody><tr>";
				var lines = data.split('\n');
				
				mytable += "<td><b>GCtype</b></td>" +  "<td><b>#</b></td>  " +
						"				<td><b> Time [s]</b></td> <td><b> Avg [s]</b></td>" +
						"<td><b>Max [s]</b></td></tr></tr> </tr>" +  + "</tr>";
				$.each(lines, function(lineNo, line) {
					line = trimQuote(line);
					var items = line.split(',');
					if (lineNo == 0) {
					} else {
						pln("item 2 :" +items[2]);
						mytable += "<td>" + trimQuote(items[1]) + "</td>" +  "<td>" + trimQuote(items[2])+ "</td>";
						mytable += "<td>" + trimQuote(items[3]) + "</td>" +  "<td>" + trimQuote(items[4]) + "</td>";
					    mytable += "<td>" + trimQuote(items[5]) + "</td>";
						mytable += "</tr><tr>";
					}
				});
				mytable += "</tr></tbody></table>";
				//document.write(mytable);
				$('#summary-gc-type-table').html(mytable);
			});
			
			$.get(gcStatsFile, function(data) {
				var map = {};
				var mapOldOccStart = {};
				var mapYoungOccStart = {};
				var mapAlloc = {};
				var mapPromo = {};
				var mapLive = {};
				var mapSurvivor = {};
				
				initCharts(charts);
				pln("reading"); 
				var lines = data.split('\n');
				var i = 0;
				$.each(lines, function(lineNo, line) {
					line = trimQuote(line);
					var items = line.split(',');
					if (lineNo == 0) {
						hMap = decodeHeaders(items);
						pln("header decoded");
					} else {  // TODO: we assume no empty lines
						addToMap(map, getGCtype(items), getTimestamp(items),getPauseTime(items));
						addToMap(mapOldOccStart,getGCtype(items), getTimestamp(items),getOldGenOccBefore(items));
						addToMap(mapYoungOccStart,getGCtype(items), getTimestamp(items),getYoungGenOccBefore(items));
						addToMap(mapSurvivor,getGCtype(items), getTimestamp(items),getSurvivorBefore(items));
						addToMap(mapAlloc,getGCtype(items), getTimestamp(items),getAlloc(items));
						addToMap(mapPromo,getGCtype(items), getTimestamp(items),getPromo(items));
						addToMap(mapLive,getGCtype(items), getTimestamp(items),getLive(items));
						i++;
					}
				});

				pln("add series : " + Object.keys(map).length);
				hideLoadingCharts(charts);
				pln("hello5, lines read =" + i);
				addSeries(overviewChart,map);
				addSeries(oldGenChart,mapOldOccStart);
				addSeries(youngGenChart,mapYoungOccStart);
				addSeries(survivorChart,mapSurvivor);
				addSeries(allocChart,mapAlloc);
				addSeries(promoChart,mapPromo);
				addSeries(liveChart,mapLive);
				//todo occuption overview
				
				pln("hello6");
				redrawCharts(charts);
				pln("hello7");
			});
			
		});
