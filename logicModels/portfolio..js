class PortfolioModel {
    //t_portfolio
    constructor(
        id = null,
        userId = null,
        shareId = null,
        quantity = null,
        price = null,
        data = null,
        type = null
    ){
        this.id = id;
        this.userId = userId;
        this.shareId = shareId;
        this.quantity = quantity;
        this.price = price;
        this.data = data;
        this.type = type;
    }
}
module.exports = PortfolioModel