import template from './bookmark-tags.component.html'
import css from './bookmark-tags.component.css'

export const BookmarkTagsComponent = {
    template, css,
    bindings: {
        myTags: '<',
        mySelected: '<',
        myOnSelect: '&'
    }
}
