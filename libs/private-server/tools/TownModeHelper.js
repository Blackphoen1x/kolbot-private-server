/**
 *    @file        TownModeHelper.js
 *    @author      Black phoen1x
 *    @desc        tool for saving town mode data
 */

include("json2.js");
include("OOG.js");
include("common/misc.js");
include("common/prototypes.js");

include("private-server/includes/Polyfill.js");
include("private-server/includes/Color.js");

const TownModesFile = {
    path: "libs/private-server/data/townModes.json",

    create: function () {
        const townModes = [
            [], // act1
            [], // act2
            [], // act3
            [], // act4
            []  // act5
        ];
        const string = JSON.stringify(townModes);
        Misc.fileAction(this.path, 1, string);
        return townModes;
    },

    getObj: function () {
        !FileTools.exists(this.path) && TownModesFile.create();

        let obj;
        const string = Misc.fileAction(this.path, 0);

        try {
            obj = JSON.parse(string);
        } catch (e) {
            // If we failed, file might be corrupted, so create a new one
            obj = this.create();
        }

        if (obj) {
            return obj;
        }

        print("Error reading File. Using null values.");

        return [
            [], // act1
            [], // act2
            [], // act3
            [], // act4
            []  // act5
        ];
    },

    read: function () {
        const obj = this.getObj();

        return Misc.clone(obj);
    }
};
const Town = {
    act: [{}, {}, {}, {}, {}]
};

let hookText;
let ingame = false;
let finding = false;
let adding = false;
let townModeExist;
let fire;
let mouse;
let townBarrierUnits = [];

function showHookText() {
    hookText = new Text("", 400, 60, 2, 3, 2, false);
}

function changeHookText(text) {
    hookText.text = text;
}

function clearTownBarrierUnits() {
    townBarrierUnits = [];
}

function initFire() {
    if (!me.ingame || me.act !== 1) {
        return;
    }

    const fireUnit = getPresetUnit(1, 2, 39);
    if (!fireUnit) {
        D2Bot.printToConsole("Error: Couldn't find fire unit.", 9);
        return;
    }
    fire = {
        x: fireUnit.roomx * 5 + fireUnit.x,
        y: fireUnit.roomy * 5 + fireUnit.y
    };
}

function addAroundBarrierUnits() {
    if (adding) {
        return;
    }

    adding = true;
    !finding && changeHookText("adding");
    Messaging.sendToScript("default.dbj", hookText.text);

    const barrierClassIdList = [
        4, 7, 9, 46, 208, 209, 257, 258, 454
    ];
    const containers = [
        "chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim", "tomb2",
        "tomb3", "roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus", "object2",
        "cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
        "woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "groundtomb", "icecavejar1", "icecavejar2",
        "icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "groundtombl"
    ];
    const townAreas = [1, 40, 75, 103, 109];

    let object = getUnit(2);
    if (object) {
        do {
            if (townAreas.includes(object.area) && object.name &&
                (barrierClassIdList.includes(object.classid) || containers.includes(object.name.toLowerCase()))) {
                const addedBarrier = townBarrierUnits.find(barrier => {
                    return barrier.gid === object.gid;
                });
                !addedBarrier && townBarrierUnits.push(Misc.clone(object));
            }
        } while (object.getNext());
    }

    !finding && changeHookText("Added " + townBarrierUnits.length + " barrier units");
    adding = false;
}

function checkExist(save) {
    if (townBarrierUnits.length === 0) {
        D2Bot.printToConsole("Please add barrier units first (F1)", 4);
        return true;
    }

    const townModes = TownModesFile.read();
    const actTownModes = townModes[me.act - 1];
    if (actTownModes.length === 0) {
        !save && D2Bot.printToConsole("Please save a townMode first (F2)", 4);
        return false;
    }

    Town.act[me.act - 1].possibleTownModes = [];

    let barrierList;

    loop1:
        for (let townMode of actTownModes) {
            barrierList = townMode.barrierList;
            for (let barrierUnit of townBarrierUnits) {
                const matchedBarrier = barrierList.find(barrier => {
                    for (let key of ["classid", "x", "y"]) {
                        if (barrier[key] !== barrierUnit[key]) {
                            return false;
                        }
                    }
                    return true;
                });
                if (!matchedBarrier) {
                    continue loop1;
                }
            }
            Town.act[me.act - 1].possibleTownModes.push(townMode);
        }

    const possibleTownModes = getPossibleTownModes();

    if (possibleTownModes.length === 0) {
        !finding && !save && D2Bot.printToConsole("No matched townMode.", 4);
        return false;
    } else {
        let string = "";
        for (let townMode of possibleTownModes) {
            string += " " + townMode.name;
        }
        if (!finding || (finding && possibleTownModes.length >= 2)) {
            D2Bot.printToConsole("Possible townModes:" + string, 4);
        }
        return true;
    }
}

