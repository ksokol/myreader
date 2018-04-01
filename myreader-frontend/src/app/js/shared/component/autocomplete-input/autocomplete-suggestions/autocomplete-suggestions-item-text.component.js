import './autocomplete-suggestions-item-text.component.css'

class controller {

    $onChanges() {
        this.termFragment = this.myTerm || ''
        this.termFragmentHighlight = ''

        if (this.termFragment.startsWith(this.myTermFragment)) {
            this.termFragment = this.termFragment.replace(this.myTermFragment, '')
            this.termFragmentHighlight = this.myTermFragment
        }
    }
}

export const AutocompleteSuggestionsItemTextComponent = {
    controller,
    template: `<span class="autocomplete-suggestions-item-text--highlight">{{$ctrl.termFragmentHighlight}}</span>{{$ctrl.termFragment}}`,
    bindings: {
        myTerm: '<',
        myTermFragment: '<'
    }
}
