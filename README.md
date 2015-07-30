MyReader [![Build Status](https://api.travis-ci.org/ksokol/myreader.png?branch=master)](https://travis-ci.org/ksokol/myreader/) [![Coverage Status](https://coveralls.io/repos/ksokol/myreader/badge.png?branch=master)](https://coveralls.io/r/ksokol/myreader?branch=master)
========

MyReader is a RSS reader written in Java. It provides a REST like API for clients like [MyReader Android](https://github.com/ksokol/myreader-android).

Installation
------------

**Prerequisite**

- Java 8
- Apache Maven 3.x or newer
- MySQL 5.1.x (tested on 5.1.17, should run on 5.x too)

**Build and package**

- run `mvn package`
- You will find a fat jar (Spring Boot application) under `target`
- run `java -jar myreader.jar`


**TODO**

- add initial admin user
