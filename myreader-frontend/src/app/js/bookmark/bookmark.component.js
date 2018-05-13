import template from './bookmark.component.html'
import './bookmark.component.css'
import {fetchEntries, getEntryTags, routeChange, routeSelector} from '../store'
import {SUBSCRIPTION_ENTRIES} from '../constants'

class controller {

    constructor($ngRedux) {
        'ngInject'
        this.$ngRedux = $ngRedux
    }

    $onInit() {
        this.unsubscribe = this.$ngRedux.connect(this.mapStateToThis, this.mapDispatch.bind(this))(this)
    }

    $onDestroy() {
        this.unsubscribe()
    }

    mapStateToThis(state) {
        return {
            ...getEntryTags(state),
            ...routeSelector(state)
        }
    }

    mapDispatch(dispatch) {
        return {
            onTagSelect: entryTagEqual => dispatch(routeChange(['app', 'bookmarks'], {...this.router.query, entryTagEqual})),
            refresh: () => dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query: this.router.query})),
            retrieveEntries: params => dispatch(routeChange(['app', 'bookmarks'], params))
        }
    }
}

export const BookmarkComponent = {
    template, controller
}
