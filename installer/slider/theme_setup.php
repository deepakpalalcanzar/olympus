<?php
//echo "a;;lasdl;as;ldas;ldas;ldaskl;asl;dk";
//echo exec("lsb_release -i | cut -f2");
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html>
    <?php include "header.php"; ?>
    <body style=" background: #383f4f;">

<!--        <div class="container center_div">
            <div class="col-lg-12">&nbsp;</div>
            <img src="img/installer.png" alt="Olympus Installer" class="img img-responsive"/>
            <div class="col-lg-12">&nbsp;</div>	
        </div>-->

        <div class="container" style="margin-left: 0px;">



            <div class="col-md-4" style="margin-left: -10px;">
                <div class="row" id='templatediv'>

                    <div class="template-template" >
<!--                        <div class="login-box-head">&nbsp;</div>-->
                        <link rel="stylesheet" type="text/css" media="all" href="./template_files/rigging.less.css"><link rel="stylesheet" type="text/css" media="all" href="./template_files/rigging.sass.css">

                        <script type="text/javascript" src="./template_files/async.dev.js"></script><script type="text/javascript" src="./template_files/mast.dev.js"></script><script type="text/javascript" src="./template_files/jquery.ui.widget.js"></script><script type="text/javascript" src="./template_files/jquery.postmessage-transport.js"></script><script type="text/javascript" src="./template_files/jquery.xdr-transport.js"></script><script type="text/javascript" src="./template_files/jquery.fileupload.js"></script><script type="text/javascript" src="./template_files/jquery.iframe-transport.js"></script><script type="text/javascript" src="./template_files/main.js"></script><script type="text/javascript" src="./template_files/AccountDetailsComponent.js"></script><script type="text/javascript" src="./template_files/AccountSettingsComponent.js"></script><script type="text/javascript" src="./template_files/ActivityComponent.js"></script><script type="text/javascript" src="./template_files/ActivityList.js"></script><script type="text/javascript" src="./template_files/AddAdminUserComponent.js"></script><script type="text/javascript" src="./template_files/AddEnterprisesComponent.js"></script><script type="text/javascript" src="./template_files/AddProfileComponents.js"></script><script type="text/javascript" src="./template_files/AddSubscriptionComponent.js"></script><script type="text/javascript" src="./template_files/AddUserComponent.js"></script><script type="text/javascript" src="./template_files/AdminUserComponent.js"></script><script type="text/javascript" src="./template_files/AdminUserDetailsComponent.js"></script><script type="text/javascript" src="./template_files/AdminUserDetailsPageComponent.js"></script><script type="text/javascript" src="./template_files/AdminUserPageComponent.js"></script><script type="text/javascript" src="./template_files/App.js"></script><script type="text/javascript" src="./template_files/BreadCrumbComponent.js"></script><script type="text/javascript" src="./template_files/ChangePasswordComponent.js"></script><script type="text/javascript" src="./template_files/CheckEmailComponent.js"></script><script type="text/javascript" src="./template_files/CreateNewPasswordComponent.js"></script><script type="text/javascript" src="./template_files/DetailsSidebarComponent.js"></script><script type="text/javascript" src="./template_files/DialogComponent.js"></script><script type="text/javascript" src="./template_files/DirectoryComponent.js"></script><script type="text/javascript" src="./template_files/DropdownComponent.js"></script><script type="text/javascript" src="./template_files/DropdownHelper.js"></script><script type="text/javascript" src="./template_files/EmailNotificationsComponent.js"></script><script type="text/javascript" src="./template_files/EnterpriseWorkgroupList.js"></script><script type="text/javascript" src="./template_files/Enterprises.js"></script><script type="text/javascript" src="./template_files/EnterprisesDetailsComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesPageComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesPagesMenuComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesSettingsComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesSidebarComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesUserList.js"></script><script type="text/javascript" src="./template_files/EnterprisesUsersComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesWorkgroupPagesMenuComponent.js"></script><script type="text/javascript" src="./template_files/EnterprisesWorkgroupsComponent.js"></script><script type="text/javascript" src="./template_files/FileComponent.js"></script><script type="text/javascript" src="./template_files/FileSystemComponent.js"></script><script type="text/javascript" src="./template_files/ForgotPasswordComponent.js"></script><script type="text/javascript" src="./template_files/INodeComponent.js"></script><script type="text/javascript" src="./template_files/ImageUploaderComponent.js"></script><script type="text/javascript" src="./template_files/ListUsersComponent.js"></script><script type="text/javascript" src="./template_files/ListUsersPageComponent.js"></script><script type="text/javascript" src="./template_files/LogComponent.js"></script><script type="text/javascript" src="./template_files/LogPageComponent.js"></script><script type="text/javascript" src="./template_files/LoginComponent.js"></script><script type="text/javascript" src="./template_files/ProfilePageComponent.js"></script><script type="text/javascript" src="./template_files/ProfilesComponent.js"></script><script type="text/javascript" src="./template_files/QuotasComponent.js"></script><script type="text/javascript" src="./template_files/ResetPasswordComponent.js"></script><script type="text/javascript" src="./template_files/SearchComponent.js"></script><script type="text/javascript" src="./template_files/SearchDialogComponent.js"></script><script type="text/javascript" src="./template_files/SearchList.js"></script><script type="text/javascript" src="./template_files/SearchdateComponent.js"></script><script type="text/javascript" src="./template_files/SearchdateList.js"></script><script type="text/javascript" src="./template_files/SettingPrivilagesComponent.js"></script><script type="text/javascript" src="./template_files/SettingsComponent.js"></script><script type="text/javascript" src="./template_files/SharingComponent.js"></script><script type="text/javascript" src="./template_files/SharingLinkComponent.js"></script><script type="text/javascript" src="./template_files/SubscriptionComponent.js"></script><script type="text/javascript" src="./template_files/SubscriptionNotificationsComponent.js"></script><script type="text/javascript" src="./template_files/SubscriptionPageComponent.js"></script><script type="text/javascript" src="./template_files/SuperAdminComponent.js"></script><script type="text/javascript" src="./template_files/TooltipGeneratorComponent.js"></script><script type="text/javascript" src="./template_files/UITableComponent.js"></script><script type="text/javascript" src="./template_files/UpdateEnterpriseComponent.js"></script><script type="text/javascript" src="./template_files/UpdateFile.js"></script><script type="text/javascript" src="./template_files/UpdateFileDialog.js"></script><script type="text/javascript" src="./template_files/UpdatePasswordComponent.js"></script><script type="text/javascript" src="./template_files/UpdateProfileComponent.js"></script><script type="text/javascript" src="./template_files/UpdateSubscriptionComponent.js"></script><script type="text/javascript" src="./template_files/UpgradeConfirmComponent.js"></script><script type="text/javascript" src="./template_files/UpgradeProceedComponent.js"></script><script type="text/javascript" src="./template_files/UpgradeSubscriptionComponent.js"></script><script type="text/javascript" src="./template_files/UpgradeSubscriptionFormComponent.js"></script><script type="text/javascript" src="./template_files/UpgradeSubscriptionPageComponent.js"></script><script type="text/javascript" src="./template_files/UploadFileDialogComponent.js"></script><script type="text/javascript" src="./template_files/UploadSearchComponent.js"></script><script type="text/javascript" src="./template_files/UploaderComponent.js"></script><script type="text/javascript" src="./template_files/UserDetailComponent.js"></script><script type="text/javascript" src="./template_files/UserDetailsComponent.js"></script><script type="text/javascript" src="./template_files/UserNavigationComponent.js"></script><script type="text/javascript" src="./template_files/UserSettingsComponent.js"></script><script type="text/javascript" src="./template_files/UserSidebarComponent.js"></script><script type="text/javascript" src="./template_files/UserWorkgroupListComponent.js"></script><script type="text/javascript" src="./template_files/UserWorkgroupsComponent.js"></script><script type="text/javascript" src="./template_files/UsersComponent.js"></script><script type="text/javascript" src="./template_files/UsersPageComponent.js"></script><script type="text/javascript" src="./template_files/VerifyApiAccessComponent.js"></script><script type="text/javascript" src="./template_files/VerifyComponent.js"></script><script type="text/javascript" src="./template_files/VersionComponent.js"></script><script type="text/javascript" src="./template_files/VersionList.js"></script><script type="text/javascript" src="./template_files/ViewerList.js"></script><script type="text/javascript" src="./template_files/enhance.js"></script><script type="text/javascript" src="./template_files/jquery-ui.min.js"></script><script type="text/javascript" src="./template_files/jquery.fileupload(1).js"></script><script type="text/javascript" src="./template_files/jquery.iframe-transport(1).js"></script><script type="text/javascript" src="./template_files/LoginMobile.js"></script><script type="text/javascript" src="./template_files/helpers.js"></script><script type="text/javascript" src="./template_files/ActionBarMobile.js"></script><script type="text/javascript" src="./template_files/AppMobile.js"></script><script type="text/javascript" src="./template_files/DirectoryMobile.js"></script><script type="text/javascript" src="./template_files/FinderPageMobile.js"></script><script type="text/javascript" src="./template_files/InodeMobile.js"></script><script type="text/javascript" src="./template_files/NavDropdownMobile.js"></script><script type="text/javascript" src="./template_files/NavMobile.js"></script><script type="text/javascript" src="./template_files/PageMobile.js"></script><script type="text/javascript" src="./template_files/TopbarMobile.js"></script><script type="text/javascript" src="./template_files/VeilMobile.js"></script><script type="text/javascript" src="./template_files/AccountAlertsMobile.js"></script><script type="text/javascript" src="./template_files/AccountPasswordMobile.js"></script><script type="text/javascript" src="./template_files/AccountProfileMobile.js"></script><script type="text/javascript" src="./template_files/AccountSettingsMobile.js"></script><script type="text/javascript" src="./template_files/AddCommentMobile.js"></script><script type="text/javascript" src="./template_files/AddPermissionMobile.js"></script><script type="text/javascript" src="./template_files/CurrentlyViewingMobile.js"></script><script type="text/javascript" src="./template_files/InodeActivityMobile.js"></script><script type="text/javascript" src="./template_files/InodeDetailsMobile.js"></script><script type="text/javascript" src="./template_files/InodeSharingMobile.js"></script><script type="text/javascript" src="./template_files/InodeSpecificsMobile.js"></script><script type="text/javascript" src="./template_files/Activities.js"></script><script type="text/javascript" src="./template_files/AdminUser.js"></script><script type="text/javascript" src="./template_files/BreadCrumb.js"></script><script type="text/javascript" src="./template_files/CurrentViewers.js"></script><script type="text/javascript" src="./template_files/DirectoryMembers.js"></script><script type="text/javascript" src="./template_files/DropdownButtons.js"></script><script type="text/javascript" src="./template_files/EnterpriseUserList.js"></script><script type="text/javascript" src="./template_files/EnterpriseWorkgroupList(1).js"></script><script type="text/javascript" src="./template_files/Enterprises(1).js"></script><script type="text/javascript" src="./template_files/INode.js"></script><script type="text/javascript" src="./template_files/SearchList(1).js"></script><script type="text/javascript" src="./template_files/SearchdateList(1).js"></script><script type="text/javascript" src="./template_files/SharingDetails.js"></script><script type="text/javascript" src="./template_files/Sidebar.js"></script><script type="text/javascript" src="./template_files/Subscription.js"></script><script type="text/javascript" src="./template_files/UploadFileDialog.js"></script><script type="text/javascript" src="./template_files/UserNavigation.js"></script><script type="text/javascript" src="./template_files/UserPage.js"></script><script type="text/javascript" src="./template_files/UserWorkgroup.js"></script><script type="text/javascript" src="./template_files/UserWorkgroupList.js"></script><script type="text/javascript" src="./template_files/Versions.js"></script><script type="text/javascript" src="./template_files/Workgroups.js"></script><script type="text/javascript" src="./template_files/tooltipGenerator.js"></script><script type="text/javascript" src="./template_files/account.js"></script><script type="text/javascript" src="./template_files/AdminUser(1).js"></script><script type="text/javascript" src="./template_files/Enterprises(2).js"></script><script type="text/javascript" src="./template_files/index.js"></script><script type="text/javascript" src="./template_files/listusers.js"></script><script type="text/javascript" src="./template_files/log.js"></script><script type="text/javascript" src="./template_files/profile.js"></script><script type="text/javascript" src="./template_files/search.js"></script><script type="text/javascript" src="./template_files/searchdate.js"></script><script type="text/javascript" src="./template_files/settings.js"></script><script type="text/javascript" src="./template_files/Subscription(1).js"></script><script type="text/javascript" src="./template_files/test.js"></script><script type="text/javascript" src="./template_files/users.js"></script><script type="text/javascript" src="./template_files/rigging.coffee.js"></script>
                        <script type="text/javascript" src="./template_files/moment.js"></script>
                        <script type="text/javascript" src="./template_files/fillout.js"></script>
                        <script type="text/javascript" src="./template_files/jquery.imagesloaded.min.js"></script>
                        <script type="text/javascript" src="./template_files/cropbox.js"></script>


                        <!-- Good ol' css -->
                        <link rel="stylesheet" type="text/css" media="all" href="./template_files/reset.css">
                        <link rel="stylesheet" type="text/css" media="all" href="./template_files/layout.css">
                        <link rel="stylesheet" type="text/css" media="all" href="./template_files/style.css">

                        <!-- Apple web capable -->
                        <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0">
                        <meta name="apple-mobile-web-app-capable" content="yes">

                        <!-- <meta content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" /> -->

                        <style>

                            #mydiv {  
                                position: fixed;
                                top: 0px;
                                left: 0px;
                                min-height: 100%;
                                min-width: 100%;
                                background-image: url("/images/loading.gif");
                                background-position:center center;
                                background-repeat:no-repeat;
                                background-color: grey;
                                z-index: 500 !important;
                                opacity: 0.8;
                                overflow: hidden;
                            }

                            .ajax-loader {
                                position: absolute;
                                left: 36%;
                                top: 50%;
                                margin-left: -32px; 
                                margin-top: -32px; 
                                display: block;     
                            }

                        </style>




                        <!-- main content -->
                        <div class="wrapper portal-only" >

                            <div id="Bodydiv">
                                <!-- top section with navigation and search -->
                                <div id="topbar">
                                    <div id="top-nav" class="clearfix">

                                        <!-- logo and main navigation -->
                                        <div id="main-nav">

                                            <a href="#" id="div_upload_thumb" class="logo-link"><img id='div_upload_thumbdiv_upload_thumb' class="main-logo" src="./template_files/Branding_12.png" alt="Olympus"></a>


                                            <ul class="clearfix" >

                                                <li>
                                                    <a href="#" title="overview" style="width: 110px;">
                                                        <img class="main-nav-imgs" src="./template_files/Top-Nav_OverviewIcon@2x.png">
                                                        <span class="main-nav-span">Overview</span>

                                                    </a>

                                                    <a href="#reports" title="reports" style="width: 110px;">
                                                        <img class="main-nav-imgs" src="./template_files/Top-Nav_ReportsIcon@2x.png">
                                                        <span class="main-nav-span">Add User</span>
                                                    </a>
                                                </li> 

                                                <li class="last-item">
                                                    <a href="#listusers" title="users" style="width:auto">
                                                        <div class="main-nav-div">
                                                            <img class="main-nav-imgs" src="./template_files/user_small.png">
                                                            <span class="main-nav-span">List Users</span>
                                                        </div>
                                                    </a>
                                                </li>



                                                <li class="last-item">
                                                    <a href="#log" title="View Log" style="width:auto">
                                                        <div class="main-nav-div">
                                                            
                                                            <img class="main-nav-imgs" src="./template_files/manage_admin_users_small.png">
                                                            <span class="main-nav-span">View Log</span>
                                                        </div>
                                                    </a>
                                                </li>

                                            </ul>
                                        </div>

                                        <!-- user navigaton outlet -->
                                        <div id="user-nav-outlet" class="user-nav-outlet">
                                            <div class="user-nav-template clearfix">
                                                <div class="name-container">       
                                                    <a class="user-name-link" href="#" title="User Profile">
                                                        <div>&nbsp;</div>
                                                        <span class="glyphicon glyphicon-user"> Admin </span>
                                                        <span class="glyphicon glyphicon-menu-down">  </span>
                                                        
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>


                                <div class="upload-search-template" id="NavigationBar">
                                    <div class="main-action-container clearfix">
                                        <div class="dir-folder-creation"></div>
                                        <!-- searchbar -->
                                        <!--                                        <div class="searchbar" >
                                                                                    <input type="text" placeholder="Search Users" name="search">
                                                                                    <input type="button" name="search-button" value="Search" class="search-users" style="width: 107px;border-radius: 0px;
                                                                                           color: #FFF;font-weight: 700;background:#357EBD;">
                                       </div>-->
                                    </div>
                                </div>

                                <br/> <br/> 
                                <div id="contentdiv">
                                    <div class="fileSystem-template mast-ui-table">

                                        <div id="fileSystem-outlet" class="clearfix"><div class="inode-template clearfix  ui-droppable">
                                                <div class="inode-row clearfix">
                                                    <div class="inode-left leftside mast-critical mast-column">
                                                        <div class="inode-content pushover" style="padding-left: 0px;">
                                                            <div class="inode-info-container clearfix">
                                                                <div class="expand-close-arrow directory "></div>
                                                                <div class=" directory-img   orphan "> <img class="main-nav-imgs" src="./template_files/Top-Nav_OverviewIcon@2x.png"></div>

                                                                <span class="inode-name">My Folder</span> 
                                                                <input class="inode-name-input" type="text" value="Alcanzar&#39;s Workgroup" placeholder="Name your new folder" autofocus="autofocus"> 					
                                                                <div class="dropdown-button" title="Click here to view options" style="display: none;"></div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="inode-middle mast-non-critical mast-column">
                                                        <div class="inode-content">
                                                            <div class="modified-info">
                                                                <span class="modified-date">2 hours ago</span>
                                                                <span class="file-size">798.12 KB</span>
                                                                <!-- <span class="modified-by"></span> -->
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="inode-right">
                                                        <div class="inode-content mast-non-critical mast-column">
                                                            <div class="information-stats">
                                                                <span class="num-comments" title="Comments">25</span>
                                                                <span class="num-users" title="Active people">5</span>
                                                                <span class="num-shared shared_peop" title="Shared people">1</span>
                                                                <!-- <div class="sidebar-button"></div> -->
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="inode-row clearfix">
                                                    <div class="inode-left leftside mast-critical mast-column">
                                                        <div class="inode-content pushover" style="padding-left: 0px;">
                                                            <div class="inode-info-container clearfix">
                                                                <div class="expand-close-arrow directory "></div>
                                                                <div class=" directory-img   orphan "> <img class="main-nav-imgs" src="./template_files/Top-Nav_OverviewIcon@2x.png"></div>

                                                                <span class="inode-name"> Workgroup</span> 
                                                                <input class="inode-name-input" type="text" value="Alcanzar&#39;s Workgroup" placeholder="Name your new folder" autofocus="autofocus"> 					
                                                                <div class="dropdown-button" title="Click here to view options" style="display: none;"></div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="inode-middle mast-non-critical mast-column">
                                                        <div class="inode-content">
                                                            <div class="modified-info">
                                                                <span class="modified-date">2 hours ago</span>
                                                                <span class="file-size">798.12 KB</span>
                                                                <!-- <span class="modified-by"></span> -->
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="inode-right">
                                                        <div class="inode-content mast-non-critical mast-column">
                                                            <div class="information-stats">
                                                                <span class="num-comments" title="Comments">85</span>
                                                                <span class="num-users" title="Active people">10</span>
                                                                <span class="num-shared shared_peop" title="Shared people">5</span>
                                                                <!-- <div class="sidebar-button"></div> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="padding-bottom: 358px;" ></div>
                                <div id="footerdiv"  class="portal-only clearfix">
                                    <div id="copyright-info">
                                        <img id="footer-logo" class="footer-logo-class" src="./template_files/Branding_12.png">
                                    </div>
                                    <ul id="terms-policies" class="clearfix">
                                        <li>Terms of Use     |</li>
                                        <li>Privacy Policy     |</li>
                                        <li class="last-item">Help</li>
                                    </ul>

                                    <br/>
                                    <br/>
                                    <br/>

                                </div>
                                <!-- footer -->

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <div class="container" style="margin-left: 0px;">
            <div class="col-md-1">




            </div>

            <div class="col-lg-12">&nbsp;</div>
            <div class="col-lg-12">&nbsp;</div>		


    </body>
    <?php // include "footer.php"; ?>



    <script>
        $(document).ready(function () {
            $('.themesetup-button').click(function () {
                $("#themesetup").submit();
            });
        });

        function SetAtagColor(ColorCode) {
            $('a').css('background-color', '#' + ColorCode);
            $('a').css('border', '#' + ColorCode);
        }

        function SetFontColor(FontColorCode) {

            $('a').css('color', '#' + FontColorCode);
            $('ul').css('color', '#' + FontColorCode);
            $('li').css('color', '#' + FontColorCode);
            $('span').css('color', '#' + FontColorCode);
        }

        function SetFontFamily(FontFamily) {
//                                        alert(FontFamily);
            $('a').css('font-family', FontFamily);
            $('ul').css('font-family', FontFamily);
            $('li').css('font-family', FontFamily);
            $('span').css('font-family', FontFamily);
        }

    </script>
    
