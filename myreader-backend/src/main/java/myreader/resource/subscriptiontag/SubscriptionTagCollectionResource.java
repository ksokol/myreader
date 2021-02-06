package myreader.resource.subscriptiontag;

import myreader.entity.SubscriptionTag;
import myreader.repository.SubscriptionTagRepository;
import myreader.resource.subscriptiontag.beans.SubscriptionTagGetResponse;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("api/2/subscriptionTags")
public class SubscriptionTagCollectionResource {

  private final SubscriptionTagRepository subscriptionTagRepository;
  private final RepresentationModelAssembler<SubscriptionTag, SubscriptionTagGetResponse> assembler;

  public SubscriptionTagCollectionResource(
    SubscriptionTagRepository subscriptionTagRepository,
    RepresentationModelAssembler<SubscriptionTag, SubscriptionTagGetResponse> assembler
  ) {
    this.subscriptionTagRepository = Objects.requireNonNull(subscriptionTagRepository, "subscriptionTagRepository is null");
    this.assembler = Objects.requireNonNull(assembler, "assembler is null");
  }

  @GetMapping
  public CollectionModel<SubscriptionTagGetResponse> get() {
    List<SubscriptionTag> source = subscriptionTagRepository.findAll();

    return assembler.toCollectionModel(source);
  }
}
