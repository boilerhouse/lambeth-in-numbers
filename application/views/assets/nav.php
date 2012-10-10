<?
$sections = array(
	array('href'=> 'home', 'value' => 'Home'),
	array('href'=> 'map', 'value' => 'Map comparisons'),
	array('href'=> 'mapmydata', 'value' => 'Add my data'),
);

$href = $this->uri->segment(1, 'home');

?>		
<ul>
	<? foreach ($sections as $sections) : ?>
		<li><a <? if($sections['href'] == $href) : ?>class="active"<? endif; ?> href="/<?=$sections['href']?>"><?=$sections['value']?></a></li>
	<? endforeach; ?>
</ul>