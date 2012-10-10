// uncomment to turn off debugging
if (!window.console) console = {log: function() {}};

var tabsManager;
var colorRange = ['#590d0b', '#f26101', '#ddc086', '#97fbec', '#589dbe'];

var charts = {
	1: {	
		title: "London boroughs ranked by deprivation",
		desc: "Boroughs are ranked by percentage of their LSOAs that fall into the 10% most deprived in England.",
		type: "Table",
		options : {showRowNumber: true, width: 440, height: 780, cssClassNames: {'headerRow':'headerRow', 'tableRow':'tableRow', 'oddTableRow':'oddTableRow', 'selectedTableRow':'selectedTableRow', 'hoverTableRow':'hoverTableRow', 'headerCell':'headerCell', 'tableCell':'tableCell', 'rowNumberCell':'rowNumberCell'}},
		percent : 3,
		cols : [
			['string','LA Name'],
			['number','Total LSOAs'],
			['number','Deprived LSOAs'],
			['number','Percentage']
		],	
		rows : [			
			['Hackney',137,57,0.42],
			['Tower Hamlets',130,52,0.40],
			['Newham',159,50,0.31],
			['Haringey',144,42,0.29],
			['Greenwich',143,25,0.17],
			['Waltham Forest',145,24,0.17],
			['Islington',118,19,0.16],
			['Brent',174,24,0.14],
			['Enfield',181,19,0.10],
			['City of Westminster',120,12,0.10],
			['Barking and Dagenham',109,11,0.10],
			['Kensington and Chelsea',103,9,0.9],
			['Ealing',195,13,0.7],
			['Lambeth',177,8,0.5],
			['Hammersmith and Fulham',111,4,0.4],
			['Croydon',220,9,0.4],
			['Bromley',197,5,0.3],
			['Lewisham',166,5,0.3],
			['Southwark',165,4,0.2],
			['Camden',133,3,0.2],
			['Wandsworth',174,2,0.1],
			['Hillingdon',163,1,0.1],
			['Havering',149,2,0.1],
			['Redbridge',159,1,0.1],
			['Hounslow',139,1,0.1],
			['Sutton',121,0,0],
			['Richmond upon Thames',114,0,0],
			['Barnet',210,0,0],
			['Kingston upon Thames',97,0,0],
			['Bexley',146,0,0],
			['Harrow',137,0,0],
			['Merton',124,0,0],
			['City of London',5,0,0]
		]
	},
	2: {
		title: "Prevalence of fast food outlets",
		desc: "Table shows numbers of fast food outlets in London boroughs, in total and per hundrend thousand population.",
		type: "Table",
		options : {showRowNumber: true, width: 440, height: 780, cssClassNames: {'headerRow':'headerRow', 'tableRow':'tableRow', 'oddTableRow':'oddTableRow', 'selectedTableRow':'selectedTableRow', 'hoverTableRow':'hoverTableRow', 'headerCell':'headerCell', 'tableCell':'tableCell', 'rowNumberCell':'rowNumberCell'}},
		cols : [
			['string','LA Name'],
			['number','Fast food outlets'],
			['number','Total Population 2010'],
			['number','Per 100,000']
		],
		rows : [			
			['Barking and Dagenham',205,179741,114],
			['Barnet',253,348198,73],
			['Bexley',178,227957,78],
			['Brent',291,256556,113],
			['Bromley',238,312380,76],
			['Camden',295,235362,125],
			['Croydon',393,345562,114],
			['Ealing',287,318516,90],
			['Enfield',265,294927,90],
			['Greenwich',215,228509,94],
			['Hackney',253,219228,115],
			['Hammersmith and Fulham',191,169705,113],
			['Haringey',252,224996,112],
			['Harrow',168,230057,73],
			['Havering',215,236137,91],
			['Hillingdon',217,266114,82],
			['Hounslow',129,236760,54],
			['Islington',270,194080,139],
			['Kensington and Chelsea',100,169494,59],
			['Kingston upon Thames',127,168955,75],
			['Lambeth',310,284484,109],
			['Lewisham',314,266480,118],
			['Merton',173,208794,83],
			['Newham',290,240124,121],
			['Redbridge',205,270501,76],
			['Richmond upon Thames',108,190920,57],
			['Southwark',313,287041,109],
			['Sutton',180,194195,93],
			['Tower Hamlets',263,237896,111],
			['Waltham Forest',279,227145,123],
			['Wandsworth',275,289574,95],
			['Westminster',422,253112,167]
		]
	},
	3: {
		title: "Free school meals in Lambeth",
		desc: "Pie chart shows the average across all LSOAs of children eligble for free school meals.",
		type: "PieChart",
		options : {title: "", colors:['#00B259','#B3E8CD', '#AAAAAA'], width: 440, height: 400, legend: 'bottom', is3D: true, chartArea:{left:20,top:40,width:"100%",height:"70%"}, legendTextStyle : {fontSize: 11}},
		cols : [
			['string', 'Area'],
			['number', 'Percent']
		],
		rows : [
			['Eligible', 34],
			['Not eligible', 66]
		]
	},
	4: {
		title: "Greenspace and gardens in Lambeth",
		desc: "Pie chart shows the proportion of all land in Lambeth which is greenspace or gardens.",
		type: "PieChart",
		options : {title: "", colors:['#00B259','#B3E8CD', '#AAAAAA'], width: 440, height: 400, legend: 'bottom', is3D: true, chartArea:{left:20,top:40,width:"100%",height:"70%"}, legendTextStyle : {fontSize: 11}},
		cols : [
			['string', 'Area'],
			['number', 'Percent']
		],
		rows : [
			['Gardens', 25.98],
			['Greenspace', 17.25],
			['Other', 56.77]
		]
	}
}



