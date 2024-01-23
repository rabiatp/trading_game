
class PriceHistoryModel {
    //t_price_history
    constructor(
        id = null,
        shareId = null,
        price = null,
        date = null
    ){
        this.id = id;
        this.shareId = shareId;
        this.price = price;
        this.date = date;
    }
}
module.exports = PriceHistoryModel;