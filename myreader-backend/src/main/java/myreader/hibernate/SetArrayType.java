package myreader.hibernate;

import org.hibernate.type.AbstractSingleColumnStandardBasicType;

/**
 * @deprecated Remove me together with Hibernate
 */
@Deprecated(since = "0.26")
public class SetArrayType extends AbstractSingleColumnStandardBasicType<Object> {

  private static final long serialVersionUID = 1L;

  public SetArrayType() {
    super(new SetArraySqlTypeDescriptor(), new SetArrayTypeDescriptor());
  }

  public String getName() {
    return "set-array";
  }
}
