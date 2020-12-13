/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class TableConfig {
    constructor(title, apiUrl, columns, formConfig) {
        this.title = title;
        this.apiUrl = apiUrl;
        this.columns = columns;
        this.formConfig = formConfig;
    }
}

export class TableColumn {
    constructor(name, label) {
        this.name = name;
        this.label = label;
    }
}

export class FormConfig {
    constructor(formFields) {
        this.formFields = formFields;
    }
}
