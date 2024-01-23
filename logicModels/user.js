class UserModel{
    //t_user
    constructor(
        id = null,
        name = null,
        surname = null
    ){
        this.id = id;
        this.name = name;
        this.surname = surname;
    }
}
module.exports = UserModel;