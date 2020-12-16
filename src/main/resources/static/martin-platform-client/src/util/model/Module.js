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
        this.visible = true;
    }
    
    getIcon() {
        return this.icon;
    }
    
    getId() {
        return this.id;
    }
    
    getItems() {
        return this.items;
    }
    
    isVisible() {
        return this.visible;
    }
    
    setInvisible() {
        this.visible = false;
        return this;
    }
    
    setIcon(icon) {
        this.icon = icon;
        return this;
    }
}
