package myreader.service.search;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.List;

/**
 * @author dev@sokol-web.de
 */
@Deprecated
class FieldHelper {

    private static final DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ss.sss'Z'").withZoneUTC();
    private static final Wildcard wildcard = new Wildcard();

	@Deprecated
    public static Wildcard wildcard() {
        return wildcard;
    }

	@Deprecated
    public static String phrase(String value) {
        return String.format("\"%s\"", value);
    }

	@Deprecated
    public static String or(String op1, String op2) {
        return String.format("(%s OR %s)", op1, op2);
    }

	@Deprecated
    public static String or(List<? extends Object> ops) {
        if(ops == null || ops.isEmpty()) {
            return "\"\"";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("(");

        for(int i=0;i< ops.size();i++) {
            Object o = ops.get(i);
            sb.append(o);

            if(i < ops.size() - 1) {
                sb.append(" OR ");
            }
        }

        sb.append(")");
        return sb.toString();
    }

	@Deprecated
    public static class Wildcard {
        public static final String VALUE = "*";
        private Wildcard() {}
    }

	@Deprecated
    public static Range1 range() {
        return new Range1();
    }

	@Deprecated
    public static class Range1 {
        private Range1() {}
        public Range2 on(String field) {
            return new Range2(field);
        }
    }

	@Deprecated
    public static class Range2 {
        private String field;

        private Range2() {}

		@Deprecated
        private Range2(String field) {
            this.field = field;
        }

		@Deprecated
        public Range3 from(Wildcard wildcard) {
            return new Range3(field, wildcard.VALUE);
        }

		@Deprecated
        public Range3 from(DateTime date) {
            DateTime offset = date.toDateTimeISO();
            return new Range3(field, offset.toString(fmt));
        }

		@Deprecated
        public Range3 from(Object o) {
            return new Range3(field, o.toString());
        }
    }

	@Deprecated
    public static class Range3 {
        private String field;
        private String from;

		@Deprecated
        private Range3() {}

		@Deprecated
        private Range3(String field, String from) {
            this.field = field;
            this.from = from;
        }

		@Deprecated
        public String to(Wildcard wildcard) {
            return String.format("%s:[%s TO %s]", field, from, wildcard.VALUE);
        }

		@Deprecated
        public String to(DateTime to) {
            DateTime offset = to.toDateTimeISO();
            return String.format("%s:[%s TO %s]", field, from, offset.toString(fmt));
        }

		@Deprecated
        public String to(Object to) {
            return String.format("%s:[%s TO %s]", field, from, to);
        }
    }
}
