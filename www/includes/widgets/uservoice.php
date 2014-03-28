<div class="widget">
	<h2>Ideas & Feedback</h2>
	<div id="uservoice"></div>
</div>
<script>
UserVoice=window.UserVoice||[];
(function(){
	var uv=document.createElement('script');
	uv.type='text/javascript';
	uv.async=true;
	uv.src='//widget.uservoice.com/ZH7aZEi7vQRodMQUAUQl8A.js';
	var s=document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(uv,s)
})();
UserVoice.push(['embed', '#uservoice', {
  mode: 'smartvote',
  height: '300px',
  width: '100%',
  accent_color: '#f33',
  smartvote_title: 'Ideas & Feedback',
  screenshot_enabled: true
}]);
UserVoice.push(['identify', {
	name: "<?php echo $user_data['username']; ?>",
	id: <?php echo $_SESSION['id']; ?>
}]);
</script>
