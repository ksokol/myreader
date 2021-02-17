package myreader.hibernate;

import org.hibernate.HibernateException;
import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.type.descriptor.java.AbstractTypeDescriptor;
import org.hibernate.type.descriptor.java.MutableMutabilityPlan;

import java.io.Serializable;
import java.sql.Array;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.TreeSet;

/**
 * @deprecated Remove me together with Hibernate
 */
@Deprecated(since = "0.26")
@SuppressWarnings("PMD.CompareObjectsWithEquals")
public class SetArrayTypeDescriptor extends AbstractTypeDescriptor<Object> {

  private static final long serialVersionUID = 1L;

  public SetArrayTypeDescriptor() {
    super(Object.class, new MutableMutabilityPlan<>() {
      @Override
      protected Object deepCopyNotNull(Object value) {
        if (value instanceof Collection) {
          return new TreeSet<>((Collection<?>) value);
        }
        throw new UnsupportedOperationException();
      }

      @Override
      public Object assemble(Serializable cached) {
        throw new UnsupportedOperationException();
      }
    });
  }

  @Override
  public Object[] unwrap(Object value, Class type, WrapperOptions options) {
    if (value instanceof Collection) {
      return ((Collection<?>) value).toArray();
    }
    throw new UnsupportedOperationException();
  }

  @Override
  public Object wrap(Object value, WrapperOptions options) {
    if (value instanceof Array) {
      var array = (Array) value;
      try {
        var objects = (Object[]) array.getArray();
        return new TreeSet<>(Arrays.asList(objects));
      } catch (SQLException exception) {
        throw new HibernateException(new IllegalArgumentException(exception));
      }
    }
    return value;
  }

  @Override
  public boolean areEqual(Object left, Object right) {
    if (left == right) {
      return true;
    }
    if (left == null || right == null) {
      return false;
    }
    if (left instanceof Collection && right instanceof Collection) {
      return Arrays.equals(((Collection<?>) left).toArray(), ((Collection<?>) right).toArray());
    }
    throw new UnsupportedOperationException();
  }

  @Override
  public String toString(Object value) {
    throw new UnsupportedOperationException();
  }

  @Override
  public Object fromString(String string) {
    throw new UnsupportedOperationException();
  }
}
