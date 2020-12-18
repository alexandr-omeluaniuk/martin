/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export const ALIGN_LEFT = 'left';
export const ALIGN_RIGHT = 'right';

export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';

export class TableConfig {
    constructor(title, apiUrl, columns, formConfig) {
        this.title = title;
        this.apiUrl = apiUrl;
        this.columns = columns;
        this.formConfig = formConfig;
    }
}

export class TableColumn {
    constructor(name, label, renderer) {
        this.name = name;
        this.label = label;
        this.renderer = renderer;
        this.sortable = false;
        this.align = ALIGN_LEFT;
        this._sort_direction = null;
    }
    width(width) {
        this.width = width;
        return this;
    }
    alignment(align) {
        this.align = align;
        return this;
    }
    setSortable() {
        this.sortable = true;
        return this;
    }
    
    _toggleSortDirection() {
        if (this._sort_direction === null) {
            this._sort_direction = SORT_ASC;
        } else {
            if (this._sort_direction === SORT_ASC) {
                this._sort_direction = SORT_DESC;
            } else {
                this._sort_direction = SORT_ASC;
            }
        }
        return this._sort_direction;
    }
}

export class FormConfig {
    constructor(formFields) {
        this.formFields = formFields;
    }
}

export class FormField {
    constructor(name, type, label) {
        this.name = name;
        this.label = label;
        this.type = type;
    }
    hide() {
        this.hidden = true;
        return this;
    }
    setGrid(grid) {
        this.grid = grid;
        return this;
    }
    validation(validators) {
        this.validators = validators;
        return this;
    }
}

export class Validator {
    constructor(type, attributes) {
        this.type = type;
        this.attr = attributes;
    }
}
