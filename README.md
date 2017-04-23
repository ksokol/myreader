MyReader [![Build Status](https://api.travis-ci.org/ksokol/myreader.png?branch=master)](https://travis-ci.org/ksokol/myreader/) [![Quality Gate](https://sonarqube.com/api/badges/gate?key=MyReader:MyReader)](https://sonarqube.com/dashboard/index/MyReader:MyReader) [![Technical debt ratio](https://sonarqube.com/api/badges/measure?key=MyReader:MyReader&metric=sqale_debt_ratio)](https://sonarqube.com/dashboard/index/MyReader:MyReader) 
========

MyReader is a RSS reader written in Java. It provides a REST like API for clients like [MyReader Android](https://github.com/ksokol/myreader-android).

Installation
------------

**Prerequisite**

- Java 8

**Build and package**

- run `gradlew build`
- You will find a fat jar (Spring Boot application) under `build/libs`
- run `java -jar build/libs/myreader.jar`


**TODO**

- add initial admin user