</html>


<!--========================================================================================================================================================================-->


<link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700|Droid+Serif' rel='stylesheet' type='text/css'>

<!--<link rel="stylesheet" href="slider/reset.css">  CSS reset -->
<link rel="stylesheet" href="slider/style.css"> <!-- Resource style -->
<script src="slider/modernizr.js"></script>   


<main class="cd-main-content">

    <div href="#0" style="background-color: #383f4f;" class="cd-btn">Change Theme</div>
    <!-- your content here -->
</main>

<div class="cd-panel from-right">
    <header class="cd-panel-header">
        <h1 style="color: #383f4f;">Change Theme</h1>
        <div class="cd-panel-close">Close</div>
    </header>

    <div class="cd-panel-container" >
        <div class="cd-panel-content"  style="background-color: #383f4f;">

            <p>
            <div class="row">
                <div class="login-template">
                    <div class="login-box-head"><h1 style="color: #383f4f;">Change Logo</h1></div>

                    <link rel="stylesheet" type="text/css" href="logo_crop/css/imgareaselect-default.css" /> 
                    <!--<link rel="stylesheet" type="text/css" href="logo_crop/css/styles.css" />--> 
                    <script type="text/javascript" src="logo_crop/js/jquery.min.js"></script>
                    <script type="text/javascript" src="logo_crop/js/jquery.imgareaselect.min.js"></script>
                    <script type="text/javascript" src="logo_crop/js/custom.js"></script>
                    <div id="wrap">

                        <div id="uploader" style="background-color: #ffffff; color: #00000;">
                            <div id="content" style="">
                                <br/>
                                <div id="div_upload_big" style="margin-left: 140px;"><img style="height: 30px;width: 180px;" class="main-logo" src="./template_files/Branding_12.png" alt="Olympus"></div>

                                <hr/>
                                <div id="big_uploader">
                                    <form name="upload_big" id="upload_big"  method="post" enctype="multipart/form-data" action="logo_crop/upload.php?act=upload" target="upload_target">
                                        <div class="col-lg-5"><input name="photo" id="file" onchange="$('#upload_big').submit();"  size="27" type="file" /></div> 
                                        <div class="col-lg-4"><input type="hidden" name="height" value="100" size="5"/>
                                            <input type="hidden" name="width" value="175" size="5" />              
                                            <!--<input type="submit" name="action" value="Upload" /></div>-->
                                             </div>
                                    </form>
                               
                            </div>

                            <div id="uploaded">

                                <form name="upload_thumb" id="upload_thumb" method="post" action="logo_crop/upload.php?act=thumb" target="upload_target">
                                    <input type="submit" class="btn-default" onclick="SetFilePath();" value="Set Logo" />
                                    <input type="hidden" name="img_src" id="img_src" class="img_src" /> 
                                    <input type="hidden" name="height" value="0" id="height" class="height" />
                                    <input type="hidden" name="width" value="0" id="width" class="width" />

                                    <input type="hidden" id="y1" class="y1" name="y" />
                                    <input type="hidden" id="x1" class="x1" name="x" />
                                    <input type="hidden" id="y2" class="y2" name="y1" />
                                    <input type="hidden" id="x2" class="x2" name="x1" />                         

                                </form>
                                <br/>
                            </div>

                            <iframe id="upload_target" name="upload_target" src="" style=" display:none"></iframe>
                           
                        </div>
                    </div>
                </div>
                    <div class="login">&nbsp;</div>
            </div>
                
        </div>
        </p>
        <p>
        <div class="row" >
            <div class="login-template">
                <div class="login-box-head"><h1 style="color: #383f4f;">Change Theme</h1></div>
                <!-- form section -->
                <form id="themesetup"  style="background-color: #ffffff; color: #00000; font: 1px;" method="post" action="post.php?action=themesetup" class="login-box-body">
                    <div class="message">
                        <?php
                        if (isset($_SESSION['msg'])) {
                            echo "<p style='color:red;text-align:center;'>" . $_SESSION['msg'] . "</p>";
                        }
                        ?>
                    </div>

                    <script type="text/javascript" src="jscolor/jscolor.js"></script>

                    <div class="col-lg-6 Step" id="Step1" >
                        
                            Header Color: 

                        <input type="text" style="width: 140px;" class="login-input-field color {styleElement:'topbar'}" onchange="SetAtagColor(this.value);" value="FFFFFF" id='HeaderColorID' name="HeaderColor">

                                        <!--<input type="button" class="next-button" onclick="EventStep(2);" value="NEXT" src="img/next_btn.png"> -->

                    </div>

                    <div class="col-lg-6 Step" id="Step2">
                            Footer Color: 

                        <input type="text" style="width: 140px;" class="login-input-field color {styleElement:'footerdiv'}" value="FFFFFF" name="FooterColor">
                                        <!--<input type="button" class="next-button" onclick="EventStep(3);" value="NEXT" src="img/next_btn.png"> -->
                    </div>	

                    <div class="col-lg-6 Step" id="Step3" >
                            Body Color: 
                        <input type="text" style="width: 140px;" class="login-input-field color {styleElement:'Bodydiv'}" value="FFFFFF" name="BodyColor">
                                        <!--<input type="button" class="next-button" onclick="EventStep(4);" value="NEXT" src="img/next_btn.png"> -->
                    </div>	

                    <div class="col-lg-6 Step" id="Step4">
                            Navigation Bar Color: 
                        <input type="text" style="width: 140px;" class="login-input-field color {styleElement:'NavigationBar'}" value="004675" name="NavigationBarColor">
                                        <!--<input type="button" class="next-button" onclick="EventStep(5);" value="NEXT" src="img/next_btn.png"> -->
                    </div>
                    <div class="col-lg-6 Step" id="Step5" >
                            Font Color: 
                        <input type="text" style="width: 140px;" class="login-input-field color {styleElement:'FontColor'}"  onchange="SetFontColor(this.value);" value="7AD7FF" name="FontColor">
                        <input type="hidden"  id='logoimg' name="logoimg">

                                        <!--<input type="button" class="next-button" onclick="EventStep(6);" value="NEXT" src="img/next_btn.png"> -->
                    </div>

                    <div class="col-lg-6 Step" id="Step6">
                            Set Font Family : 
                        <br/>
                        <select style="width: 140px; height: 30px;" name="FontFamily" onchange="SetFontFamily(this.value);" class="login-input-field">
                            <option value=""> Select </option>
                            <option value="Georgia, serif"> Georgia, serif </option>
                            <option value="Palatino Linotype, Book Antiqua, Palatino, serif"> "Palatino Linotype", "Book Antiqua", Palatino, serif </option>
                            <option value="Times New Roman, Times, serif"> "Times New Roman", Times, serif </option>
                            <option value="Arial, Helvetica, sans-serif"> Arial, Helvetica, sans-serif </option>
                            <option value="Arial Black, Gadget, sans-serif"> "Arial Black", Gadget, sans-serif </option>
                            <option value="Comic Sans MS, cursive, sans-serif"> "Comic Sans MS", cursive, sans-serif </option>
                            <option value="Impact, Charcoal, sans-serif" selected > Impact, Charcoal, sans-serif </option>
                            <option value="Lucida Sans Unicode, Lucida Grande, sans-serif"> "Lucida Sans Unicode", "Lucida Grande", sans-serif </option>
                            <option value="Tahoma, Geneva, sans-serif"> Tahoma, Geneva, sans-serif </option>
                            <option value="Trebuchet MS, Helvetica, sans-serif"> "Trebuchet MS", Helvetica, sans-serif </option>
                            <option value="Courier New, Courier, monospace"> "Courier New", Courier, monospace </option>
                            <option value="Lucida Console , Monaco, monospace"> "Lucida Console", Monaco, monospace </option>

                        </select>


                    </div>
                    <div class="col-lg-1"  >

<!--<input type="image" class="signin-button" name="Submit" src="img/next_btn.png" >-->   


                    </div>

                    <div style="margin-top: 250px;">
                        <input type="image" class="signin-button" name="Submit" src="img/next_btn.png" >    
                    </div>
                    <!-- footer section -->
                </form>





                <div class="login">&nbsp;</div>
            </div>
        </div></p>



    </div> <!-- cd-panel-content -->
</div> <!-- cd-panel-container -->
</div> <!-- cd-panel -->
<script src="slider/jquery-2.1.1.js"></script>
<script>
      $.noConflict();
         jQuery(document).ready(function ($) {
        // Code that uses jQuery's $ can follow here.
    });
        // Code that uses other library's $ can follow here.
</script>
<script src="slider/main.js"></script> 


<?php unset($_SESSION['msg']); ?>


<!--========================================================================================================================================================================-->
