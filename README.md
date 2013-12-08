MyReader [![Build Status](https://api.travis-ci.org/ksokol/myreader.png?branch=master)](https://travis-ci.org/ksokol/myreader/) [![Coverage Status](https://coveralls.io/repos/ksokol/myreader/badge.png?branch=master)](https://coveralls.io/r/ksokol/myreader?branch=master)
=====

MyReader is a rss reader written in Java. It comes with a web interface for mobile and desktop browsers via
[MyReader Web](https://github.com/ksokol/myreader-web)  Additionally,
a REST like API allows to write custom clients like [MyReader Android](https://github.com/ksokol/myreader-android).

Initially, MyReader was written with Google Reader in mind.

Caution!
--------
This rss reader transitioned from Java to Python to PL/SQL to Java with plain servlets to Java with Spring Framework.
This project is a sandbox for many different technologies to try out.
So don't expect a fully working software or even clean code!


**Build and package**<br />

- run *mvn package*

**Installation & Requirements**<br />

- Servlet container minimum version 2.5
- DataSource *jdbc/collector* as JNDI resource:

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