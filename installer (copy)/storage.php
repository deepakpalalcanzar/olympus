<?php ?>
<?php  session_start(); ?>
<!DOCTYPE html>
<html>
	<?php include "header.php"; ?>
<body>

	<header>&nbsp;</header>
	<style>
	.error{
		border: 1px solid red !important;
	}
	</style>
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
				<div class="login-box-head"> Storage Adapter Configuration </div>
	<!-- form section -->
				<form id="databaseForm" method="post" action="post.php?action=storage" class="login-box-body">
					<div class="message">
						<?php 	
							if(isset($_SESSION['msg'])){
								echo "<p style='color:red;text-align:center;'>". $_SESSION['msg'] ."</p>";
							}
						?>
					</div>

					<div class="radio">
				  		<label>
					    	<input type="radio" name="storage" <?php echo (isset($_SESSION['storage']) && $_SESSION['storage'] == 'S3' ) ? 'checked="checked"' : ''; ?> value="S3"> Amazon S3
					  	</label>
					</div>
					
					<div class="radio">
						<label>
					    	<input type="radio" name="storage" <?php echo (isset($_SESSION['storage']) && $_SESSION['storage'] == 'swift' ) ? 'checked="checked"' : ''; ?> value="swift"> Swift
					  	</label>
					</div>

					<div class="radio disabled">
						<label>
					    	<input type="radio" name="storage" value="Disk"> Disk
					  	</label>
					</div>

					<div style="<?php echo (isset($_SESSION['storage']) && $_SESSION['storage'] == 'S3' ) ? '' : 'display:none'; ?>" id="s3Detail">

						<hr style="border:2px solid #CCC;">
						<div class="login-box-head">
							Amazon S3 Credentials
							<img src="img/help.png" tabindex="0" data-toggle="popover" data-html="true" data-trigger="hover" data-original-title="Amazon S3 Credentials" data-content="Please create the bucket and region in your amazon web services portal. After your bucket has been created enter the credentials here." style="cursor:pointer;">
						</div>
						<label for="email"> Access Key: </label>
						<input type="text" class="login-input-field server-hostname <?php echo $_SESSION['storage'] == 'S3' && ( !$_SESSION['selectedStorage']['api_key'] || trim( $_SESSION['selectedStorage']['api_key'] ) == '' )?'error':''; ?>" placeholder="Please enter your access key" name="api_key" value="<?php echo $_SESSION['storage'] == 'S3' && isset($_SESSION['selectedStorage']['api_key'])?$_SESSION['selectedStorage']['api_key']:''; ?>">
						
						<label for="database_name"> Access Secret Key: </label>
						<input type="text" class="login-input-field database-name <?php echo $_SESSION['storage'] == 'S3' && ( !$_SESSION['selectedStorage']['api_secret_key'] || trim( $_SESSION['selectedStorage']['api_secret_key'] ) == '' )?'error':''; ?>" placeholder="Please enter your access secret key" name="api_secret_key" value="<?php echo $_SESSION['storage'] == 'S3' && isset($_SESSION['selectedStorage']['api_secret_key'])?$_SESSION['selectedStorage']['api_secret_key']:''; ?>">
						
						<label for="database_hostname"> Bucket: </label>
						<input type="text" class="login-input-field database-hostname <?php echo $_SESSION['storage'] == 'S3' && ( !$_SESSION['selectedStorage']['bucket'] || trim( $_SESSION['selectedStorage']['bucket'] ) == '' )?'error':''; ?>" placeholder="Please enter your bucket name" name="bucket" value="<?php echo $_SESSION['storage'] == 'S3' && isset($_SESSION['selectedStorage']['bucket'])?$_SESSION['selectedStorage']['bucket']:''; ?>">
						
						<label for="username"> Region: </label>
						<input type="text" class="login-input-field username <?php echo $_SESSION['storage'] == 'S3' && ( !$_SESSION['selectedStorage']['region'] || trim( $_SESSION['selectedStorage']['region'] ) == '' )?'error':''; ?>" placeholder="Please neter your region name. (such as 'US_EAST_1' OR 'EU_WEST_1' OR 'AP_NORTHEAST_1' etc. )" name="region" value="<?php echo $_SESSION['storage'] == 'S3' && isset($_SESSION['selectedStorage']['region'])?$_SESSION['selectedStorage']['region']:''; ?>">

					</div>

					<div style="<?php echo (isset($_SESSION['storage']) && $_SESSION['storage'] == 'swift' ) ? '' : 'display:none'; ?>" id="swiftDetail">

						<hr style="border:2px solid #CCC;">
						<div class="login-box-head">Swift Credentials</div>
						<label for="email"> Swift Host: </label>
						<input type="text" class="login-input-field server-hostname <?php echo $_SESSION['storage'] == 'swift' && ( !$_SESSION['selectedStorage']['host'] || trim( $_SESSION['selectedStorage']['host'] ) == '' )?'error':''; ?>" placeholder="Please enter your login email" name="host" value="<?php echo isset($_SESSION['selectedStorage']['host'])?$_SESSION['selectedStorage']['host']:''; ?>">
						
						<label for="database_name"> Swift Port: </label>
						<input type="text" class="login-input-field database-name <?php echo $_SESSION['storage'] == 'swift' && ( !$_SESSION['selectedStorage']['post'] || trim( $_SESSION['selectedStorage']['port'] ) == '' )?'error':''; ?>" placeholder="Confirm email" name="port" value="<?php echo isset($_SESSION['selectedStorage']['port'])?$_SESSION['selectedStorage']['port']:''; ?>">
						
						<label for="database_hostname"> Swift Hash: </label>
						<input type="text" class="login-input-field database-hostname <?php echo $_SESSION['storage'] == 'swift' && ( !$_SESSION['selectedStorage']['serviceHash'] || trim( $_SESSION['selectedStorage']['serviceHash'] ) == '' )?'error':''; ?>" placeholder="Please enter your login password" name="serviceHash" value="<?php echo isset($_SESSION['selectedStorage']['serviceHash'])?$_SESSION['selectedStorage']['serviceHash']:''; ?>">
						
						<label for="username"> Swift Container: </label>
						<input type="text" class="login-input-field username <?php echo $_SESSION['storage'] == 'swift' && ( !$_SESSION['selectedStorage']['container'] || trim( $_SESSION['selectedStorage']['container'] ) == '' )?'error':''; ?>" placeholder="Please neter your username" name="container" value="<?php echo isset($_SESSION['selectedStorage']['container'])?$_SESSION['selectedStorage']['container']:''; ?>">
					</div>

					<div style="display:none" id="diskInfo">

						<hr style="border:2px solid #CCC;">
						<div class="login-box-head">Disk Path</div>
						<input type="file" id="fileURL" webkitdirectory directory multiple/>

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

			$(document).on('change', 'input[name="storage"]:radio', function(){
    			var selectedButton = $(this).val();
    			if(selectedButton === 'S3'){
    				document.getElementById('s3Detail').style.display = "block";
    				document.getElementById('swiftDetail').style.display = "none";
    			}

    			if(selectedButton === 'swift'){
    				document.getElementById('s3Detail').style.display = "none";
    				document.getElementById('swiftDetail').style.display = "block";
    			}

    			if(selectedButton === 'Disk'){
    				document.getElementById('s3Detail').style.display = "none";
    				document.getElementById('swiftDetail').style.display = "none";
    			}
			});


			$('.signin-button').click(function(){
				$("#databaseForm").submit();
			});

			$(function () {
				$('[data-toggle="popover"]').popover()
			});
		});

		(function(){
            var files, 
                file, 
                extension,
                input = document.getElementById("fileURL"); 
                // output = document.getElementById("fileOutput");
            
            input.addEventListener("change", function(e) {
            	// alert(e);
            	console.log(document.getElementById("fileURL").value);
            	console.log($('input[type=file]').path);
                // files = e.target.files;
                // output.innerHTML = "";
                
                // for (var i = 0, len = files.length; i < len; i++) {
                //     file = files[i];
                //     extension = file.name.split(".").pop();
                //     output.innerHTML += "<li class='type-" + extension + "'>" + file.name + "</li>";
                // }
            }, false);
		})();

	</script>
<?php unset($_SESSION['msg']); ?>
</html>