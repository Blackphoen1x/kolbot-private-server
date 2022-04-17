/**
 *    @filename     PatherOverrides.js
 *    @author       Black phoen1x
 *    @des          Specific overrided functions for private server.
 */

Pather.moveTo = function (x, y, retry, clearPath, pop, resetSpots) {
    if (me.dead) { // Abort if dead
        return false;
    }

    var i, path, adjustedNode, cleared,
        node = {x: x, y: y},
        fail = 0;
    let actionTownModeChanged;

    for (i = 0; i < this.cancelFlags.length; i += 1) {
        if (getUIFlag(this.cancelFlags[i])) {
            me.cancel();
        }
    }

    if (getDistance(me, x, y) < 2) {
        return true;
    }

    if (x === undefined || y === undefined) {
        throw new Error("moveTo: Function must be called with at least 2 arguments.");
    }

    if (typeof x !== "number" || typeof y !== "number") {
        throw new Error("moveTo: Coords must be numbers");
    }

    if (retry === undefined) {
        retry = 3;
    }

    if (clearPath === undefined) {
        clearPath = false;
    }

    if (pop === undefined) {
        pop = false;
    }

    if (resetSpots === undefined) {
        resetSpots = false;
    }

    this.useTeleport = this.teleport && !me.getState(139) && !me.getState(140) && !me.inTown &&
        ((me.classid === 1 && me.getSkill(54, 1)) || me.getStat(97, 54));

    // Teleport without calling getPath if the spot is close enough
    if (this.useTeleport && getDistance(me, x, y) <= this.teleDistance) {
        //Misc.townCheck();

        return this.teleportTo(x, y);
    }

    // Walk without calling getPath if the spot is close enough
    if (!this.useTeleport && (getDistance(me, x, y) <= 5 || (getDistance(me, x, y) <= 25 && !CollMap.checkColl(me, {
        x: x,
        y: y
    }, 0x1)))) {
        return this.walkTo(x, y);
    }

    this.walkDistance = me.inTown ? 3 : 5;

    path = getPath(me.area, x, y, me.x, me.y, this.useTeleport ? 1 : 0, this.useTeleport ? ([62, 63, 64].indexOf(me.area) > -1 ? 30 : this.teleDistance) : this.walkDistance);

    if (!path) {
        throw new Error("moveTo: Failed to generate path.");
    }

    path.reverse();

    if (pop) {
        path.pop();
    }

    PathDebug.drawPath(path);

    if (this.useTeleport && Config.TeleSwitch) {
        Misc.teleSwitch();
    }

    while (path.length > 0) {
        if (me.dead) { // Abort if dead
            return false;
        }

        for (i = 0; i < this.cancelFlags.length; i += 1) {
            if (getUIFlag(this.cancelFlags[i])) {
                me.cancel();
            }
        }

        node = path.shift();

        /* Right now getPath's first node is our own position so it's not necessary to take it into account
            This will be removed if getPath changes
        */
        if (getDistance(me, node) > 2) {
            // Make life in Maggot Lair easier
            if ([62, 63, 64].indexOf(me.area) > -1) {
                adjustedNode = this.getNearestWalkable(node.x, node.y, 15, 3, 0x1 | 0x4 | 0x800 | 0x1000);

                if (adjustedNode) {
                    node.x = adjustedNode[0];
                    node.y = adjustedNode[1];
                }
            }

            if (this.useTeleport ? this.teleportTo(node.x, node.y) : this.walkTo(node.x, node.y, (fail > 0 || me.inTown) ? 2 : 4)) {
                if (!me.inTown) {
                    if (this.recursion) {
                        this.recursion = false;

                        NodeAction.go({clearPath: clearPath});

                        if (getDistance(me, node.x, node.y) > 5) {
                            this.moveTo(node.x, node.y);
                        }

                        this.recursion = true;
                    }

                    Misc.townCheck();
                } else {
                    if (resetSpots) {
                        Town.resetSpotsByUnit();
                    }
                    if (Town.getPossibleTownModes().length !== 1) {
                        actionTownModeChanged = Town.setTownMode();
                        if (actionTownModeChanged) {
                            path = [];
                        }
                    }
                }
            } else {
                if (fail > 0 && !this.useTeleport && !me.inTown) {
                    // Don't go berserk on longer paths
                    if (!cleared) {
                        Attack.clear(5);

                        cleared = true;
                    }

                    if (fail > 1 && me.getSkill(143, 1)) {
                        Skill.cast(143, 0, node.x, node.y);
                    }
                }

                // Reduce node distance in new path
                path = getPath(me.area, x, y, me.x, me.y, this.useTeleport ? 1 : 0, this.useTeleport ? rand(25, 35) : rand(10, 15));
                fail += 1;

                if (!path) {
                    throw new Error("moveTo: Failed to generate path.");
                }

                path.reverse();
                PathDebug.drawPath(path);

                if (pop) {
                    path.pop();
                }

                print("move retry " + fail);

                if (fail > 0 && fail >= retry) {
                    break;
                }
            }
        }

        delay(5);
    }

    if (this.useTeleport && Config.TeleSwitch) {
        Precast.weaponSwitch(Misc.oldSwitch);
    }

    PathDebug.removeHooks();

    return getDistance(me, node.x, node.y) < 5;
};

