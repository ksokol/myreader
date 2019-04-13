import React from 'react'
import {mount, shallow} from 'enzyme'
import SubscriptionEditPage from './SubscriptionEditPage'

describe('SubscriptionEditPage', () => {

  let state, dispatch, props

  const createWrapper = () => mount(<SubscriptionEditPage {...props} state={state} dispatch={dispatch} />)

  beforeEach(() => {
    dispatch = jest.fn().mockImplementation(action => {
      if (typeof action === 'function') {
        action(dispatch, () => state)
      }
    })

    state = {
      router: {
        query: {
          uuid: '1'
        }
      },
      subscription: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'name 1'}, createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'validation message'}]
        },
        subscriptions: [
          {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'name 1'}, createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', origin: 'origin2', feedTag: {uuid: '3', name: 'name 2'}, createdAt: '2017-11-30'}
        ],
        exclusions: {
          '1': [{uuid: '10', pattern: 'exclusion1', hitCount: 1}, {uuid: '11', pattern: 'exclusion2', hitCount: 2}],
          '2': [{uuid: '13', pattern: 'exclusion3', hitCount: 2}],
        }
      }
    }

    props = {
      match: {
        params: {
          uuid: '1'
        }
      }
    }
  })

  it('should not render component when prop "data" is undefined', () => {
    state.subscription.editForm.data = undefined

    expect(createWrapper().find('form').exists()).toEqual(false)
  })

  it('should render component when prop "data" is defined', () => {
    expect(createWrapper().find('form').exists()).toEqual(true)
  })

  it('should pass expected props to title input component', () => {
    expect(createWrapper().find('form > [name="title"]').props()).toEqual(expect.objectContaining({
      value: 'title1',
      name: 'title',
      label: 'Title',
      disabled: true,
      validations: [{field: 'title', message: 'validation message'}]
    }))
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CHANGE_DATA when title input changed', () => {
    createWrapper().find('form > [name="title"]').props().onChange({target: {value: 'changed title'}})

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {
        uuid: '1',
        title: 'changed title',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2', name: 'name 1'
        }
      }
    })
  })

  it('should pass expected props to origin input component', () => {
    expect(createWrapper().find('Input[name="origin"]').props()).toEqual(expect.objectContaining({
      value: 'origin1',
      label: 'Url',
      disabled: true
    }))
  })

  it('should pass expected props to tag input component', () => {
    expect(createWrapper().find('form > [name="tag"]').props()).toEqual(expect.objectContaining({
      value: 'name 1',
      label: 'Tag',
      disabled: true,
      values: ['name 1', 'name 2']
    }))
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CHANGE_DATA when tag selected', () => {
    createWrapper().find('form > [name="tag"]').props().onSelect('changed name')

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {
        uuid: '1',
        title: 'title1',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2',
          name: 'changed name'
        }
      }
    })
  })

  it('should pass expected props to chips component', () => {
    expect(createWrapper().find('Chips').props()).toContainObject({
      disabled: true,
      values: [
        {uuid: '10', pattern: 'exclusion1', hitCount: 1},
        {uuid: '11', pattern: 'exclusion2', hitCount: 2}
      ],
    })
  })

  it('should return expected chip item key', () => {
    expect(createWrapper().find('Chips').props().keyFn({uuid: '10'})).toEqual('10')
  })

  it('should dispatch action POST_SUBSCRIPTION_EXCLUSION_PATTERN when tag added', () => {
    createWrapper().find('Chips').props().onAdd('changed tag')

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN',
      url: 'api/2/exclusions/1/pattern',
      body: {
        pattern: 'changed tag'
      }
    }))
  })

  it('should dispatch action DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS when tag deleted', () => {
    createWrapper().find('Chips').props().onRemove({uuid: 'uuid 2'})

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS',
      url: 'api/2/exclusions/1/pattern/uuid 2'
    }))
  })

  it('should render chip item', () => {
    const Item = createWrapper().find('Chips').props().renderItem
    const exclusions = state.subscription.exclusions['1']

    expect(shallow(<Item {...exclusions[1]}/>).html()).toEqual('<strong>exclusion2</strong> <em>(2)</em>')
  })

  it('should pass expected props to primary button component', () => {
    expect(createWrapper().find('[primary=true]').props()).toContainObject({
      disabled: true,
      children: 'Save'
    })
  })

  it('should dispatch action PATCH_SUBSCRIPTION when primary button clicked', () => {
    createWrapper().find('[primary=true]').props().onClick()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PATCH_SUBSCRIPTION',
      url: 'api/2/subscriptions/1',
      body: {
        uuid: '1',
        title: 'title1',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2',
          name: 'name 1'
        }
      }
    }))
  })

  it('should pass expected props to caution button component', () => {
    expect(createWrapper().find('ConfirmButton').props()).toContainObject({
      disabled: true,
      children: 'Delete'
    })
  })

  it('should dispatch action DELETE_SUBSCRIPTION when caution button clicked', () => {
    createWrapper().find('ConfirmButton').props().onClick()

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'DELETE_SUBSCRIPTION',
      url: 'api/2/subscriptions/1'
    }))
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_CLEAR when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBSCRIPTION_EDIT_FORM_CLEAR'
    })
  })

  it('should dispatch action SUBSCRIPTION_EDIT_FORM_LOAD when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: 'SUBSCRIPTION_EDIT_FORM_LOAD',
      subscription: {
        uuid: '1',
        title: 'title1',
        origin: 'origin1',
        createdAt: '2017-12-29',
        feedTag: {
          uuid: '2',
          name: 'name 1'
        }
      }
    })
  })

  it('should dispatch action GET_SUBSCRIPTION_EXCLUSION_PATTERNS when mounted', () => {
    createWrapper()

    expect(dispatch).toHaveBeenNthCalledWith(4, expect.objectContaining({
      type: 'GET_SUBSCRIPTION_EXCLUSION_PATTERNS',
      url: 'api/2/exclusions/1/pattern'
    }))
  })
})
