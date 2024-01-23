class InsertModel {
    constructor(table, object, then, err) {
        this.table = table;
        this.object = object;
        this.then = then;
        this.err = err;
    }
}

module.exports = InsertModel;