Pather.walkTo = function (x, y, minDist) {
    while (!me.gameReady) {
        delay(100);
    }

    if (minDist === undefined) {
        minDist = me.inTown ? 2 : 4;
    }

    var i, angle, angles, nTimer, whereToClick, tick,
        nFail = 0,
        attemptCount = 0;

    // Stamina handler and Charge
    if (!me.inTown && !me.dead) {
        if (me.runwalk === 1 && me.stamina / me.staminamax * 100 <= 20) {
            me.runwalk = 0;
        }

        if (me.runwalk === 0 && me.stamina / me.staminamax * 100 >= 50) {
            me.runwalk = 1;
        }

        if (Config.Charge && me.classid === 3 && me.mp >= 9 && getDistance(me.x, me.y, x, y) > 8 && Skill.setSkill(107, 1)) {
            if (Config.Vigor) {
                Skill.setSkill(115, 0);
            }

            Misc.click(0, 1, x, y);

            while (me.mode !== 1 && me.mode !== 5 && !me.dead) {
                delay(40);
            }
        }
    }

    if (me.inTown && me.runwalk === 0) {
        me.runwalk = 1;
    }

    if (me.inTown && Town.kickBarriers(5) && getDistance(me.x, me.y, x, y) <= minDist) {
        return true;
    }

    while (getDistance(me.x, me.y, x, y) > minDist && !me.dead) {
        if (me.classid === 3 && Config.Vigor) {
            Skill.setSkill(115, 0);
        }

        if (this.openDoors(x, y) && getDistance(me.x, me.y, x, y) <= minDist) {
            return true;
        }

        Misc.click(0, 0, x, y);

        attemptCount += 1;
        nTimer = getTickCount();

        ModeLoop:
            while (me.mode !== 2 && me.mode !== 3 && me.mode !== 6) {
                if (me.dead) {
                    return false;
                }

                if ((getTickCount() - nTimer) > 500) {
                    nFail += 1;

                    if (nFail >= 3) {
                        return false;
                    }

                    angle = Math.atan2(me.y - y, me.x - x);
                    angles = [Math.PI / 2, -Math.PI / 2];

                    for (i = 0; i < angles.length; i += 1) {
                        // TODO: might need rework into getnearestwalkable
                        whereToClick = {
                            x: Math.round(Math.cos(angle + angles[i]) * 5 + me.x),
                            y: Math.round(Math.sin(angle + angles[i]) * 5 + me.y)
                        };

                        if (Town.keyBarrierSpot(whereToClick.x, whereToClick.y) || Attack.validSpot(whereToClick.x, whereToClick.y)) {
                            Misc.click(0, 0, whereToClick.x, whereToClick.y);

                            tick = getTickCount();

                            while (getDistance(me, whereToClick) > 2 && getTickCount() - tick < 1000) {
                                delay(40);
                            }

                            break;
                        }
                    }

                    break ModeLoop;
                }

                delay(10);
            }

        // Wait until we're done walking - idle or dead
        while (getDistance(me.x, me.y, x, y) > minDist && me.mode !== 1 && me.mode !== 5 && !me.dead) {
            delay(10);
        }

        if (attemptCount >= 3) {
            return false;
        }
    }

    return !me.dead && getDistance(me.x, me.y, x, y) <= minDist;
};

