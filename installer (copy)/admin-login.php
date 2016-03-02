<?php ?>
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
				<div class="login-box-head">
					Admin Account Setup
					<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Admin Account Setup" data-content="This is the super administrator username and password that will be used to manage the Olympus application. Keep these credentials safe and secure" style="cursor:pointer;">
				</div>
	<!-- form section -->
				<form id="databaseForm" method="post" action="post.php?action=adminLogin" class="login-box-body">
					<div class="message">
						<?php 	
							if(isset($_SESSION['msg'])){
								echo "<p style='color:red;text-align:center;'>". $_SESSION['msg'] ."</p>";
							}
						?>
					</div>
					<label for="email"> Email: </label>
					<input type="text" class="login-input-field email" placeholder="Please enter your login email" name="email">
					
					<label for="database_name"> Confirm Email: </label>
					<input type="text" class="login-input-field confirm-email" placeholder="Confirm email" name="confirm-email">
					
					<label for="database_hostname"> Password: </label>
					<input type="password" class="login-input-field password" placeholder="Please enter your login password" name="password">
					
					<label for="username"> Confirm Password: </label>
					<input type="password" class="login-input-field confirm-password" placeholder="Confirm Password" name="confirm-password">
					
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

				var email 				= $("input[name='email']").val();
				var confirmEmail 		= $("input[name='confirm-email']").val();
				var password 			= $("input[name='password']").val();
				var confirmPassword 	= $("input[name='confirm-password']").val();

				if(email.trim() === ''){

					$( ".email" ).css({'border': '1px solid red'});
					$( ".confirm-email" ).css({'border': '1px solid #d7dbdc'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});
					$( ".confirm-password" ).css({'border': '1px solid #d7dbdc'});
					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter your email. </p> " );
					return false;					
				}

				if(confirmEmail.trim() != email.trim()){

					$( ".email" ).css({'border': '1px solid #d7dbdc'});
					$( ".confirm-email" ).css({'border': '1px solid red'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});
					$( ".confirm-password" ).css({'border': '1px solid #d7dbdc'});

					$( ".message" ).html( " <p style='color:red;text-align:center;'> Email entered does not match. </p> " );
					return false;					
				}

				if(password.trim() === ''){

					$( ".email" ).css({'border': '1px solid red'});
					$( ".confirm-email" ).css({'border': '1px solid #d7dbdc'});
					$( ".password" ).css({'border': '1px solid red'});
					$( ".confirm-password" ).css({'border': '1px solid #d7dbdc'});

					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter password. </p> " );
					return false;					
				}

				if(confirmPassword.trim() === ''){

					$( ".email" ).css({'border': '1px solid red'});
					$( ".confirm-email" ).css({'border': '1px solid #d7dbdc'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});
					$( ".confirm-password" ).css({'border': '1px solid red'});

					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter your database username </p> " );
					return false;					
				}

				$("#databaseForm").submit();

				
			});

			$(function () {
					$('[data-toggle="popover"]').popover()
			});
		});

	</script>
<?php unset($_SESSION['msg']); ?>
</html>