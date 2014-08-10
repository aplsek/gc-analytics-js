//ref: http://www.script-tutorials.com/highcharts-deeper-practice-for-real-statistics/
// adding the "expID=" parameter into the url, use e.g. "http:.../gc-report.html?expID=102"


$(document).ready(
		
		
		
		function() {

			function getQueryParams(qs) {
			    qs = qs.split("+").join(" ");

			    var params = {}, tokens,
			        re = /[?&]?([^=]+)=([^&]*)/g;

			    while (tokens = re.exec(qs)) {
			        params[decodeURIComponent(tokens[1])]
			            = decodeURIComponent(tokens[2]);
			    }

			    return params;
			}

			var query = getQueryParams(document.location.search);
			//alert(query.idURL);	
			
			pln("url decode:" + query.idURL);
			
			//test input 
			// G1
			var experimentsDir = "experiments";
			//var expID = "101";
			var expID =   query.expID;
			
			
			//"102";
			var SEP = "/";
			var expDir = experimentsDir + SEP + expID + SEP;
				
			var gcStatsFile = expDir + "gc.stats.txt";
			var mainTableFile =  expDir +"table.main.txt";
			var tableByGCtype = expDir +"table-gctype.txt";
			var gcLogRaw = expDir + "gc.log";
			//parOld:
			//var gcStatsFile = "input/parOld/gc.stats.txt";
			//var mainTableFile = "input/parOld/table.out.txt";
			//var tableByGCtype = "input/parOld/table-gctype.out.txt";
			
			function pln(str) {
				console.log(str);
			}
			
			pln("start");

			function addToMap(map, type, x, y) {
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
					renderTo : 'container-pauseTimes',
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
			
			var heapAfterChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-heap-after',
					type : "scatter",
					zoomType: 'x'
				},
				title: {
		            text: 'Heap Occupation After GC'
		        },
		        yAxis: {
		            title: {
		                text: 'OccupationSize [Mb]'
		            }
		        },
		        tooltip: {
	                valueSuffix: 'Mb'
	            }
			});
			
			var oldGenChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-oldGen',
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
					renderTo : 'container-young-gen-before',
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
		        },
		        tooltip: {
	                valueSuffix: 'Mb'
	            }
		       

			});
			
			
			
			var liveChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-liveSize',
					zoomType: 'x'
				},
				title : {
		            text: "Live Data Size"
		        },
		        yAxis: {
		            title: {
		                text: 'OccupationSize [Mb]'
		            }
		        },
		        tooltip: {
	                valueSuffix: 'Mb'
	            }
		        
					
			});
			
			
			var allocChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-aloccation',
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
		        },
		        tooltip: {
	                valueSuffix: 'Mb/s'
	            }
			});
			
			var promoChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-promo',
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
		        },
		        tooltip: {
	                valueSuffix: 'Mb/s'
	            }
			});
			
			
			var occOverviewChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-occupation',
					type : "scatter",
					zoomType: 'x'
				},
				title : {
		            text: "Occupation Overview"
		        },
		        yAxis: {
		            title: {
		                text: 'Occupation [Mb]'
		            }
		        },
		        tooltip: {
	                valueSuffix: 'Mb'
	            }
			});
			/*
			var gcPie = new  new Highcharts.Chart( {
				chart: {
					renderTo : 'container-pie',
				plotBackgroundColor: null,
	            	plotBorderWidth: null,
	            	plotShadow: false
	        	},
	        	title: {
	        		text: 'GC Events Distribution'
	        	},
	        	tooltip: {
	        		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        	},
	        	plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true,
		                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                    style: {
		                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                    }
		                }
		            }
		        },
		        series: [{
		            type: 'pie',
		            name: 'Browser share',
		            data: [
		                ['Firefox',   45.0],
		                ['IE',       26.8],
		                {
		                    name: 'Chrome',
		                    y: 12.8,
		                    sliced: true,
		                    selected: true
		                },
		                ['Safari',    8.5],
		                ['Opera',     6.2],
		                ['Others',   0.7]
		            ]
		        }]
			});*/
			
			
		       
			
			var survivorChart = new Highcharts.Chart( {
				chart : {
					renderTo : 'container-survivor',
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
			charts.push(overviewChart,heapAfterChart,oldGenChart,youngGenChart,survivorChart,liveChart,allocChart,promoChart,occOverviewChart);
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
			
			function getHeapAfter(items) {
				
				idx = hMap["heap.occ.end"];
				//pln("after =" + items[idx]);
				return parseFloat(items[idx]);
			}
			
			function getPauseTime(items) {
				idx = hMap["pause.time"];
				return parseFloat(items[idx]);
			}
			
			function isEmpty(str) {
			    return (!str || 0 === str.length);
			}
			

			$.get(mainTableFile, function(data) {
				var mytable = "<table class=\"table table-striped table-hover\" ><tbody><tr>";
				var lines = data.split('\n');
				
				mytable += "<td><b>Statistic</b></td>" +  "<td><b> Value</b></td></tr></tr>";
				$.each(lines, function(lineNo, line) {
					var items = line.split(',');
					if (lineNo == 0 || isEmpty(line)) {
						return; // stop processing this iteration
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
				
				var mytable = "<table class=\"table table-striped table-hover\">";
				var lines = data.split('\n');
				
				mytable += "<thead><tr><th>GCtype</th>" +  "<th>#</th>  " +
						"				<th> Time [s]</th> <th> Avg [s]</th>" +
						"<th>Max [s]</th>" +  + "</tr></thead><tbody><tr>";
				$.each(lines, function(lineNo, line) {
					line = trimQuote(line);
					var items = line.split(',');
					if (lineNo == 0 || isEmpty(line)) {
						return; // stop processing this iteration
					} else {
						//pln("item 2 :" +items[2]);
						mytable += "<tr>";
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
			
			function isFullGC(gcevent) {
				if ((gcevent.indexOf("full") !== -1))
					return true;
				else
					return false;
			}
			
			$.get(gcStatsFile, function(data) {
				var map = {};
				var mapOldOccStart = {};
				var mapYoungOccStart = {};
				var mapAlloc = {};
				var mapPromo = {};
				var mapLive = {};
				var mapSurvivor = {};
				var mapHeapAfter = {};
				
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
					} else if (isEmpty(line)) {
						return;
					} else {  // TODO: we assume no empty lines
						addToMap(map, getGCtype(items), getTimestamp(items),getPauseTime(items));
						addToMap(mapHeapAfter,getGCtype(items), getTimestamp(items),getHeapAfter(items));
						addToMap(mapOldOccStart,getGCtype(items), getTimestamp(items),getOldGenOccBefore(items));
						addToMap(mapYoungOccStart,getGCtype(items), getTimestamp(items),getYoungGenOccBefore(items));
						addToMap(mapSurvivor,getGCtype(items), getTimestamp(items),getSurvivorBefore(items));
						addToMap(mapAlloc,getGCtype(items), getTimestamp(items),getAlloc(items));
						addToMap(mapPromo,getGCtype(items), getTimestamp(items),getPromo(items));
						
						if (isFullGC(getGCtype(items)))
							addToMap(mapLive,getGCtype(items), getTimestamp(items),getLive(items));
						i++;
					}
				});

				pln("add series : " + Object.keys(map).length);
				hideLoadingCharts(charts);
				pln("hello5, lines read =" + i);
				addSeries(overviewChart,map);
				addSeries(heapAfterChart, mapHeapAfter);
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
			
			$(document).ready(function() {
			    $("#lesen").click(function() {
			        $.ajax({
			            url : gcLogRaw,
			            dataType: "text",
			            success : function (data) {
			                $(".text").html(data);
			            }
			        });
			    });
			});
			
		});