// 重写Pather的useWaypoint函数，用于解决私服城内绕路踢桶问题
Pather.useWaypoint = function useWaypoint(targetArea, check) {
    switch (targetArea) {
        case undefined:
            throw new Error("useWaypoint: Invalid targetArea parameter: " + targetArea);
        case null:
        case "random":
            check = true;

            break;
        default:
            if (typeof targetArea !== "number") {
                throw new Error("useWaypoint: Invalid targetArea parameter");
            }

            if (this.wpAreas.indexOf(targetArea) < 0) {
                throw new Error("useWaypoint: Invalid area");
            }
            check = true; //需要点开界面检查

            break;
    }

    var i, tick, wp, townTargetAreas = [1, 40, 75, 103, 109];

    for (i = 0; i < 12; i += 1) {
        if (me.area === targetArea || me.dead) {
            break;
        }

        if (me.inTown) {
            Town.move("waypoint");
        }

        wp = getUnit(2, "waypoint");

        if (wp && wp.area === me.area) {
            if (!me.inTown && getDistance(me, wp) > 7) {
                this.moveToUnit(wp);
            }

            if (check || Config.WaypointMenu) {
                if (getDistance(me, wp) > 5) {
                    this.moveToUnit(wp);
                }

                !getUIFlag(0x14) && Misc.click(0, 0, wp);

                tick = getTickCount();

                while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
                    if (getUIFlag(0x14)) { // Waypoint screen is open
                        delay(500);

                        switch (targetArea) {
                            case "random":
                                while (true) {
                                    targetArea = this.wpAreas[rand(0, this.wpAreas.length - 1)];

                                    // get a valid wp, avoid towns
                                    if ([1, 40, 75, 103, 109].indexOf(targetArea) === -1 && getWaypoint(this.wpAreas.indexOf(targetArea))) {
                                        break;
                                    }

                                    delay(5);
                                }

                                break;
                            case null:
                                me.cancel();

                                return true;
                        }

                        if (!getWaypoint(this.wpAreas.indexOf(targetArea))) {
                            me.cancel();
                            me.overhead("Trying to get the waypoint");

                            if (this.getWP(targetArea)) {
                                return true;
                            }

                            throw new Error("Pather.useWaypoint: Failed to go to waypoint");
                        }

                        break;
                    }

                    delay(10);
                }

                if (!getUIFlag(0x14)) {
                    print("waypoint retry " + (i + 1));
                    this.moveTo(me.x + rand(-5, 5), me.y + rand(-5, 5));
                    Packet.flash(me.gid);

                    continue;
                }
            }

            if (!check || getUIFlag(0x14)) {
                delay(200);
                wp.interact(targetArea);

                tick = getTickCount();

                while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
                    if (me.area === targetArea) {
                        delay(100);

                        return true;
                    }

                    delay(10);
                }

                me.cancel(); // In case lag causes the wp menu to stay open
            }

            Packet.flash(me.gid);

            if (i > 1) { // Activate check if we fail direct interact twice
                check = true;
            }
        } else {
            Packet.flash(me.gid);
        }

        delay(200 + me.ping);
    }

    if (me.area === targetArea) {
        return true;
    }

    throw new Error("useWaypoint: Failed to use waypoint");
};

