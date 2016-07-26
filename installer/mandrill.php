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
				<div class="login-box-head"> Email Configuration File </div>
<!-- form section -->
				<form id="mandrillForm" method="post" action="post.php?action=mandrill" class="login-box-body">
					<div class="message">
						<?php 	
							if(isset($_SESSION['msg'])){
								echo "<p style='color:red;text-align:center;'>". $_SESSION['msg'] ."</p>";
							}
						?>
					</div>
					<div>
						<span>
							<input type="radio" name="mail_service" value="mandrill" checked="checked" /> Use Mandrill
						</span>
						<span>
							<input type="radio" name="mail_service" value="internal" /> Use Internal Email Setup
						</span>
					</div><br>
					<div id="mandrill_details">
						<label for=""> Mandrill Api Key: 
							<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Mandrill Api Key" data-content="Olympus uses Mandrill for email operations to send email notifications. If you do not already have a key go to www.mandrill.com for your free account." style="cursor:pointer;">
						</label>
						<input type="text" class="login-input-field mandrill-key" placeholder="" value="" name="mandrill_key">
					</div>
					<div id="inernal_email_details" style="display:none;">
						<label for=""> SMTP Server(Host) :
							<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="SMTP Server Host Name" data-content="Enter SMTP Outgoing server host name here such as smtp.gmail.com" style="cursor:pointer;">
						</label>
						<input type="text" class="login-input-field smtp-host" placeholder="" value="" name="smtp_host">
						<label for=""> Port :
							<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="SMTP Port" data-content="SMTP Port to be used such as SSL Port 465 is recommended for smtp.gmail.com." style="cursor:pointer;">
						</label>
						<input type="text" class="login-input-field smtp-port" placeholder="" value="" name="smtp_port">
						<label for=""> Username :
							<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Username" data-content="Username for the SMTP account." style="cursor:pointer;">
						</label>
						<input type="text" class="login-input-field smtp-user" placeholder="" value="" name="smtp_user">
						<label for=""> Password :
							<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Password" data-content="Password for the SMTP account." style="cursor:pointer;">
						</label>
						<input type="password" class="login-input-field smtp-pass" placeholder="" value="" name="smtp_pass">
					</div>
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

			//console.log($("input[name='mail_service']:checked").val());
			change_mail_service();

			$('input[name="mail_service"]').on('change', function(){
				change_mail_service();
			});

			$('.signin-button').click(function(){

				var no_error = true;

				//revert all fields to have no red border
				$( ".login-input-field" ).css({'border': '1px solid #d7dbdc'});

				if( $('input[name="mail_service"]:checked').val() == 'mandrill' ){
					var mandrillKey = $("input[name='mandrill_key']").val();
					if(mandrillKey.trim() === ''){
						$( ".mandrill-key" ).css({'border': '1px solid red'});
						$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter your mandrill api key. </p> " );
						no_error = false;
					}
				}else{
					var smtpHost = $("input[name='smtp_host']").val();
					var smtpPort = $("input[name='smtp_port']").val();
					var smtpUser = $("input[name='smtp_user']").val();
					var smtpPass = $("input[name='smtp_pass']").val();

					if(smtpHost.trim() === ''){
						$( ".smtp-host" ).css({'border': '1px solid red'});
						$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter Smtp details. </p> " );
						no_error = false;
					}
					if(no_error && ( smtpPort.trim() === '') || isNaN( smtpPort.trim() ) ){
						$( ".smtp-port" ).css({'border': '1px solid red'});
						if(no_error){
							if(smtpPort.trim() === ''){
								$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter Smtp details. </p> " );
							}else if(isNaN( smtpPort.trim() )) {
								$( ".message" ).html( " <p style='color:red;text-align:center;'> SMTP port should be a number. </p> " );
							}
							no_error = false;
						}
					}
					if(no_error && smtpUser.trim() === ''){
						$( ".smtp-user" ).css({'border': '1px solid red'});
						if(no_error){
							$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter Smtp details. </p> " );
							no_error = false;
						}
					}
					if(no_error && smtpPass.trim() === ''){
						$( ".smtp-pass" ).css({'border': '1px solid red'});
						if(no_error){
							$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter Smtp details. </p> " );
							no_error = false;
						}
					}
				}

				if(no_error){
					$("#mandrillForm").submit();
				}else{
					$('html,body').animate({
				        scrollTop: $(".message").offset().top
				    },'fast');
					return false;
				}
			});
		});

		function change_mail_service(){
			console.log($('input[name="mail_service"]:checked').val());
			if( $('input[name="mail_service"]:checked').val() == 'mandrill' ){
				$('#mandrill_details').show();
				$('#inernal_email_details').hide();
			}else{
				$('#mandrill_details').hide();
				$('#inernal_email_details').show();
			}
		}

		$(function () {
  			$('[data-toggle="popover"]').popover()
		});

	</script>
<?php unset($_SESSION['msg']); ?>
</html>