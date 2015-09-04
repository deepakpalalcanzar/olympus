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
				<div class="login-box-head"> Login Credentials </div>
	<!-- form section -->
				<form id="databaseForm" method="post" action="post.php?action=database" class="login-box-body">
					<table>
						<tr>
							<th>  Email </th>
							<td>&nbsp;</td>
							<td><?php echo $_SESSION['login_email']; ?></td>
						</tr>

						<tr>
							<th>&nbsp;</th>
							<td>&nbsp;</td>
						</tr>
						
						<tr>
							<th>  Password </th>
							<td>&nbsp;</td>
							<td> <?php echo $_SESSION['login_password']; ?> </td>
						</tr>

						<tr>
							<th>&nbsp;</th>
							<td>&nbsp;</td>
						</tr>

						<tr>
							
							<th>  URL </th>
							<td>&nbsp;</td>
							<td> 
								<a href='<?php echo "https://".$_SESSION['serverName'] ?>' target="_blank"> <?php echo "https://".$_SESSION['serverName'] ?> </a>  
							</td>

						</tr>
					</table>
				</form>
	<!-- footer section -->
				<!-- <div class="login-box-footer clearfix">
					<a href='<?php //echo "https://".$_SESSION['serverName']."/post.php?action=launch" ?>' class="signinbutton">
						Jump to olympus 
					</a>
				</div> -->
			</div>
	  	</div>
	</div>

	<div class="col-lg-12">&nbsp;</div>
	<div class="col-lg-12">&nbsp;</div>		


</body>
	<?php include "footer.php"; ?>
	<?php unset($_SESSION['msg']); ?>
</html>