var baseLayers = {
	1: {
		name: 	"English Indices of Deprivation (2010) by LSOA",
		fusion: "1P7xHx9Gr9QP9E_pZNVygEvvsU_3TpdwYWWTy3CU",
		options: {
			1: {name: "Overall", 		col: "RANK OF IMD SCORE (where 1 is most deprived)",								styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			2: {name: "Income", 		col: "RANK OF INCOME SCORE (where 1 is most deprived)",								styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Income Deprivation domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			3: {name: "Employment", 	col: "RANK OF EMPLOYMENT SCORE (where 1 is most deprived)",							styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Employment Deprivation  domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			4: {name: "Health", 		col: "RANK OF HEALTH DEPRIVATION AND DISABILITY SCORE (where 1 is most deprived)",	styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Health Deprivation and Disability domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			5: {name: "Education", 		col: "RANK OF EDUCATION SKILLS AND TRAINING SCORE (where 1 is most deprived)",		styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Education, Skills and Deprivation domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			6: {name: "Housing", 		col: "RANK OF BARRIERS TO HOUSING AND SERVICES SCORE (where 1 is most deprived)",	styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Barriers to Housing and Services domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			7: {name: "Crime", 			col: "RANK OF CRIME SCORE (where 1 is most deprived)",								styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Crime domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."},
			8: {name: "Environment", 	col: "RANK OF LIVING ENVIRONMENT SCORE (where 1 is most deprived)",					styles: [1,6496,12992,19488,25984,32482], about: "This dataset puts the 32,482 LSOAs into a rank order based on their 2010 IMD score. A rank of 1 is the most deprived.", source: "Index of Multiple Deprivation rankings for the Living Environment Deprivation domain, 2010. Provided by the Department of Communities and Local Government, which can be <a href=\"http://www.communities.gov.uk/publications/corporate/statistics/indices2010\" target=\"_blank\">downloaded here</a>."}
		}	
	},
	2: {
		name: 	"Child Obesity prevalence (2008/09 to 2010/11) by MSOA",
		fusion: "1wjDm1lYwFSMHYHTIw3PMeTfQZxTl8mnOtL7ZX3g",
		about: 	"x",
		source: "x",
		reverseRange: true,
		options: {
			1: {name: 	"Reception (age 4-5 years) % obese", 	col: 	"Reception (age 4-5 years) % obese", 			styles: [22.2, 18.22, 14.24, 10.26, 6.28, 2.3], about: "Obesity prevalence by school year and MSOA of child residence. The lower percentage the lower the prevalence of obesity.", source: "National Child Measurement Programme"},
			2: {name: 	"Year 6 (age 10-11) % obese", 			col: 	"Year 6 (age 10-11) % obese", 					styles: [34.5, 28.28, 22.06, 15.84, 9.62, 3.4], about: "Obesity prevalence by school year and MSOA of child residence. The lower percentage the lower the prevalence of obesity.", source: "National Child Measurement Programme"}
		}	
	},
	3: {
		name: 	"Free School Meals (mid 2011) by LSOA",
		fusion: "1NgFtvkGN49jRxO0ENIZWybPoKYzCWu6JIVzMW6I",
		about: "y",
		source: "y",
		reverseRange: true,
		options: {
			1: {name: "Percentage Eligible", 	col: "PERCENTAGE_ELIGIBLE",												styles: [55.914,45.219,34.524,23.829,13.134,2.439], about: "Percentage of all children in LSOA that are eligible for free school meals", source: "Lambeth Council"},
			2: {name: "Rank", 					col: "RANK",															styles: [177.0,141.8,106.6,71.4,36.2,1.0], 			about: "Percentage of all children in LSOA that are eligible for free school meals", source: "Lambeth Council"}
		}
	},
	4: {
		name: 	"Land Use (2005) by MSOA",
		fusion: "1ulbf5LKxEM3-Tixnoyd5JFa2TPmeIlfKcdrYaFw",
		about: "z",
		source: "z",
		options: {
			1: {name: "Total Area", 				col: "TOTAL_AREA",													styles: [461.58,644.83,828.08,1011.33,1194.58,1377.83], about: "Map shows total land area in thousands of square metres within each LSOA", source: "Land Use Statistics (Generalised Land Use Database), 2005"},
			2: {name: "Domestic Gardens", 				col: "DOMESTIC_GARDENS_PERCENT",								styles: [2.82,10.676,18.532,26.388,34.244,42.1], 		about: "Percentage of total land area that is domestic gardens", source: "Land Use Statistics (Generalised Land Use Database), 2005"},
			3: {name: "Greenspace", 					col: "GREENSPACE_PERCENT",										styles: [2.73,10.158,17.586,25.014,32.442,39.87], 		about: "Percentage of total land area that is greenspace", source: "Land Use Statistics (Generalised Land Use Database), 2005"}
		}
	}
}    

// points are ajax'd as over 1,600+ businesses
var overlayMarkerOptions = {	
	1: {name: "Restaurant/cafe/snack bar",		icon: 'restaurant'},
	3: {name: "Public House - Catering", 		icon: 'gourmet_0star'},
	4: {name: "Take-away food", 				icon: 'sandwich-2'},
	5: {name: "Grocers & Small Supermarkets", 	icon: 'conveniencestore'},
	7: {name: "Bar/cafe bar/ bar-restaurant", 	icon: 'fastfood'},
	11: {name: "Food Manufacturers", 			icon: 'factory'},
	12: {name: "Market Stalls", 				icon: 'market'},
	14: {name: "Delicatessen", 					icon: 'patisserie'},
	15: {name: "Catering Company", 				icon: 'fooddeliveryservice'},
	18: {name: "Super market", 					icon: 'supermarket'},
	20: {name: "Other - Food Premises", 		icon: 'kiosk'},
	21: {name: "Butchers", 						icon: 'butcher-2'},
	22: {name: "Fishmongers", 					icon: 'fishingstore'},
	23: {name: "Bakers - retail", 				icon: 'bread'},
	26: {name: "Off Licence", 					icon: 'liquor'},
	28: {name: "Bakehouse", 					icon: 'bread'},
	30: {name: "Food importer", 				icon: 'grocery'},
	32: {name: "Greengrocers & Fruiterers", 	icon: 'fruits'},
	33: {name: "Mobile Shop - Snack Bar", 		icon: 'foodtruck'},
	37: {name: "Wholesale Food Premises", 		icon: 'warehouse-2'},
	45: {name: "Warehouse - Food", 				icon: 'villa'},
	49: {name: "Bakers", 						icon: 'bread'},
	50: {name: "Dairy", 						icon: 'eggs'},
	55: {name: "Mobile Shop - Fish & Chips", 	icon: 'fishchips'},
	56: {name: "Hall & Clubrooms", 						icon: 'scoutgroup'},	
	57: {name: "Internet cafe, international calls", 	icon: 'wifi'},	
	58: {name: "Allotments", 							icon: 'field'},
	59: {name: "Private", 								icon: 'award'},	
	60: {name: "School", 								icon: 'school'},	
	61: {name: "Faith", 								icon: 'church-2'},	
	62: {name: "GP Surgery", 							icon: 'hospital-building'},	
	63: {name: "Housing", 								icon: 'house'},	
	64: {name: "Park", 									icon: 'forest'},	
	65: {name: "Transport", 							icon: 'truck3'}
}

// markers above ^ are in what groups..
var overlayMarkerGroups = {
	1: {name: 	"Sit down meals",	options: [1, 3, 7]},
	2: {name: 	"Snacks",			options: [1, 3, 4, 5, 7, 12, 14, 18, 23, 26, 32, 33, 49, 55]},
	3: {name: 	"Takeaway",			options: [4, 18, 23, 55]},
	4: {name: 	"Food trade",		options: [11, 15, 20, 28, 30, 37, 45, 50]},
	5: {name: 	"Food retail",		options: [5, 12, 14, 18, 21, 22, 23, 26, 32, 33, 49]},
	6: {name: 	"Food Growing Projects", options: [56,57,58,59,60,61,62,63,64,65]}
}

// two types of layout to choose from..
var layouts = {
	1: {name: "Map comparison", 	render: "mapComparison"},
	2: {name: "Map with charts", 	render: "mapWithCharts"}
}