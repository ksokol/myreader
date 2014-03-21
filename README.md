MyReader [![Build Status](https://api.travis-ci.org/ksokol/myreader.png?branch=master)](https://travis-ci.org/ksokol/myreader/) [![Coverage Status](https://coveralls.io/repos/ksokol/myreader/badge.png?branch=master)](https://coveralls.io/r/ksokol/myreader?branch=master)
=====

MyReader is a RSS reader written in Java. It provides a REST like API for clients like [MyReader Android](https://github.com/ksokol/myreader-android).
A web interface for mobile and desktop browsers can be found [here](https://github.com/ksokol/myreader-web)

Caution
--------
This RRS reader transitioned from Java to Python to PL/SQL to Java with plain servlets to Java with Spring Framework.
It is a sandbox for different technologies that are worth to play with. So don't expect a fully working software or even clean code.

**Prerequisite**

- Oracle JDK 6, OpenJDK 6 or newer
- Apache Maven 2.x or newer
- MySQL 5.1.x (tested on 5.1.17, should run on 5.x too)
- Servlet Container 2.5 or newer

**Build and package**

- run *mvn package*

**Installation**

***JDBC driver and JDNI resource***

- add `spring.profiles.active=myreader.prod` to your container's environment variables otherwise an in-memory transient database will be used
- put [MySQL JDBC Driver](https://dev.mysql.com/downloads/connector/j) into your servlet container's classpath
- add a JNDI resource named `jdbc/collector`:

<pre>
&lt;Resource name="jdbc/collector"
   auth="Container"
   type="javax.sql.DataSource"
   username="<username>"
   password="<password>"
   driverClassName="com.mysql.jdbc.Driver" <!-- only MySQL is supported -->
   url="jdbc:mysql://<host:port>/<dbname>"
   maxActive="8"
   maxIdle="4"
/&gt;
</pre>

- deploy war artefact into servlet container

***Memory leaks due to MySQL's 'Abandonded connection cleanup thread'***

This thread starts with the first request and holds a reference to the webapp's classloader. The least invasive workaround is to force initialisation of the MySQL JDBC driver from code outside of the webapp's classloader.
In `tomcat/conf/server.xml`, modify (inside the Server element):

<pre>
&lt;Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" /&gt;
</pre>
to
<pre>
&lt;Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" classesToInitialize="com.mysql.jdbc.NonRegisteringDriver" /&gt;
</pre>

**TODO**

- add initial admin user