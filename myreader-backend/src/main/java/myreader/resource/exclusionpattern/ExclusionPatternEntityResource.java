package myreader.resource.exclusionpattern;

import myreader.repository.ExclusionRepository;
import myreader.security.AuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static myreader.resource.ResourceConstants.EXCLUSIONS_SUBSCRIPTION_PATTERN;

@RestController
public class ExclusionPatternEntityResource {

  private final ExclusionRepository exclusionRepository;

  public ExclusionPatternEntityResource(ExclusionRepository exclusionRepository) {
    this.exclusionRepository = exclusionRepository;
  }

  @DeleteMapping(EXCLUSIONS_SUBSCRIPTION_PATTERN)
  public void delete(
    @PathVariable("patternId") Long patternId,
    @PathVariable("subscriptionId") Long subscriptionId,
    @AuthenticationPrincipal AuthenticatedUser authenticatedUser
  ) {
    var pattern = exclusionRepository
      .findByIdAndSubscriptionIdAndCurrentUser(patternId, subscriptionId, authenticatedUser.getId())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    exclusionRepository.deleteById(pattern.getId());
  }
}
