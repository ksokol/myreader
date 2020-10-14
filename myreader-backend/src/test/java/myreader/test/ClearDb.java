package myreader.test;

import org.springframework.test.context.jdbc.Sql;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// TODO remove me together with test-data.sql
@Sql(statements = {
        "delete from user_feed_entry",
        "delete from exclusion_pattern",
        "delete from user_feed",
        "delete from user_feed_tag",
        "delete from entry",
        "delete from fetch_error",
        "delete from feed",
        "delete from user"
})
@Deprecated
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ClearDb {}
