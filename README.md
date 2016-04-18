Gerard Brown Technical Assessment
===========================


Notes
-----
This project was developed on CentOS7 and assumes an environment that allows for setting up a relevant virtual host.
Due to time constraints the code was tested only on CentOS 7 running php 5.4 against a MySQL 5.5 database with the
latest Chrome browser. If you have any trouble installing or running the code please contact me, I will be glad to
assist.


Installation
------------
1. Create a database for the project, assuming database name 'lotto';
    CREATE DATABASE `lotto` /*!40100 DEFAULT CHARACTER SET utf8 */;
2. Ensure that all composer vendor modules are installed and up to date.
   Run the following command in linux in the project root folder:
    php composer.phar update
3. Copy config/autoload/local.php.dist to config/autoload/local.php
   Configure config/autoload/local.php for correct database access.
4. Create database tables and populate initial data by running the following in project root:
    chmod u+x rebuild-db.sh
    ./rebuild-db.sh
5. Ensure that the rebuild script executed without errors.
6. Setup a virtual host for the project and restart the web server.
   An example apache vhost configuration is provided in deploy/vhost_exchange.conf
   Please ensure that specified folders is corrected in the vhost config before restarting the web server.


Configuration
-------------
1. Surcharge and Discount can be configured in the currency table per currency.
2. Configuration of email notifications can be done by editing config/data-action-notification.config.php
   The functionality allows for setting up email notifications based on data action triggers with specfied
   data populated in the email.

