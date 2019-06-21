import createSubscriptionNavigation from './createSubscriptionNavigation'

describe('createSubscriptionNavigation', () => {

  it('should create subscription navigation from subscriptions', () => {
    const subscriptions = [
      {title: '1', uuid: '1', feedTag: {name: 't1'}, unseen: 2},
      {title: '2', uuid: '2', feedTag: {name: 't1'}, unseen: 3},
      {title: '3', uuid: '3', feedTag: {name: 't2'}, unseen: 1},
      {title: '4', uuid: '4', feedTag: {name: 't3'}, unseen: 5},
      {title: '5', uuid: '5', feedTag: {name: 't3'}, unseen: 0},
      {title: '6', uuid: '6', feedTag: {name: undefined}, unseen: 3},
      {title: '7', uuid: '7', feedTag: {name: undefined}, unseen: 4}
    ]

    expect(createSubscriptionNavigation(subscriptions)).toEqual(
      [
        {
          key: 'all',
          tag: null,
          title: 'all',
          unseen: 18,
          uuid: null
        },
        {
          key: 't1',
          tag: 't1',
          title: 't1',
          unseen: 5,
          uuid: null,
          subscriptions:
            [
              {
                feedTag: {name: 't1'},
                title: '1',
                unseen: 2,
                uuid: '1'
              },
              {
                feedTag: {name: 't1'},
                title: '2',
                unseen: 3,
                uuid: '2'
              }
            ]
        },
        {
          key: 't2',
          tag: 't2',
          title: 't2',
          unseen: 1,
          uuid: null,
          subscriptions:
            [
              {
                feedTag: {name: 't2'},
                title: '3',
                unseen: 1,
                uuid: '3'
              }
            ]
        },
        {
          key: 't3',
          tag: 't3',
          title: 't3',
          unseen: 5,
          uuid: null,
          subscriptions:
            [
              {
                feedTag: {name: 't3'},
                title: '4',
                unseen: 5,
                uuid: '4'
              },
              {
                feedTag: {name: 't3'},
                title: '5',
                unseen: 0,
                uuid: '5'
              }
            ]
        },
        {
          key: '6',
          tag: null,
          feedTag: {name: undefined},
          title: '6',
          unseen: 3,
          uuid: '6'
        },
        {
          key: '7',
          tag: null,
          feedTag: {name: undefined},
          title: '7',
          unseen: 4,
          uuid: '7'
        }
      ]
    )
  })

  it('should sort subscriptions in tag group by title', () => {
    const subscriptions = [
      {title: 'b', uuid: '1', feedTag: {name: 't1'}, unseen: 2},
      {title: 'a', uuid: '2', feedTag: {name: 't1'}, unseen: 3}
    ]

    expect(createSubscriptionNavigation(subscriptions)[1].subscriptions[0].title).toEqual('a')
    expect(createSubscriptionNavigation(subscriptions)[1].subscriptions[1].title).toEqual('b')
  })

  it('should sort subscriptions in tag group by title case insensitive', () => {
    const subscriptions = [
      {title: 'B', uuid: '1', feedTag: {name: 't1'}, unseen: 2},
      {title: 'a', uuid: '2', feedTag: {name: 't1'}, unseen: 3}
    ]

    expect(createSubscriptionNavigation(subscriptions)[1].subscriptions[0].title).toEqual('a')
    expect(createSubscriptionNavigation(subscriptions)[1].subscriptions[1].title).toEqual('B')
  })

  it('should sort tag group', () => {
    const subscriptions = [
      {title: '1', uuid: '1', feedTag: {name: 'b'}, unseen: 2},
      {title: '4', uuid: '4', feedTag: {name: 'a'}, unseen: 5}
    ]

    expect(createSubscriptionNavigation(subscriptions)[1].title).toEqual('a')
    expect(createSubscriptionNavigation(subscriptions)[2].title).toEqual('b')
  })

  it('should sort tag group case insensitive', () => {
    const subscriptions = [
      {title: '1', uuid: '1', feedTag: {name: 'B'}, unseen: 2},
      {title: '4', uuid: '4', feedTag: {name: 'a'}, unseen: 5}
    ]

    expect(createSubscriptionNavigation(subscriptions)[1].title).toEqual('a')
    expect(createSubscriptionNavigation(subscriptions)[2].title).toEqual('B')
  })

  it('should sort subscriptions', () => {
    const subscriptions = [
      {title: 'b', uuid: '6', feedTag: {name: undefined}, unseen: 3},
      {title: 'a', uuid: '7', feedTag: {name: undefined}, unseen: 4}
    ]

    expect(createSubscriptionNavigation(subscriptions)[1].title).toEqual('a')
    expect(createSubscriptionNavigation(subscriptions)[2].title).toEqual('b')
  })

  it('should sort subscriptions case insensitive', () => {
    const subscriptions = [
      {title: 'B', uuid: '6', feedTag: {name: undefined}, unseen: 3},
      {title: 'a', uuid: '7', feedTag: {name: undefined}, unseen: 4}
    ]

    expect(createSubscriptionNavigation(subscriptions)[1].title).toEqual('a')
    expect(createSubscriptionNavigation(subscriptions)[2].title).toEqual('B')
  })
})
