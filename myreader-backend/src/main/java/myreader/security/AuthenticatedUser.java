package myreader.security;

import myreader.entity.User;

import java.util.Collections;
import java.util.Objects;

public class AuthenticatedUser extends org.springframework.security.core.userdetails.User {

  private static final long serialVersionUID = 1L;

  private final long id;

  public AuthenticatedUser(User user) {
    super(user.getEmail(), user.getPassword(), true /* enabled */, true, true, true, Collections.emptyList());
    id = user.getId();
  }

  public long getId() {
    return id;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    }
    if (!(other instanceof AuthenticatedUser)) {
      return false;
    }

    AuthenticatedUser that = (AuthenticatedUser) other;
    return super.equals(other) && id == that.id;
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), id);
  }
}
