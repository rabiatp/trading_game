class ShareModel{
    //t_share
    constructor(
        id = null,
        name = null,
        symbol = null,
        shareRate = null,
        date = null
    ){
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.shareRate = shareRate;
        this.date = date;
    }
}
module.exports = ShareModel;