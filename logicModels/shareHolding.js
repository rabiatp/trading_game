class ShareHoldingModel{
    //t_share_holding
    constructor(
        id = null,
        shareId = null,
        totalSharesBought = null,
        totalSharesSold = null,
        availableShares = null
    ){
        this.id = id;
        this.shareId = shareId,
        this.totalSharesBought = totalSharesBought;
        this.totalSharesSold = totalSharesSold;
        this.availableShares = availableShares;      
    }
}
module.exports = ShareHoldingModel;