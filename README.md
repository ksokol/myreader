MyReader
========

MyReader is a single user web-based RSS reader.

Installation
------------

**Dependencies**

- Java 17 or higher

**Build and package**

- run `./gradlew build` or `./gradlew.bat build` on Windows
- You will find a fat jar (Spring Boot application) in the folder `build`
- run `java -jar build/myreader.jar`

Developer notes
---------------

- Execute `./gradlew devRun` to start the Spring Boot application on port 19340 and Webpack dev server on port 8080.
- All scheduled or fixed rate tasks inside the Spring Boot application are disabled by default. You can enable application tasks by using `./gradlew devRun -PwithAppTasks`.
- Default password is set to `user`.
