/**
 * Class to control the page state so the user is aware of what is going on
 * When the page is loaded, the state is loading by default
 */
export class PageState {
    loading: boolean = true;
    default: boolean = false;
    update: boolean = false;
    preview:boolean = false;
    extra:boolean = false;

    public defaultState() {
        this.loading = false;
        this.default = true;
        this.update = false;
        this.extra = false;
        this.preview = false;
    }

    public updateState() {
        this.loading = false;
        this.default = false;
        this.update = true;
        this.extra = false;
        this.preview = false;
    }

    public extraState() {
        this.loading = false;
        this.default = false;
        this.update = false;
        this.extra = true;
        this.preview = false;
    }

    public loadingState() {
        this.loading = true;
        this.default = false;
        this.update = false;
        this.extra = false;
        this.preview = false;
    }

    public previewState() {
        this.loading = false;
        this.default = false;
        this.update = false;
        this.extra = false;
        this.preview = true;
    }
}