// 重写Pather的usePortal函数（私服禁用TK portal），用于解决私服城内绕路踢桶问题
Pather.usePortal = function (targetArea, owner, unit) {
    if (targetArea && me.area === targetArea) {
        return true;
    }

    me.cancel();

    var i, tick, portal, useTK,
        preArea = me.area;

    for (i = 0; i < 10; i += 1) {
        if (me.dead) {
            break;
        }

        if (i > 0 && owner && me.inTown) {
            Town.move("portalspot");
        }

        portal = unit ? copyUnit(unit) : this.getPortal(targetArea, owner);

        if (portal) {
            if (i === 0) {
                //useTK = me.classid === 1 && me.getSkill(43, 1) && me.inTown && portal.getParent();
                useTK = false;
            }

            if (portal.area === me.area) {
                if (useTK) {
                    if (getDistance(me, portal) > 13) {
                        Attack.getIntoPosition(portal, 13, 0x4);
                    }

                    Skill.cast(43, 0, portal);
                } else {
                    if (getDistance(me, portal) > 5) {
                        this.moveToUnit(portal);
                    }

                    if (i < 2) {
                        sendPacket(1, 0x13, 4, 0x2, 4, portal.gid);
                    } else {
                        Misc.click(0, 0, portal);
                    }
                }
            }

            if (portal.classid === 298 && portal.mode !== 2) { // Portal to/from Arcane
                Misc.click(0, 0, portal);

                tick = getTickCount();

                while (getTickCount() - tick < 2000) {
                    if (portal.mode === 2 || me.area === 74) {
                        break;
                    }

                    delay(10);
                }
            }

            tick = getTickCount();

            while (getTickCount() - tick < Math.max(Math.round((i + 1) * 1000 / (i / 5 + 1)), me.ping * 2)) {
                if (me.area !== preArea) {
                    delay(100);

                    return true;
                }

                delay(10);
            }

            if (i > 1) {
                Packet.flash(me.gid);

                useTK = false;
            }
        } else {
            Packet.flash(me.gid);
        }

        delay(200 + me.ping);
    }

    return targetArea ? me.area === targetArea : me.area !== preArea;
};

// 重写Pather的moveToExit函数，用于解决A1出城门踢桶问题
Pather.moveToExit = function (targetArea, use, clearPath) {
    var i, j, area, exits, targetRoom, dest, currExit,
        areas = [];

    if (targetArea instanceof Array) {
        areas = targetArea;
    } else {
        areas.push(targetArea);
    }

    for (i = 0; i < areas.length; i += 1) {
        area = getArea();

        if (!area) {
            throw new Error("moveToExit: error in getArea()");
        }

        exits = area.exits;

        if (!exits || !exits.length) {
            return false;
        }

        for (j = 0; j < exits.length; j += 1) {
            currExit = {
                x: exits[j].x,
                y: exits[j].y,
                type: exits[j].type,
                target: exits[j].target,
                tileid: exits[j].tileid
            };

            if (currExit.target === areas[i]) {
                dest = this.getNearestWalkable(currExit.x, currExit.y, 5, 1);

                if (!dest) {
                    return false;
                }

                if (me.inTown) {
                    if (!Town.act[me.act - 1].initialized) {
                        Town.initialize();
                    }
                    Town.act[me.act - 1].spot.exit = [dest[0], dest[1]];
                    if (!Town.move("exit")) {
                        return false;
                    }
                } else {
                    if (!this.moveTo(dest[0], dest[1], 3, clearPath)) {
                        return false;
                    }
                }

                /* i < areas.length - 1 is for crossing multiple areas.
                    In that case we must use the exit before the last area.
                */
                if (use || i < areas.length - 1) {
                    switch (currExit.type) {
                        case 1: // walk through
                            targetRoom = this.getNearestRoom(areas[i]);

                            if (targetRoom) {
                                this.moveTo(targetRoom[0], targetRoom[1]);
                            } else {
                                // might need adjustments
                                return false;
                            }

                            break;
                        case 2: // stairs
                            if (!this.useUnit(5, currExit.tileid, areas[i])) {
                                return false;
                            }

                            break;
                    }
                }

                break;
            }
        }
    }

    if (use) {
        return typeof targetArea === "object" ? me.area === targetArea[targetArea.length - 1] : me.area === targetArea;
    }

    return true;
};

