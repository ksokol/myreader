package myreader.hibernate;

import org.hibernate.type.descriptor.ValueBinder;
import org.hibernate.type.descriptor.ValueExtractor;
import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.JavaTypeDescriptor;
import org.hibernate.type.descriptor.sql.BasicBinder;
import org.hibernate.type.descriptor.sql.SqlTypeDescriptor;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

/**
 * @deprecated Remove me together with Hibernate
 */
@Deprecated(since = "0.26")
public class SetArraySqlTypeDescriptor implements SqlTypeDescriptor {

  private static final long serialVersionUID = 1L;

  @Override
  public int getSqlType() {
    return Types.ARRAY;
  }

  @Override
  public boolean canBeRemapped() {
    return true;
  }

  @Override
  public <X> ValueBinder<X> getBinder(final JavaTypeDescriptor<X> javaTypeDescriptor) {
    return new BasicBinder<>(javaTypeDescriptor, this) {
      @Override
      protected void doBind(PreparedStatement statement, X value, int index, WrapperOptions options) throws SQLException {
        var abstractArrayTypeDescriptor = (SetArrayTypeDescriptor) javaTypeDescriptor;
        var objects = abstractArrayTypeDescriptor.unwrap(value, Object[].class, options);
        statement.setArray(index, statement.getConnection().createArrayOf("varchar", objects));
      }

      @Override
      protected void doBind(CallableStatement st, X value, String name, WrapperOptions options) {
        throw new UnsupportedOperationException();
      }
    };
  }

  @Override
  public <X> ValueExtractor<X> getExtractor(final JavaTypeDescriptor<X> javaTypeDescriptor) {
    return new ValueExtractor<>() {
      @Override
      public X extract(ResultSet rs, String name, WrapperOptions options) throws SQLException {
        return javaTypeDescriptor.wrap(rs.getArray(name), options);
      }

      @Override
      public X extract(CallableStatement statement, int index, WrapperOptions options) {
        throw new UnsupportedOperationException();
      }

      @Override
      public X extract(CallableStatement statement, String[] paramNames, WrapperOptions options) {
        throw new UnsupportedOperationException();
      }
    };
  }
}
