MyReader
========

MyReader is a single user web-based RSS reader.

Installation
------------

**Dependencies**

- Java 17 or higher

**Build and package**

- run `./mvnw package` or `./mvnw.cmd package` on Windows
- You will find a fat jar (Spring Boot application) in the folder **target**
- run `java -jar myreader-backend/target/myreader.jar`

Developer notes
---------------

- Execute `TASK_ENABLED=false ./mvnw spring-boot:run -pl myreader-backend` to start the Spring Boot application on port 19340.
- Execute `./mvnw deploy -Pstart -pl myreader-frontend` or `npm start` inside **myreader-frontend** to start Webpack dev server on port 8080.
- All scheduled or fixed rate tasks inside the Spring Boot application are disabled. Remove `TASK_ENABLED=false` from command to enable application tasks.
- Default password is set to `user`.
