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

function sortByTitle(left, right) {
  const leftProperty = (left['title'] || '').toLocaleLowerCase()
  const rightProperty = (right['title'] || '').toLocaleLowerCase()

  if (leftProperty < rightProperty) {
    return -1
  }
  return leftProperty === rightProperty ? 0 : 1
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
  return subscriptions
    .filter(tagIsPresent)
    .reduce(sortIntoBucket, {})
}

function groupByTag(subscriptions) {
  return Object
    .values(createBucketsByTag(subscriptions))
    .sort(sortByTitle)
    .map(group => ({
      ...group,
      subscriptions: group.subscriptions.sort(sortByTitle)
    }))
}

function filterByTagIsAbsent(subscriptions) {
  return subscriptions
    .filter(tagIsAbsent)
    .map(addKeyToSubscription)
    .sort(sortByTitle)
}

export default function createSubscriptionNavigation(subscriptions) {
  return [
    createAllBucket(subscriptions),
    ...groupByTag(subscriptions),
    ...filterByTagIsAbsent(subscriptions)
  ]
}
