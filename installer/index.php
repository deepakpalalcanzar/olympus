<?php 
	echo "a;;lasdl;as;ldas;ldas;ldaskl;asl;dk";
echo exec("lsb_release -i | cut -f2"); ?>
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
				<div class="login-box-head">Database Configuration File</div>
	<!-- form section -->
				<form id="databaseForm" method="post" action="post.php?action=database" class="login-box-body">
					<div class="message">
						<?php 	
							if(isset($_SESSION['msg'])){
								echo "<p style='color:red;text-align:center;'>". $_SESSION['msg'] ."</p>";
							}
						?>
					</div>

					<label for="protocal">
						Configure Protocol: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Server protocol" data-content="If you have SSL certificate ready to upload use https other wise use http" style="cursor:pointer;">
					</label>

					<div class="radio">
				  		<label>
							<input type="radio" name="protocal" value="443" style="padding-left:10px;padding-right:10px;"> HTTPS
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<input type="radio" name="protocal" value="80" style="padding-left:10px;padding-right:10px"> HTTP
					  	</label>
					</div>

					<label for="email">
						Application Server Hostname: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Application Server Hostname" data-content="IP address of hostname of the server hosting the Olympus application." style="cursor:pointer;">
					</label>
					<input type="text" class="login-input-field server-hostname" placeholder="Please enter your application server hostname" name="server_hostname">
					

					<label for="email">
						Application Server Domain Name: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Application Server Hostname" data-content="Domain name of hostname of the server hosting the Olympus application." style="cursor:pointer;">
					</label>
					<input type="text" class="login-input-field server-hostname" placeholder="Please enter your application server domain name" name="domain_hostname">


					<label for="database_name">
						Database Server Hostname: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Database Server Hostname" data-content="This is the hostname or IP address of the server hosting the database. It can be the same as the application server hostname or different if your database is running on a separate server." style="cursor:pointer;">
					</label>
					<input type="text" class="login-input-field database-name" placeholder="Please enter your database server hostname" name="database_hostname">
					
					<label for="database_hostname">
						Database Name: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Database Name" data-content="This is the name for the Olympus database. Use olympus  as default." style="cursor:pointer;">
					</label>
					<input type="text" class="login-input-field database-hostname" placeholder="Please enter your database name" name="database_name">
					
					<label for="username">
						Database Username: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Database Username" data-content="Username to create and access the application database." style="cursor:pointer;">
					</label>
					<input type="text" class="login-input-field username" placeholder="Please neter your username" name="username">

					<label for="username">
						Database Password: 
						<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Database Password" data-content="Password used to create and access the application database." style="cursor:pointer;">
					</label>
					<input type="password" class="login-input-field password" placeholder="Confirm Password" name="password">
					
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

				var serverHostname 	= $("input[name='server_hostname']").val();
				var databaseName  	= $("input[name='database_name']").val();
				var databaseHostname= $("input[name='database_hostname']").val();
				var username 		= $("input[name='username']").val();

				if(serverHostname.trim() === ''){

					$( ".server-hostname" ).css({'border': '1px solid red'});
					$( ".database-name" ).css({'border': '1px solid #d7dbdc'});
					$( ".database-hostname" ).css({'border': '1px solid #d7dbdc'});
					$( ".username" ).css({'border': '1px solid #d7dbdc'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});

					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter server hostname. </p> " );
					return false;					
				}

				if(databaseName.trim() === ''){

					$( ".server-hostname" ).css({'border': '1px solid #d7dbdc'});
					$( ".database-name" ).css({'border': '1px solid red'});
					$( ".database-hostname" ).css({'border': '1px solid #d7dbdc'});
					$( ".username" ).css({'border': '1px solid #d7dbdc'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});


					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter name of your database. </p> " );
					return false;					
				}

				if(databaseHostname.trim() === ''){

					$( ".server-hostname" ).css({'border': '1px solid #d7dbdc'});
					$( ".database-name" ).css({'border': '1px solid #d7dbdc'});
					$( ".database-hostname" ).css({'border': '1px solid red'});
					$( ".username" ).css({'border': '1px solid #d7dbdc'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});


					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter database hostname. </p> " );
					return false;					
				}

				if(username.trim() === ''){

					$( ".server-hostname" ).css({'border': '1px solid #d7dbdc'});
					$( ".database-name" ).css({'border': '1px solid #d7dbdc'});
					$( ".database-hostname" ).css({'border': '1px solid #d7dbdc'});
					$( ".username" ).css({'border': '1px solid red'});
					$( ".password" ).css({'border': '1px solid #d7dbdc'});


					$( ".message" ).html( " <p style='color:red;text-align:center;'> Please enter your database username </p> " );
					return false;					
				}
				$("#databaseForm").submit();
			});
		});
		
		$(function () {
  			$('[data-toggle="popover"]').popover()
		});

	</script>
<?php unset($_SESSION['msg']); ?>
</html>