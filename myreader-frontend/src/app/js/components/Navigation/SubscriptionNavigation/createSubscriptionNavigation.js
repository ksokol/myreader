function countUnseen(subscriptions) {
  return subscriptions.reduce((sum, subscription) => sum + subscription.unseen, 0)
}

function createAllBucket(subscriptions) {
  return {
    key: 'all',
    title: 'all',
    tag: null,
    uuid: null,
    unseen: countUnseen(subscriptions)
  }
}

function sortIntoBucket(buckets, subscription) {
  const tag = subscription.feedTag.name
  const bucket = buckets[tag] || {
    key: tag,
    title: tag,
    tag,
    uuid: null,
    unseen: 0,
    subscriptions: []
  }

  bucket.unseen += subscription.unseen
  bucket.subscriptions.push(subscription)
  buckets[tag] = bucket

  return buckets
}

function addKeyToSubscription(subscription) {
  return {
    key: subscription.uuid,
    tag: null,
    ...subscription
  }
}

function tagIsAbsent(subscription) {
  return !subscription.feedTag.name
}

function tagIsPresent(subscription) {
  return subscription.feedTag.name
}

function createBucketsByTag(subscriptions) {
  return subscriptions.filter(tagIsPresent).reduce(sortIntoBucket, {})
}

function groupByTag(subscriptions) {
  return Object.values(createBucketsByTag(subscriptions))
}

function filterByTagIsAbsent(subscriptions) {
  return subscriptions.filter(tagIsAbsent).map(addKeyToSubscription)
}

function createSubscriptionNavigation(subscriptions) {
  return [
    createAllBucket(subscriptions),
    ...groupByTag(subscriptions),
    ...filterByTagIsAbsent(subscriptions)
  ]
}

export default createSubscriptionNavigation