function getPossibleTownModes() {
    return Town.act[me.act - 1].possibleTownModes;
}

function genBarrierList() {
    const barrierList = [];

    for (let barrierUnit of townBarrierUnits) {
        const newBarrier = {
            classid: barrierUnit.classid,
            x: barrierUnit.x,
            y: barrierUnit.y
        };

        if (me.act === 1) {
            newBarrier.x -= fire.x;
            newBarrier.y -= fire.y;
        }

        const repeatBarrier = barrierList.find(barrier => {
            for (let key in newBarrier) {
                if (newBarrier[key] !== barrier[key]) {
                    return false;
                }
            }
            return true;
        });


        if (repeatBarrier) {
            repeatBarrier.repeat++
        } else {
            newBarrier.repeat = 0;
            barrierList.push(newBarrier);
        }
    }

    return barrierList;
}

function saveTownMode() {
    !FileTools.exists(TownModesFile.path) && TownModesFile.create();
    if (townBarrierUnits.length === 0) {
        D2Bot.printToConsole("Please add barrier units first (F1)", 4);
        return;
    }

    if (checkExist(true)) {
        D2Bot.printToConsole("townBarrierUnits is not unique enough to gen a new townMode", 9);
        return;
    }

    const townModes = TownModesFile.read();
    const actTownModes = townModes[me.act - 1];

    const townMode = {
        name: "townMode" + (actTownModes.length + 1).toString(),
        barrierList: genBarrierList()
    };

    actTownModes.push(townMode);
    const string = JSON.stringify(townModes);
    Misc.fileAction(TownModesFile.path, 1, string);
    D2Bot.printToConsole("Saved: act" + me.act + " " + townMode.name, 5);
}

function randomString(len) {
    let rval = "";
    const letters = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < len; i += 1) {
        rval += letters[Math.floor(Math.random() * 26)];
    }

    return rval;
}

function locationTimeout(time, location) {
    let endtime = getTickCount() + time;

    while (getLocation() === location && endtime > getTickCount()) {
        delay(500);
    }

    return (getLocation() !== location);
}

function createRoom() {
    const location = getLocation();
    switch (location) {
        case 1:	// Lobby
            if (!ControlAction.click(6, 533, 469, 120, 20)) { // Create
                break;
            }

            if (!locationTimeout(5000, location)) { // in case create button gets bugged
                if (!ControlAction.click(6, 652, 469, 120, 20)) { // Join
                    break;
                }

                if (!ControlAction.click(6, 533, 469, 120, 20)) { // Create
                    break;
                }
            }
            break;
        case 4: // Create Game
            ControlAction.setText(1, 432, 162, 158, 20, randomString(7));
            ControlAction.setText(1, 432, 217, 158, 20, "1");

            me.blockMouse = true;

            ControlAction.click(6, 594, 433, 172, 32);

            me.blockMouse = false;

            locationTimeout(10000, location);
            break;
        case 26: // Lobby - Game Name Exists
            ControlAction.click(6, 533, 469, 120, 20);
            break;
        default:
            throw new Error("Unhandled location");
    }
}

function stopFinding() {
    finding = false;
    changeHookText("Added " + townBarrierUnits.length + " barrier units");
}

function removeTownMode() {
    const townModes = TownModesFile.read();
    const actTownModes = townModes[me.act - 1];
    if (actTownModes.length === 0) {
        D2Bot.printToConsole("Current townMode list is empty.", 4);
        return;
    }
    const townMode = actTownModes.pop();
    const string = JSON.stringify(townModes);
    Misc.fileAction(TownModesFile.path, 1, string);
    D2Bot.printToConsole("Removed: act" + me.act + " " + townMode.name, 5);
}

function showMe() {
    let string;
    if (me.act === 1) {
        const meRelCoords = {
            x: me.x - fire.x >= 0 ? "+" + (me.x - fire.x) : me.x - fire.x,
            y: me.y - fire.y >= 0 ? "+" + (me.y - fire.y) : me.y - fire.y
        };
        const mouseRelCoords = {
            x: mouse.x - fire.x >= 0 ? "+" + (mouse.x - fire.x) : mouse.x - fire.x,
            y: mouse.y - fire.y >= 0 ? "+" + (mouse.y - fire.y) : mouse.y - fire.y
        };
        string = "AreaID: [" + me.area + "] | Me: [fire " + meRelCoords.x + ", fire " + meRelCoords.y + "] | " + "Mouse: [fire " + mouseRelCoords.x + ", fire " + mouseRelCoords.y + "]"
    } else {
        string = "AreaID: [" + me.area + "] | Me: [" + me.x + ", " + me.y + "] | " + "Mouse: [" + mouse.x + ", " + mouse.y + "]";
    }
    D2Bot.printToConsole(string, 4);
}

