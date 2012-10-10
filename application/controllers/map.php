<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Map extends CI_Controller {
	public function __construct() {
		parent::__construct();
	}

	public function index()
	{
		$data['show_cc']		= true;
		$data['content_id'] = '';
		$data['extra_head_content'] = '<script type="text/javascript" src="/static/js/example.js?v2"></script>';
		$this->load->view('index', $data);	
	}

	public function load()
	{
		$this->db->where('user_id', $this->user->id);
		echo $this->db->get('sys_users')->row()->data;
	}	
		
	public function save()
	{
		$post = $this->input->post(); 		
		$data['data'] = json_encode($post);
		$this->db->where('user_id', $this->user->id);
		$this->db->update('sys_users', $data);		
		echo 1;
	}
	
	public function get_markers()
	{
		$post = $this->input->post();
		
		$this->db->where('marker_type_id', $post['marker_type_id']);
		$this->db->where('deleted IS NULL'); // tmp
		$results = $this->db->get('markers')->result();
		
		$markers = array();
		
		foreach ($results as $result) 
			$markers[] = array($result->marker_id, $result->marker_title, $result->latitude, $result->longitude, $result->modified, $result->created, $result->updated, $result->deleted, $result->marker_type_id, $result->user_id);	
		
		$response['markers'] = $markers;

		echo json_encode($response);	
	}
}