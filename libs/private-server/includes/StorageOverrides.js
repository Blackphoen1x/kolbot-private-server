// 大箱子10x10高度重置
Storage.Init = function () {
    this.StashY = me.gametype === 0 ? 4 : 10;
    this.Inventory = new Container("Inventory", 10, 4, 3);
    this.TradeScreen = new Container("Inventory", 10, 4, 5);
    this.Stash = new Container("Stash", 10, this.StashY, 7);
    this.Belt = new Container("Belt", 4 * this.BeltSize(), 1, 2);
    this.Cube = new Container("Horadric Cube", 10, 8, 6);
    this.InvRef = [];

    this.Reload();
};
