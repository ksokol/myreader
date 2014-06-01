package myreader.service.search.converter;

import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;
import org.springframework.core.convert.converter.Converter;

import java.util.Date;

/**
 * @author Kamill Sokol
 *
 * Prevent using Solr's date field type.
 * Solr uses thread local for date formatting. These formatter aren't removed after undeployment causing a memory leak.
 */
public class DateConverter implements Converter<String, Date> {

	private static final DateTimeFormatter fmt = ISODateTimeFormat.dateTime();

	@Override
	public Date convert(String source) {
		return fmt.parseDateTime(source).toDate();
	}
}
