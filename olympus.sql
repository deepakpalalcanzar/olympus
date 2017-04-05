-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 05, 2017 at 01:35 PM
-- Server version: 5.5.54
-- PHP Version: 5.3.10-1ubuntu3.26

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `olympus`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT NULL,
  `verificationCode` varchar(255) DEFAULT NULL,
  `avatar_fname` varchar(255) DEFAULT NULL,
  `avatar_mimetype` varchar(255) DEFAULT NULL,
  `enterprise_fsname` varchar(255) DEFAULT NULL,
  `enterprise_mimetype` varchar(255) DEFAULT NULL,
  `avatar_image` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `isLdapUser` tinyint(1) DEFAULT NULL,
  `isADUser` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleteDate` datetime DEFAULT NULL,
  `isLocked` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `shareId` int(11) DEFAULT NULL,
  `subscription_id` int(11) DEFAULT NULL,
  `is_enterprise` tinyint(1) DEFAULT NULL,
  `isSuperAdmin` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`email`, `password`, `name`, `phone`, `title`, `verified`, `verificationCode`, `avatar_fname`, `avatar_mimetype`, `enterprise_fsname`, `enterprise_mimetype`, `avatar_image`, `isAdmin`, `isLdapUser`, `isADUser`, `deleted`, `deleteDate`, `isLocked`, `created_by`, `shareId`, `subscription_id`, `is_enterprise`, `isSuperAdmin`, `id`, `createdAt`, `updatedAt`) VALUES
('superadmin@olympus.io', '$2a$10$IHWlgoJ5xrqGOeP4x.Gi9O68Qw2O1x/N5s.JYRV67TSEfzgYsf2Gi', 'Administrator', NULL, 'Administrator', 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, NULL, 0, NULL, NULL, NULL, 0, 1, 1, '2017-04-01 12:39:55', '2017-04-01 12:39:55');

-- --------------------------------------------------------

--
-- Table structure for table `accountdeveloper`
--

CREATE TABLE IF NOT EXISTS `accountdeveloper` (
  `api_key` varchar(255) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `code_expires` datetime DEFAULT NULL,
  `access_expires` datetime DEFAULT NULL,
  `refresh_expires` datetime DEFAULT NULL,
  `scope` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `accountdeveloper`
--

INSERT INTO `accountdeveloper` (`api_key`, `account_id`, `code`, `access_token`, `refresh_token`, `code_expires`, `access_expires`, `refresh_expires`, `scope`, `id`, `createdAt`, `updatedAt`) VALUES
('3y6gp1hz9de7cgvkn7xqjb3285p8udf2', 1, '', 'baudzVitCraHCB1', 'abcdefg', '2020-01-01 00:00:00', '2020-01-01 00:00:00', '2020-01-01 00:00:00', 3, 1, '2017-04-01 12:39:55', '2017-04-01 12:39:55');

-- --------------------------------------------------------

--
-- Table structure for table `accountrole`
--

CREATE TABLE IF NOT EXISTS `accountrole` (
  `AccountId` int(11) DEFAULT NULL,
  `RoleId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `accountshare`
--

