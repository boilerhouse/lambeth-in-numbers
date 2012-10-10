<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Lambeth in Numbers</title>
<link type="text/css" href="/static/css/style.css?v3" rel="stylesheet" />
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script>
google.load("maps", "3", {other_params:'sensor=false'});
google.load("jquery", "1.7.1");
google.load("jqueryui", "1.8.17");
google.load("visualization", "1", {packages:["corechart", "table"]});
</script>
<script type="text/javascript" src="/static/js/jquery.ui.selectmenu.js"></script>
<script type="text/javascript" src="/static/js/app.js?v2"></script>
<script type="text/javascript" src="/static/js/tabsManager.js"></script>
<?=(!empty($extra_head_content) ? $extra_head_content : '');?>
</head>
<body>
	<div id="wrapper">
		<div id="top">			
			<div id="header">
				<div id="logo"><h1><a href="/">Lambeth in Numbers</a></h1></div>
			</div>
			<div id="nav">
				<?= $this->load->view('assets/nav'); ?>
			</div>					
		</div>
		<div id="tabs"></div>
		<div id="content">
			