/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export const ALIGN_LEFT = 'left';
export const ALIGN_RIGHT = 'right';

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
    }
    width(width) {
        this.width = width;
        return this;
    }
    alignment(align) {
        this.align = align;
        return this;
    }
}

export class FormConfig {
    constructor(formFields) {
        this.formFields = formFields;
    }
}
