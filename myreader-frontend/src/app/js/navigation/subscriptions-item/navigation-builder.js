function countUnseen(subscriptions) {
    return subscriptions.reduce((sum, subscription) => sum + subscription.unseen, 0)
}

function createAllBucket(subscriptions) {
    const key = `__all__${new Date().getTime()}`
    const bucket = {}
    bucket[key] = {title: 'all', tag: null, uuid: null, unseen: countUnseen(subscriptions)}
    return bucket
}

const tagIsAbsent = subscription => !subscription.tag

const tagIsPresent = subscription => subscription.tag

const sortIntoBucket = (buckets, subscription) => {
    const bucket = buckets[subscription.tag] || {title: subscription.tag, tag: subscription.tag, uuid: null, unseen: 0, subscriptions: []}

    bucket.unseen += subscription.unseen
    bucket.subscriptions.push(subscription)
    buckets[subscription.tag] = bucket

    return buckets
}

function createBucketsByTag(subscriptions) {
    return subscriptions.filter(tagIsPresent).reduce(sortIntoBucket, {})
}

function groupByTag(subscriptions) {
    return {
        ...createAllBucket(subscriptions),
        ...createBucketsByTag(subscriptions)
    }
}

function filterByTagIsAbsent(subscriptions) {
    return subscriptions.filter(tagIsAbsent)
}

export function navigationBuilder(subscriptions) {
    return {
        subscriptionsGroupedByTag: groupByTag(subscriptions),
        subscriptionsWithoutTag: filterByTagIsAbsent(subscriptions)
    }
}
