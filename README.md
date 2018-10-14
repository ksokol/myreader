MyReader [![Build Status](https://api.travis-ci.org/ksokol/myreader.png?branch=master)](https://travis-ci.org/ksokol/myreader/) [![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=MyReader%3AMyReader&metric=alert_status)](https://sonarcloud.io/dashboard/index/MyReader:MyReader)
========

MyReader is a web-based RSS reader.

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

Developer notes
---------------

- Execute `./gradlew devRun` to start the Spring Boot application on port 19340 and Webpack dev server on port 8080.
- Execute `./gradlew stop` or `./gradlew stopServer` to stop the Spring Boot application and Webpack dev server.
- All scheduled or fixed rate tasks inside the Spring Boot application are disabled by default. You can enable application tasks by using `./gradlew devRun -PwithAppTasks`.
