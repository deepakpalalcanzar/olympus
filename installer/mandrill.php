<?php  session_start(); ?>
<!DOCTYPE html>
<html>
	<?php include "header.php"; ?>
<body>

	<header>&nbsp;</header>

	<div class="container center_div">
		<div class="col-lg-12">&nbsp;</div>
		<div class="col-lg-12">&nbsp;</div>
		<img src="img/installer.png" alt="Olympus Installer" class="img img-responsive"/>
		<div class="col-lg-12">&nbsp;</div>
		<div class="col-lg-12">&nbsp;</div>		
	</div>

	<div class="container">
	  	<div class="row">
		  	<div class="login-template">
				<div class="login-box-head"> Mandrill Configuration File </div>
<!-- form section -->
				<form id="mandrillForm" method="post" action="post.php?action=mandrill" class="login-box-body">
					<div class="message">
						<?php 	
							if(isset($_SESSION['msg'])){
								echo "<p style='color:red;text-align:center;'>". $_SESSION['msg'] ."</p>";
							}
						?>
					</div>
					<label for=""> Mandrill Api Key: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Mandrill Api Key" data-content="Olympus uses Mandrill for email operations to send email notifications. If you do not already have a key go to www.mandrill.com for your free account." style="cursor:pointer;">
					</label>
					<input type="text" class="login-input-field mandrill-key" placeholder="" value="" name="mandrill_key">
				</form>
<!-- footer section -->
				<div class="login-box-footer clearfix">
					<a class="signinbutton">
						<input type="image" class="signin-button" src="img/next_btn.png">
					</a>
				</div>
			</div>
	  	</div>
	</div>

	<div class="col-lg-12">&nbsp;</div>
	<div class="col-lg-12">&nbsp;</div>		


</body>
	<?php include "footer.php"; ?>

	<script>
		
		$(document).ready(function(){
			$('.signin-button').click(function(){
				var mandrillKey 		= $("input[name='mandrill_key']").val();
				if(mandrillKey.trim() === ''){
					$( ".mandrill-key" ).css({'border': '1px solid red'});
					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter your mandrill api key. </p> " );
					return false;					
				}
				$("#mandrillForm").submit();
			});
		});

		$(function () {
  			$('[data-toggle="popover"]').popover()
		});

	</script>
<?php unset($_SESSION['msg']); ?>
</html>