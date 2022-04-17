/**
 *    @filename     TownOverrides.js
 *    @author       Black phoen1x
 *    @des          Specific overrided functions for private server.
 */

include("private-server/config/townConfig.js");


const TownModesFile = {
    path: "libs/private-server/data/townModes.json",

    loaded: false,

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

Town.townModes = [];

Town.townModeHooks = [];

Town.targetSpot = "";

Town.initialize = function () {
    //print("Initialize town " + me.act);
    if (!TownModesFile.loaded) {
        this.townModes = TownModesFile.read();
        TownModesFile.loaded = true;
    }

    this.targetSpot = "";
    this.act[me.act - 1].possibleTownModes = [];
    this.act[me.act - 1].resetSpot = {};
    this.act[me.act - 1].keyBarrierCoords = [];

    this.removeTownModeHooks();
    Town.townModeHooks.push(new Text("", 400, 60, 2, 3, 2, false));

    switch (me.act) {
        case 1:
            var fire,
                wp = getPresetUnit(1, 2, 119),
                fireUnit = getPresetUnit(1, 2, 39);

            if (!fireUnit) {
                return false;
            }

            fire = [fireUnit.roomx * 5 + fireUnit.x, fireUnit.roomy * 5 + fireUnit.y];

            this.act[0].fire = {x: fire[0], y: fire[1]};
            this.act[0].spot = {};
            this.act[0].spot.stash = [fire[0] - 7, fire[1] - 12];
            this.act[0].spot.warriv = [fire[0] - 5, fire[1] - 2];
            this.act[0].spot.cain = [fire[0] + 6, fire[1] - 5];
            this.act[0].spot[NPC.Kashya] = [fire[0] + 14, fire[1] - 4];
            this.act[0].spot[NPC.Akara] = [fire[0] + 56, fire[1] - 30];
            this.act[0].spot[NPC.Charsi] = [fire[0] - 39, fire[1] - 25];
            this.act[0].spot[NPC.Gheed] = [fire[0] - 34, fire[1] + 36];
            this.act[0].spot.portalspot = [fire[0] + 10, fire[1] + 18];
            this.act[0].spot.waypoint = [wp.roomx * 5 + wp.x, wp.roomy * 5 + wp.y];
            this.act[0].initialized = true;

            break;
        case 2:
            this.act[1].spot = {};
            this.act[1].spot[NPC.Fara] = [5124, 5082];
            this.act[1].spot.cain = [5124, 5082];
            this.act[1].spot[NPC.Lysander] = [5118, 5104];
            this.act[1].spot[NPC.Greiz] = [5033, 5053];
            this.act[1].spot[NPC.Elzix] = [5032, 5102];
            this.act[1].spot.palace = [5088, 5153];
            this.act[1].spot.sewers = [5221, 5181];
            this.act[1].spot.meshif = [5205, 5058];
            this.act[1].spot[NPC.Drognan] = [5097, 5035];
            this.act[1].spot.atma = [5137, 5060];
            this.act[1].spot.warriv = [5152, 5201];
            this.act[1].spot.portalspot = [5168, 5060];
            this.act[1].spot.stash = [5124, 5076];
            this.act[1].spot.waypoint = [5070, 5083];
            this.act[1].initialized = true;

            break;
        case 3:
            this.act[2].spot = {};
            this.act[2].spot.meshif = [5118, 5168];
            this.act[2].spot[NPC.Hratli] = [5223, 5048, 5127, 5172];
            this.act[2].spot[NPC.Ormus] = [5129, 5093];
            this.act[2].spot[NPC.Asheara] = [5043, 5093];
            this.act[2].spot[NPC.Alkor] = [5083, 5016];
            this.act[2].spot.cain = [5148, 5066];
            this.act[2].spot.stash = [5144, 5059];
            this.act[2].spot.portalspot = [5150, 5063];
            this.act[2].spot.waypoint = [5158, 5050];
            this.act[2].initialized = true;

            break;
        case 4:
            this.act[3].spot = {};
            this.act[3].spot.cain = [5027, 5027];
            this.act[3].spot[NPC.Halbu] = [5089, 5031];
            this.act[3].spot[NPC.Tyrael] = [5027, 5027];
            this.act[3].spot[NPC.Jamella] = [5088, 5054];
            this.act[3].spot.stash = [5022, 5040];
            this.act[3].spot.portalspot = [5045, 5042];
            this.act[3].spot.waypoint = [5043, 5018];
            this.act[3].initialized = true;

            break;
        case 5:
            this.act[4].spot = {};
            this.act[4].spot.portalspot = [5098, 5019];
            this.act[4].spot.stash = [5129, 5061];
            this.act[4].spot[NPC.Larzuk] = [5141, 5045];
            this.act[4].spot[NPC.Malah] = [5078, 5029];
            this.act[4].spot.cain = [5119, 5061];
            this.act[4].spot[NPC["Qual-Kehk"]] = [5066, 5083];
            this.act[4].spot[NPC.Anya] = [5112, 5120];
            this.act[4].spot.portal = [5118, 5120];
            this.act[4].spot.waypoint = [5113, 5068];
            this.act[4].spot.nihlathak = [5071, 5111];
            this.act[4].initialized = true;

            break;
    }

    this.addExtraSpots();

    this.resetSpotsByUnit();

    this.setTownMode();

    return true;
};

Town.getCorpse = function () {
    if (!this.act[me.act - 1].initialized) {
        this.initialize();
    }

    var i, corpse, gid,
        corpseList = [],
        timer = getTickCount();

    // No equipped items - high chance of dying in last game, force retries
    if (!me.getItem(-1, 1)) {
        for (i = 0; i < 5; i += 1) {
            corpse = getUnit(0, me.name, 17);

            if (corpse) {
                break;
            }

            delay(500);
        }
    } else {
        corpse = getUnit(0, me.name, 17);
    }

    if (!corpse) {
        return true;
    }

    do {
        if (corpse.dead && corpse.name === me.name && (getDistance(me.x, me.y, corpse.x, corpse.y) <= 20 || me.inTown)) {
            corpseList.push(copyUnit(corpse));
        }
    } while (corpse.getNext());

    while (corpseList.length > 0) {
        if (me.dead) {
            return false;
        }

        gid = corpseList[0].gid;

        Pather.moveToUnit(corpseList[0]);
        Misc.click(0, 0, corpseList[0]);
        delay(500);

        if (getTickCount() - timer > 3000) {
            Pather.moveTo(me.x + rand(-1, 1) * 4, me.y + rand(-1, 1) * 4);
        }

        if (getTickCount() - timer > 30000) {
            D2Bot.printToConsole("Failed to get corpse, stopping.", 9);
            D2Bot.stop();
        }

        if (!getUnit(0, -1, -1, gid)) {
            corpseList.shift();
        }
    }

    if (me.gametype === 0) {
        this.checkShard();
    }

    return true;
};

Town.addExtraSpots = function () {
    const extraSpots = townConfig["act" + me.act.toString()].extraSpots;
    for (let key in extraSpots) {
        this.act[me.act - 1].spot[key] = extraSpots[key];
        this.act[me.act - 1].resetSpot[key] = true;
    }
    return true;
};

Town.removeTownModeHooks = function () {
    if (this.townModeHooks.length === 0) {
        return true;
    }

    for (let hook of this.townModeHooks) {
        hook.remove();
        this.townModeHooks.shift();
    }
    return true;
};

Town.changeTownModeHookText = function (text) {
    if (Town.townModeHooks[0].text !== text) {
        Town.townModeHooks[0].text = text;
    }
    return true;
};

Town.resetSpotsByUnit = function () {
    let spotsResetByUnit;
    for (let spot in this.act[me.act - 1].spot) {
        if (this.resetSpotByUnit(spot)) {
            spotsResetByUnit = true;
        }
    }
    return spotsResetByUnit;
};

Town.resetSpotByUnit = function (spot) {
    let destiUnit;
    if (spot && !this.act[me.act - 1].resetSpot[spot]) {
        switch (spot) {
            case "portal": // A5 red portal
                return false;
                break;
            case "portalspot":
                destiUnit = getUnit(2, 59);
                if (destiUnit) {
                    const nearestSpotToPortal = this.getNearestSpot(destiUnit);
                    if (Town.targetSpot.includes("portalspot") && nearestSpotToPortal.includes("portalspot")
                        && Town.targetSpot !== nearestSpotToPortal) {
                        Town.targetSpot = nearestSpotToPortal;
                        print("to " + nearestSpotToPortal);
                    }
                    return false;
                }
                break;
            case "cain":
                destiUnit = getUnit(1, NPC.Cain);
                break;
            case "stash":
                destiUnit = getUnit(2, 267);
                break;
            default:
                destiUnit = getUnit(1, spot) || getUnit(2, spot);
                break;
        }
        if (!!destiUnit) {
            if (getDistance(this.act[me.act - 1].spot[spot][0], this.act[me.act - 1].spot[spot][1], destiUnit.x, destiUnit.y) > 7) {
                this.act[me.act - 1].spot[spot] = [destiUnit.x, destiUnit.y];
                this.act[me.act - 1].resetSpot[spot] = true;
                print("reset " + spot);
                return true;
            }
            this.act[me.act - 1].resetSpot[spot] = true;
        }
    }
    return false;
};

Town.getPossibleTownModes = function () {
    return this.act[me.act - 1].possibleTownModes;
};

Town.moveToSpot = function (spot) {
    Town.targetSpot = spot;

    var i, path, townSpot,
        // longRange = (me.classid === 1 && this.telekinesis && me.getSkill(43, 1) && ["stash", "portalspot"].indexOf(spot) > -1) || spot === "waypoint";
        longRange = false;

    let possibleTownModes;

    if (!this.act[me.act - 1].hasOwnProperty("spot") || !this.act[me.act - 1].spot.hasOwnProperty(spot)) {
        return false;
    }

    if (typeof (this.act[me.act - 1].spot[spot]) === "object") {
        townSpot = this.act[me.act - 1].spot[spot];
    } else {
        return false;
    }

    if (longRange) {
        path = getPath(me.area, townSpot[0], townSpot[1], me.x, me.y, 1, 8);

        if (path && path[1]) {
            townSpot = [path[1].x, path[1].y];
        }
    }

    const from = this.getNearestSpot();

    for (i = 0; i < townSpot.length; i += 2) {
        //print("moveToSpot: " + spot + " from " + me.x + ", " + me.y);

        const tick = getTickCount();
        while (getDistance(me, townSpot[i], townSpot[i + 1]) > 6) {
            if (getTickCount() - tick > 60 * 1e3) {
                throw new Error("Failed to move to spot from: " + from + ", to: " + Town.targetSpot + " in possibleTownModes:" + this.townModeHooks[0].text);
            }
            if (!me.idle) {
                Misc.click(0, 0, me.x, me.y); // Click to stop walking in case we got stuck
            }
            possibleTownModes = this.getPossibleTownModes();
            if (possibleTownModes.length > 0) {
                this.showPossibleTownModes(possibleTownModes);
                this.takeTownModeAction(possibleTownModes[0], from, Town.targetSpot, i);
            } else {
                this.changeTownModeHookText("No matched townMode");
                Pather.moveTo(townSpot[i], townSpot[i + 1], 3, false, false, true);
            }
            townSpot = this.act[me.act - 1].spot[Town.targetSpot];
            Packet.flash(me.gid);
        }

        this.changeTownModeHookText("");

        switch (spot) {
            case "stash":
                if (!!getUnit(2, 267)) {
                    return true;
                }

                break;
            case "cain":
                if (!!getUnit(1, NPC.Cain)) {
                    return true;
                }

                break;
            case "palace":
                if (!!getUnit(1, "jerhyn")) {
                    return true;
                }

                break;
            case "portalspot":
            case "sewers":
                if (getDistance(me, townSpot[i], townSpot[i + 1]) < 10) {
                    return true;
                }

                break;
            case "waypoint":
                if (!!getUnit(2, "waypoint")) {
                    return true;
                }

                break;
            default:
                if (!!getUnit(1, spot)) {
                    return true;
                }

                break;
        }
    }

    return false;
};

Town.clearPossibleTownmodes = function () {
    this.act[me.act - 1].possibleTownModes = [];
    return true;
};

Town.showPossibleTownModes = function (possibleTownModes) {
    let string = "";
    for (let townMode of possibleTownModes) {
        string += townMode.name + " ";
    }
    this.changeTownModeHookText(string);
};

Town.setTownMode = function () {
    const actTownModes = this.townModes[me.act - 1];
    if (actTownModes.length === 0) {
        // throw new Error("Please save a townMode first.");
        D2Bot.D2Bot.printToConsole("No TownModes found in act" + me.act.toString() + ".", 9);
        return false;
    }

    const formerLength = this.getPossibleTownModes().length;

    this.clearPossibleTownmodes();

    const aroundBarrierUnits = [];

    const barrierClassIdList = [
        4, 7, 9, 46, 208, 209, 257, 258, 454
    ];
    const townAreas = [1, 40, 75, 103, 109];

    const containers = [
        "chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim", "tomb2",
        "tomb3", "roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus", "object2",
        "cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
        "woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "groundtomb", "icecavejar1", "icecavejar2",
        "icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "groundtombl"
    ];

    let object = getUnit(2);
    if (object) {
        do {
            if (townAreas.includes(object.area) && object.name &&
                (barrierClassIdList.includes(object.classid) || containers.includes(object.name.toLowerCase()))) {
                const newObject = Misc.clone(object);
                if (me.act === 1) {
                    newObject.x -= this.act[0].fire.x;
                    newObject.y -= this.act[0].fire.y;
                }
                aroundBarrierUnits.push(newObject);
            }
        } while (object.getNext());
    }

    let barrierList;

    loop1:
        for (let townMode of actTownModes) {
            barrierList = townMode.barrierList;
            for (let barrierUnit of aroundBarrierUnits) {
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

    const possibleTownModes = this.getPossibleTownModes();
    const laterLength = possibleTownModes.length;
    const possibleTownModesChanged = laterLength !== formerLength;
    let actionTownModeChanged;
    if (typeof this.act[me.act - 1].actionTownMode === "undefined" || this.act[me.act - 1].actionTownMode.name !== possibleTownModes[0].name) {
        actionTownModeChanged = true;
        this.act[me.act - 1].actionTownMode = possibleTownModes[0];
        const config = townConfig["act" + me.act.toString()][this.act[me.act - 1].actionTownMode.name];
        this.resetSpotsByConfig(config.resetSpots) && this.setKeyBarrierCoords(config.keyBarrierCoords);
    } else {
        actionTownModeChanged = false;
    }

    possibleTownModesChanged && this.showPossibleTownModes(possibleTownModes);

    return actionTownModeChanged;
};

Town.takeTownModeAction = function (actionTownMode, from, spot, townSpotIndex) {
    print("takeTownModeAction");
    const config = townConfig["act" + me.act.toString()][actionTownMode.name];
    const to = Town.targetSpot;
    const guidedAstarPathes = config.guidedAstar;
    let reverse;
    const guidedAstar = guidedAstarPathes.find(guidedAstar => {
        if (guidedAstar.oneSide.includes(from) && guidedAstar.otherSide.includes(to)) {
            reverse = false;
            return true;
        } else if (guidedAstar.oneSide.includes(to) && guidedAstar.otherSide.includes(from)) {
            reverse = true;
            return true;
        }
        return false;
    });

    if (!guidedAstar) {
        // D2Bot.printToConsole("Cannot find guidedAstar from: " + from + ", to: " + spot + " in: " + townMode.name + ", use default A* path", 4);
    } else {
        const flags = Misc.clone(guidedAstar.flags);
        reverse && flags.reverse();

        for (let flag of flags) {
            if (me.act === 1) {
                if (!Pather.moveTo(this.act[0].fire.x + flag[0], this.act[0].fire.y + flag[1], 3, false, false, true)) {
                    return true;
                }
            } else {
                if (!Pather.moveTo(flag[0], flag[1], 3, false, false, true)) {
                    return true;
                }
            }
        }
    }

    const townSpot = this.act[me.act - 1].spot[Town.targetSpot];

    Pather.moveTo(townSpot[townSpotIndex], townSpot[townSpotIndex + 1], 3, false, false, true);

    return true;
};

Town.getNearestSpot = function (unit) {
    unit = unit || me;
    const townSpots = this.act[me.act - 1].spot;
    const spotsList = [];
    let townSpot;
    for (let spot in townSpots) {
        townSpot = townSpots[spot];
        for (let i = 0; i < townSpot.length; i += 2) {
            spotsList.push(
                {
                    spot: spot,
                    x: townSpot[i],
                    y: townSpot[i + 1]
                }
            );
        }
    }

    spotsList.sort(function (a, b) {
        return Math.round(getDistance(unit.x, unit.y, a.x, a.y)) - Math.round(getDistance(unit.x, unit.y, b.x, b.y));
    });
    const nearestSpot = spotsList.shift();

    return nearestSpot.spot;
};

Town.keyBarrierSpot = function (x, y, range) {
    range = range || 4;
    const keyBarrierCoords = this.act[me.act - 1].keyBarrierCoords;
    return keyBarrierCoords.find(keyBarrierCoord => {
        if (me.act === 1) {
            return getDistance(x, y, this.act[0].fire.x + keyBarrierCoord[0], this.act[0].fire.y + keyBarrierCoord[1]) <= range;
        }
        return getDistance(x, y, keyBarrierCoord[0], keyBarrierCoord[1]) <= range;
    })
};

Town.kickBarriers = function (maxKickNumber) {
    const range = 8;
    const barrierClassIdList = [
        4, 7, 9, 46, 208, 209, 454
    ];
    const containers = [
        "chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim", "tomb2",
        "tomb3", "roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus", "object2",
        "cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skullpile", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
        "woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "groundtomb", "icecavejar1", "icecavejar2",
        "icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "groundtombl"
    ];
    const townAreas = [1, 40, 75, 103, 109];

    let unitList = [];

    let unit = getUnit(2);
    if (unit) {
        do {
            if (getDistance(me.x, me.y, unit.x, unit.y) <= range &&
                unit.mode === 0 && townAreas.includes(unit.area) && unit.name
                && (barrierClassIdList.includes(unit.classid) || containers.includes(unit.name.toLowerCase()))
                && this.keyBarrierSpot(unit.x, unit.y, 5)) {
                unitList.push(copyUnit(unit));
            }
        } while (unit.getNext());
    }

    let sameCoord;
    const unitCoordList = [];

    for (let unit of unitList) {
        sameCoord = unitCoordList.find(coord => {
            for (let key of ["classid", "x", "y"]) {
                if (coord[key] !== unit[key]) {
                    return false;
                }
            }
            return true;
        });
        if (sameCoord) {
            sameCoord.repeat++;
        } else {
            unitCoordList.push(
                {
                    classid: unit.classid,
                    x: unit.x,
                    y: unit.y,
                    repeat: 0
                }
            );
        }
    }

    unitList = unitList.filter(unit => {
        return unitCoordList.find(coord => {
            for (let key of ["classid", "x", "y"]) {
                if (coord[key] !== unit[key]) {
                    return false;
                }
            }
            return true;
        }).repeat < 5;
    });

    let kickNumber = 0;

    for (let i = 0; i < 3; i++) {
        for (let unit of unitList) {
            this.kickBarrier(unit) && kickNumber++;
            if (kickNumber >= maxKickNumber) {
                return true;
            }
        }
    }

    return true;
};

Town.kickBarrier = function (unit) {
    // Skip invalid and Countess chests
    if (!unit || unit.x === 12526 || unit.x === 12565) {
        return false;
    }

    // already open
    if (unit.mode) {
        return true;
    }

    // locked chest, no keys
    if (me.classid !== 6 && unit.islocked && !me.findItem(543, 0, 3)) {
        return false;
    }

    var i, tick;

    for (i = 0; i < 3; i += 1) {
        // sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
        Misc.click(0, 0, unit);

        tick = getTickCount();

        if (unit.mode) {
            return true;
        }

        delay(10);
    }

    if (!me.idle) {
        Misc.click(0, 0, me.x, me.y); // Click to stop walking in case we got stuck
    }

    return false;
};

Town.resetSpotsByConfig = function (spots) {
    for (let key in spots) {
        if (!this.act[me.act - 1].resetSpot[key]) {
            if (me.act === 1) {
                this.act[me.act - 1].spot[key] = [this.act[0].fire.x + spots[key][0], this.act[0].fire.y + spots[key][1]];
            } else {
                this.act[me.act - 1].spot[key] = spots[key];
            }
            this.act[me.act - 1].resetSpot[key] = true;
            print("reset " + key);
        }
    }
    return true;
};

Town.setKeyBarrierCoords = function (keyBarrierCoords) {
    this.act[me.act - 1].keyBarrierCoords = keyBarrierCoords;
    return true;
};

Town.telekinesis = false; //私服禁用城内TK

// 重写initNPC函数 用于解决城内绕路踢桶问题
Town.initNPC = function (task, reason) {
    print("initNPC: " + reason);

    var npc = getInteractedNPC();

    if (npc && npc.name.toLowerCase() !== this.tasks[me.act - 1][task]) {
        me.cancel();

        npc = null;
    }

    // Jamella gamble fix
    if (task === "Gamble" && npc && npc.name.toLowerCase() === NPC.Jamella) {
        me.cancel();

        npc = null;
    }

    /*
    if (!npc) {
        npc = getUnit(1, this.tasks[me.act - 1][task]);
        if (!npc) {
            this.move(this.tasks[me.act - 1][task]);
            npc = getUnit(1, this.tasks[me.act - 1][task]);
        }
    }
    */

    if (!npc) {
        this.move(this.tasks[me.act - 1][task]);

        npc = getUnit(1, this.tasks[me.act - 1][task]);
    }

    if (!npc || npc.area !== me.area || (!getUIFlag(0x08) && !npc.openMenu())) {
        return false;
    }

    switch (task) {
        case "Shop":
        case "Repair":
        case "Gamble":
            if (!getUIFlag(0x0C) && !npc.startTrade(task)) {
                return false;
            }

            break;
        case "Key":
            if (!getUIFlag(0x0C) && !npc.startTrade(me.act === 3 ? "Repair" : "Shop")) {
                return false;
            }

            break;
        case "CainID":
            Misc.useMenu(0x0FB4);
            me.cancel();

            break;
    }

    return npc;
};

// 重写openStash函数（私服禁用TK开储物箱）
Town.openStash = function () {
    if (getUIFlag(0x19)) {
        return true;
    }

    var i, tick, stash,
        //telekinesis = me.classid === 1 && me.getSkill(43, 1);
        telekinesis = false;

    for (i = 0; i < 5; i += 1) {
        this.move("stash");

        stash = getUnit(2, 267);

        if (stash) {
            if (telekinesis) {
                Skill.cast(43, 0, stash);
            } else {
                Misc.click(0, 0, stash);
                //stash.interact();
            }

            tick = getTickCount();

            while (getTickCount() - tick < 1000) {
                if (getUIFlag(0x19)) {
                    delay(200);

                    return true;
                }

                delay(10);
            }
        }

        if (i > 1) {
            Packet.flash(me.gid);

            if (stash) {
                Pather.moveToUnit(stash);
            } else {
                this.move("stash");
            }

            telekinesis = false;
        }
    }

    return false;
};

// 回战斗场景不重新开蓝门
Town.visitTown = function () {
    if (me.inTown) {
        this.doChores();
        this.move("stash");

        return true;
    }

    var preArea = me.area,
        preAct = me.act;

    try { // not an essential function -> handle thrown errors
        this.goToTown();
    } catch (e) {
        return false;
    }

    this.doChores();

    if (me.act !== preAct) {
        this.goToTown(preAct);
    }

    this.move("portalspot");

    if (!Pather.usePortal(preArea, me.name)) { // this part is essential
        throw new Error("Town.visitTown: Failed to go back from town");
    }

    // if (Config.PublicMode) {
    //     Pather.makePortal();
    // }

    return true;
};


