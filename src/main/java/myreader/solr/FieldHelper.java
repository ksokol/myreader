package myreader.solr;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

/**
 * @author dev@sokol-web.de <Kamill Sokol>
 */
public class FieldHelper {

    private static DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.sss'Z'").withZoneUTC();
    private static final Wildcard wildcard = new Wildcard();

    public static Wildcard wildcard() {
        return wildcard;
    }

    public static String phrase(String value) {
        return String.format("\"%s\"", value);
    }

    public static String or(String op1, String op2) {
        return String.format("(%s OR %s)", op1, op2);
    }

    public static class Wildcard {
        public static final String VALUE = "*";
        private Wildcard() {}
    }

    public static Range1 range() {
        return new Range1();
    }

    public static class Range1 {
        private Range1() {}
        public Range2 on(String field) {
            return new Range2(field);
        }
    }

    public static class Range2 {
        private String field;

        private Range2() {}

        private Range2(String field) {
            this.field = field;
        }

        public Range3 from(Wildcard wildcard) {
            return new Range3(field, wildcard.VALUE);
        }

        public Range3 from(DateTime date) {
            DateTime offset = date.toDateTimeISO();
            System.out.println("offset "+ offset.toString(fmt));
            return new Range3(field, offset.toString(fmt));
        }
    }
    public static class Range3 {
        private String field;
        private String from;

        private Range3() {}

        private Range3(String field, String from) {
            this.field = field;
            this.from = from;
        }

        public String to(Wildcard wildcard) {
            return String.format("%s:[%s TO %s]", field, from, wildcard.VALUE);
        }

        public String to(DateTime to) {
            DateTime offset = to.toDateTimeISO();
            System.out.println("offset "+ offset.toString(fmt));
            return String.format("%s:[%s TO %s]", field, from, offset.toString(fmt));
        }
    }
}
