/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class Module {
    
    constructor(id, path, items) {
        this.id = id;
        this.path = path;
        this.items = items;
    }
    
    getItems() {
        return this.items;
    }
}