CREATE TABLE IF NOT EXISTS `accountshare` (
  `AccountId` int(11) DEFAULT NULL,
  `ShareId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `adminuser`
--

CREATE TABLE IF NOT EXISTS `adminuser` (
  `user_id` int(11) DEFAULT NULL,
  `admin_profile_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE IF NOT EXISTS `comment` (
  `payload` varchar(255) DEFAULT NULL,
  `AccountId` int(11) DEFAULT NULL,
  `DirectoryId` int(11) DEFAULT NULL,
  `FileId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `deletedlist`
--

CREATE TABLE IF NOT EXISTS `deletedlist` (
  `type` int(11) DEFAULT NULL,
  `deleted_id` int(11) DEFAULT NULL,
  `sync_time` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `directory_id` int(11) DEFAULT NULL,
  `permission` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `developer`
--

CREATE TABLE IF NOT EXISTS `developer` (
  `api_key` varchar(255) DEFAULT NULL,
  `api_secret` varchar(255) DEFAULT NULL,
  `app_name` varchar(255) DEFAULT NULL,
  `redirect_url` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `developer`
--

INSERT INTO `developer` (`api_key`, `api_secret`, `app_name`, `redirect_url`, `id`, `createdAt`, `updatedAt`) VALUES
('3y6gp1hz9de7cgvkn7xqjb3285p8udf2', 'ctDv8bIUmdJtChHP357xJ1ZspKh32rwq', 'Test API App', 'http://www.pigandcow.com/olympus_test_api_app', 1, '2017-04-01 12:39:55', '2017-04-01 12:39:55');

-- --------------------------------------------------------

--
-- Table structure for table `directory`
--

CREATE TABLE IF NOT EXISTS `directory` (
  `name` varchar(255) DEFAULT NULL,
  `size` text,
  `quota` text,
  `public_link_enabled` tinyint(1) DEFAULT NULL,
  `public_sublinks_enabled` tinyint(1) DEFAULT NULL,
  `isWorkgroup` tinyint(1) DEFAULT NULL,
  `isLocked` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleteDate` datetime DEFAULT NULL,
  `DirectoryId` int(11) DEFAULT NULL,
  `OwnerId` int(11) DEFAULT NULL,
  `isDriveDir` tinyint(1) DEFAULT NULL,
  `isOlympusDriveDir` tinyint(1) DEFAULT NULL,
  `isDropboxDir` tinyint(1) DEFAULT NULL,
  `isOlympusDropboxDir` tinyint(1) DEFAULT NULL,
  `isBoxDir` tinyint(1) DEFAULT NULL,
  `isOlympusBoxDir` tinyint(1) DEFAULT NULL,
  `driveFsName` text,
  `uploadPathId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `directorypermission`
--

CREATE TABLE IF NOT EXISTS `directorypermission` (
  `type` varchar(255) DEFAULT NULL,
  `orphan` tinyint(1) DEFAULT NULL,
  `AccountId` int(11) DEFAULT NULL,
  `DirectoryId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `enterprises`
--

CREATE TABLE IF NOT EXISTS `enterprises` (
  `is_impersonate` tinyint(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE IF NOT EXISTS `file` (
  `name` varchar(255) DEFAULT NULL,
  `size` text,
  `fsName` text,
  `md5checksum` text,
  `deleted` tinyint(1) DEFAULT NULL,
  `deleteDate` datetime DEFAULT NULL,
  `isLocked` tinyint(1) DEFAULT NULL,
  `mimetype` varchar(255) DEFAULT NULL,
  `public_link_enabled` tinyint(1) DEFAULT NULL,
  `link_password_enabled` tinyint(1) DEFAULT NULL,
  `link_password` varchar(255) DEFAULT NULL,
  `replaceFileId` int(11) DEFAULT NULL,
  `isOnDrive` tinyint(1) DEFAULT NULL,
  `isOnDropbox` tinyint(1) DEFAULT NULL,
  `isOnBox` tinyint(1) DEFAULT NULL,
  `DirectoryId` int(11) DEFAULT NULL,
  `thumbnail` int(11) DEFAULT NULL,
  `uploadPathId` int(11) DEFAULT NULL,
  `viewLink` varchar(255) DEFAULT NULL,
  `downloadLink` varchar(255) DEFAULT NULL,
  `iconLink` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `filedownloadlink`
--

CREATE TABLE IF NOT EXISTS `filedownloadlink` (
  `file_id` int(11) DEFAULT NULL,
  `link_key` varchar(255) DEFAULT NULL,
  `key_expires` datetime DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `filepermission`
--

CREATE TABLE IF NOT EXISTS `filepermission` (
  `type` varchar(255) DEFAULT NULL,
  `orphan` tinyint(1) DEFAULT NULL,
  `AccountId` int(11) DEFAULT NULL,
  `FileId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `logging`
--

CREATE TABLE IF NOT EXISTS `logging` (
  `user_id` int(11) DEFAULT NULL,
  `text_message` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `on_user` int(11) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE IF NOT EXISTS `organization` (
  `avatar_fname` varchar(255) DEFAULT NULL,
  `avatar_mime_type` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE IF NOT EXISTS `profile` (
  `name` varchar(255) DEFAULT NULL,
  `user_managment` tinyint(1) DEFAULT NULL,
  `subscription_managment` tinyint(1) DEFAULT NULL,
  `enterprises_managment` tinyint(1) DEFAULT NULL,
  `user_workgroup_mangment` tinyint(1) DEFAULT NULL,
  `enterprises_workgroup_managment` tinyint(1) DEFAULT NULL,
  `manage_admins` tinyint(1) DEFAULT NULL,
  `superadmins` tinyint(1) DEFAULT NULL,
  `manage_admin_user` tinyint(1) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `name` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `share`
--

CREATE TABLE IF NOT EXISTS `share` (
  `name` varchar(255) DEFAULT NULL,
  `DirectoryId` int(11) DEFAULT NULL,
  `FileId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sitesettings`
--

CREATE TABLE IF NOT EXISTS `sitesettings` (
  `ldapOn` int(11) DEFAULT NULL,
  `ServiceType` int(11) DEFAULT NULL,
  `ldapServerIp` varchar(255) DEFAULT NULL,
  `ldapOU` varchar(255) DEFAULT NULL,
  `ldapBaseDN` varchar(255) DEFAULT NULL,
  `ldapAdmin` varchar(255) DEFAULT NULL,
  `ldapPassword` varchar(255) DEFAULT NULL,
  `ldapCreateUser` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE IF NOT EXISTS `subscription` (
  `features` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `users_limit` varchar(255) DEFAULT NULL,
  `quota` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`features`, `price`, `duration`, `users_limit`, `quota`, `is_default`, `is_active`, `id`, `createdAt`, `updatedAt`) VALUES
('Default Plan', '0', '1200', '5', '100000000000', 1, 1, 1, '2017-04-01 12:39:55', '2017-04-01 12:39:55');

-- --------------------------------------------------------

--
-- Table structure for table `syncbox`
--

CREATE TABLE IF NOT EXISTS `syncbox` (
  `account_id` int(11) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `access_token_2` varchar(255) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `bxaccount_id` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `syncdbox`
--

CREATE TABLE IF NOT EXISTS `syncdbox` (
  `account_id` int(11) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `dbxaccount_id` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tempaccount`
--

CREATE TABLE IF NOT EXISTS `tempaccount` (
  `email` varchar(255) DEFAULT NULL,
  `enterprise_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `is_enterprise` tinyint(1) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `theme`
--

CREATE TABLE IF NOT EXISTS `theme` (
  `account_id` varchar(255) DEFAULT NULL,
  `header_background` varchar(255) DEFAULT NULL,
  `navigation_color` varchar(255) DEFAULT NULL,
  `body_background` varchar(255) DEFAULT NULL,
  `footer_background` varchar(255) DEFAULT NULL,
  `font_color` varchar(255) DEFAULT NULL,
  `font_family` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `transactiondetails`
--

CREATE TABLE IF NOT EXISTS `transactiondetails` (
  `transaction_id` varchar(255) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `users_limit` varchar(255) DEFAULT NULL,
  `quota` varchar(255) DEFAULT NULL,
  `paypal_status` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `uploadpaths`
--

CREATE TABLE IF NOT EXISTS `uploadpaths` (
  `type` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `accessKeyId` varchar(255) DEFAULT NULL,
  `secretAccessKey` varchar(255) DEFAULT NULL,
  `bucket` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `isActive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `uploadpaths`
--

INSERT INTO `uploadpaths` (`type`, `path`, `accessKeyId`, `secretAccessKey`, `bucket`, `region`, `id`, `createdAt`, `updatedAt`, `isActive`) VALUES
('Disk', '/var/www/html/olympus/api/files/', NULL, NULL, NULL, NULL, 1, '2017-04-01 18:07:29', '2017-04-01 18:07:29', 1);

-- --------------------------------------------------------

--
-- Table structure for table `version`
--

CREATE TABLE IF NOT EXISTS `version` (
  `FileId` int(11) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `AccountId` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
