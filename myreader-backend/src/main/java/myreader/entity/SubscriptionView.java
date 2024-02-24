package myreader.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;

@Table("SUBSCRIPTION_VIEW")
public record SubscriptionView (
  @Id Long id,
  String title,
  String url,
  String tag,
  String color,
  int acceptedFetchCount,
  String lastModified,
  int overallFetchCount,
  Integer resultSizePerFetch,
  long unseen,
  OffsetDateTime lastErrorMessageDatetime,
  OffsetDateTime createdAt
) {}