function showUnitNearestToCursor(unitType) {
    const range = 2;
    const unitTypes = ["player", "NPC", "object", "missle", "item", "wrap"];
    let distance;
    let string;
    let unit = getUnit(unitTypes.indexOf(unitType));

    if (unit) {
        do {
            distance = getDistance(mouse.x, mouse.y, unit.x, unit.y);
            if (unit.name && distance < range) {
                if (me.act === 1) {
                    const unitRelCoords = {
                        x: unit.x - fire.x >= 0 ? "+" + (unit.x - fire.x) : unit.x - fire.x,
                        y: unit.y - fire.y >= 0 ? "+" + (unit.y - fire.y) : unit.y - fire.y
                    };
                    // string = "Nearest unit to cursor: " + unit.name + " [fire" + unitRelCoords.x + ", fire" + unitRelCoords.y + "] ClassID:[" + unit.classid + "]";
                    string = "Nearest " + unitType + " to cursor: " + unit.name + " [fire " + unitRelCoords.x + ", fire " + unitRelCoords.y + "] classId:[" + unit.classid + "]";
                } else {
                    string = "Nearest " + unitType + " to cursor: " + unit.name + " [" + unit.x + ", " + unit.y + "] classId:[" + unit.classid + "]";
                }
                // D2Bot.printToConsole(string, 4);
                D2Bot.printToConsole(JSON.stringify(unit), 4);
                break;
            }
        } while (unit.getNext());
    }
}

function showCursorItem() {
    const cursorItem = getUnit(100);
    if (cursorItem) {
        const string = "Current Item: " + cursorItem.name + " [classid = " + cursorItem.classid + "] | [lv = " + cursorItem.ilvl + "]";
        D2Bot.printToConsole(string, 4);
    }
}

function showInfo() {
    mouse = getMouseCoords(true, true);
    showMe();
    showUnitNearestToCursor("object");
    showUnitNearestToCursor("NPC");
    showCursorItem();
    // print(Pather.checkSpot(mouse.x, mouse.y, 0x1, false));
    // print(Pather.checkSpot(mouse.x, mouse.y, 0x4, false));
}

function keyEvent(key) {
    if (![112, 113, 114, 115, 116, 117].includes(key)) {
        return;
    }

    initFire();

    switch (key) {
        case 112: // F1
            addAroundBarrierUnits();
            break;

        case 113: // F2
            saveTownMode();
            break;

        case 114: // F3
            checkExist(false);
            break;

        case 115: // F4
            removeTownMode();
            break;

        case 116: // F5
            showInfo();
            break;

        case 117: // F6
            finding = !finding;
            changeHookText(finding ? "Finding room" : "Added " + townBarrierUnits.length + " barrier units");
            break;
    }
}

function main() {
    D2Bot.init();
    addEventListener("keyup", keyEvent);
    showHookText();
    if (!getScript("D2BotMapPrivateServer.dbj")) {
        hookText.visible = false;
    }
    changeHookText("Added " + townBarrierUnits.length + " barrier units");

    while (true) {
        while (me.ingame) {
            if (me.gameReady && me.inTown) {
                if (!ingame) {
                    ingame = true;
                    initFire();
                    print(Color.orange + "TownModeHelper" + Color.white + " :: Press " + Color.lGold + "F1 " + Color.white + "to add aroundBarrierUnits, " + Color.lGold + "F2 " + Color.white + "to save townMode.");
                    print(Color.orange + "TownModeHelper" + Color.white + " :: Press " + Color.lGold + "F3 " + Color.white + "to check saved townMode, " + Color.lGold + "F4 " + Color.white + "to delete last townMode.");
                    print(Color.orange + "TownModeHelper" + Color.white + " :: Press " + Color.lGold + "F5 " + Color.white + "to show information, " + Color.lGold + "F6 " + Color.white + "to find different room.");
                }
                if (finding) {
                    addAroundBarrierUnits();
                    townModeExist = checkExist();
                    townModeExist ? quit() : stopFinding();
                }
            }
            delay(1000);
            Messaging.sendToScript("default.dbj", hookText.text);
        }

        if (ingame) {
            ingame = false;
            clearTownBarrierUnits();
            finding || changeHookText("Added " + townBarrierUnits.length + " barrier units");
        }

        finding && createRoom();

        delay(1000);
    }
}
