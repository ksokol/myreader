MyReader [![Build Status](https://api.travis-ci.org/ksokol/myreader.png?branch=master)](https://travis-ci.org/ksokol/myreader/) [![Coverage Status](https://coveralls.io/repos/ksokol/myreader/badge.png?branch=master)](https://coveralls.io/r/ksokol/myreader?branch=master)
=====

MyReader is a RSS reader written in Java. It provides a REST like API for clients like [MyReader Android](https://github.com/ksokol/myreader-android).
A web interface for mobile and desktop browsers can be found [here](https://github.com/ksokol/myreader-web)

Caution
--------
This RSS reader transitioned from Java to Python to PL/SQL to Java with plain servlets to Java with Spring Framework.
It is a sandbox for different technologies that are worth to play with. So don't expect a fully working software or even clean code.

Installation
------------

**Prerequisite**

- OpenJDK 7
- Apache Maven 3.x or newer
- MySQL 5.1.x (tested on 5.1.17, should run on 5.x too)

**Build and package**

- run `mvn package`
- You will find a fat jar (Spring Boot application) under `target` and a rpm under `target/rpm/myreader/RPMS/noarch/`
- run `java -jar myreader.jar` or install rpm


**TODO**

- add initial admin user