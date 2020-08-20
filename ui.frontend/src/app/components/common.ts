import { ComponentMapping } from '@adobe/cq-angular-editable-components';


export interface ContainerProperties extends MappedComponentProperties {
    componentMapping?: typeof ComponentMapping;
    cqItems: { [key: string]: Model };
    cqItemsOrder: string[];
}
/*
export interface ContainerModel extends Model {

}*/


export interface Model extends Object {
    ':hierarchyType'?: string;
    /**
     * Path of the item/page
     */
    ':path'?: string;
    /**
     * Child pages (only present on page's itself, not on items)
     */
    ':children'?: { [key: string]: Model };

    /**
     * Items under the page / item
     */
    ':items'?: { [key: string]: Model };

    /**
     * Order of the items under the page / item
     * Can be used as keys for the :items property to iterate items in the proper order
     */
    ':itemsOrder'?: string[];

    /**
     * Resource type of the page / item
     */
    ':type'?: string;
}

export interface LabelledModel extends Model {
    'cq:panelTitle': string;
}

/**
 * Indicated whether force reload is turned on, forcing the model to be refetched on every MapTo instantiation.
 */
export interface ReloadForceAble {
    cqForceReload?: boolean;
}

/**
 * MappedComponentProperties
 * Properties given to every component runtime by the SPA editor.
 */
export interface MappedComponentProperties extends ReloadForceAble {
    isInEditor: boolean;
    cqPath: string;
    class: string;
}
