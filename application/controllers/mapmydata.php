<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mapmydata extends CI_Controller {
	
	public function index()
	{
		$data['extra_head_content'] = '<script type="text/javascript" src="/static/js/mapmydata.js"></script>';
		$this->load->view('index', $data);	
	}
	
	public function mapconfig()
	{	
		$this->db->where('user_id', $this->user->id);
		echo $this->db->get('sys_users')->row()->config;
	}
	
	public function saveconfig()
	{
		$post = $this->input->post(); 
		
		$data['config'] = json_encode($post);
		$this->db->where('user_id', $this->user->id);
		$this->db->update('sys_users', $data);
		
		echo 1;
	}
	
	public function clear()
	{
		$this->db->where('user_id', $this->user->id);
		$this->db->delete('markers');
		
		$this->load->helper('url');
		redirect('mapmydata');
	}	
	
	public function load()
	{
		$this->db->select('*, UNIX_TIMESTAMP(modified) AS modified, UNIX_TIMESTAMP(created) AS created, UNIX_TIMESTAMP(updated) AS updated, UNIX_TIMESTAMP(deleted) AS deleted');
		$this->db->where('user_id', $this->user->id);
		$this->db->where('deleted IS NULL');
		$results = $this->db->get('markers')->result();
		
		$markers = array();
		
		foreach ($results as $result) 
			$markers[] = array($result->marker_id, $result->marker_title, $result->latitude, $result->longitude, $result->modified, $result->created, $result->updated, $result->deleted, $result->marker_type_id);	
		
		$response['markers'] = $markers;
		$response['last_checked'] = time();
		
		echo json_encode($response);
	}
	
	public function save_marker()
	{
		$post = $this->input->post();
		$insert = array(
			'user_id'			=> $this->user->id,
			'marker_type_id'	=> $post['marker_type_id'],
			'marker_title'		=> $post['title'],
			'latitude'			=> $post['latitude'],
			'longitude'			=> $post['longitude'],
			'created'			=> date('Y-m-d H:i:s'),
			'modified'			=> date('Y-m-d H:i:s')
		);
		$this->db->insert('markers', $insert);
	
		$response['marker_id'] = $this->db->insert_id();		
	
		echo json_encode($response);
	}	
	
	function update_marker()
	{
		$post = $this->input->post();

		$update = array(
			'latitude'	=> $post['latitude'],
			'longitude'	=> $post['longitude'],
			'updated'	=> date('Y-m-d H:i:s'),
			'modified'	=> date('Y-m-d H:i:s')
		);

		$this->db->where('marker_id', $post['marker_id']);
		$this->db->update('markers', $update);
		
		$response['marker_id'] = $post['marker_id'];
		
		echo json_encode($response);
	}
	
	function delete_marker()
	{
		// simulate a slow call
		//sleep(1);
		
		$post = $this->input->post();

		$update = array(
			'deleted'	=> date('Y-m-d H:i:s'),
			'modified'	=> date('Y-m-d H:i:s')
		);

		$this->db->where('marker_id', $post['marker_id']);
		$this->db->update('markers', $update);
		
		$response['marker_id'] = $post['marker_id'];
		
		echo json_encode($response);
	}
	
	
	public function check()
	{
		$post = $this->input->post();
		
		// get content since it was last checked
		$last_checked = $post['last_checked'];		
		$last_checked = date('Y-m-d H:i:s', $last_checked);
		
		$this->db->select('*, UNIX_TIMESTAMP(modified) AS modified, UNIX_TIMESTAMP(created) AS created, UNIX_TIMESTAMP(updated) AS updated, UNIX_TIMESTAMP(deleted) AS deleted');
		$this->db->where('modified >=', $last_checked);
		//$this->db->where('deleted IS NULL'); // we want to bring back deleted so we can remove them!
		$results = $this->db->get('markers')->result();
	
		$markers = array();
		
		foreach ($results as $result) 
			$markers[] = array($result->marker_id, $result->marker_title, $result->latitude, $result->longitude, $result->modified, $result->created, $result->updated, $result->deleted, $result->marker_type_id);	
		
		$response['markers'] = $markers;

		
		// mark as checked now	
		$response['last_checked'] = time();
		
		echo json_encode($response);
	}
		
}