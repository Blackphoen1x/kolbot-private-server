/**
 *    @filename     OOGOverrides.js
 *    @author       Black phoen1x
 *    @des          Added a function to change realm at character select location.
 */

ControlAction.changeRealm = function (realmNumber) {
    this.locationAction = function (location) {
        var i, string, text;

        MainSwitch:
            switch (location) {
                case 0:
                    break;
                case 1:	// Lobby
                    if (me.realm !== formerRealm) {
                        complete = true;
                        break;
                    }
                    ControlAction.click(6, 693, 490, 80, 20); // quit
                    break;
                case 2: // Waiting In Line
                    D2Bot.updateStatus("Waiting...");
                    locationTimeout(StarterConfig.WaitInLineTimeout * 1e3, location);
                    ControlAction.click(6, 433, 433, 96, 32);

                    break;
                case 3: // Lobby Chat
                case 4: // Create Game
                case 5: // Join Game
                case 6: // Ladder
                case 7: // Channel List
                    ControlAction.click(6, 693, 490, 80, 20); // quit
                    break;
                case 8: // Main Menu
                case 9: // Login
                case 12: // Character Select
                case 18: // D2 Splash
                    // Single Player screen fix
                    if (getLocation() === 12 && !getControl(4, 626, 100, 151, 44)) {
                        ControlAction.click(6, 33, 572, 128, 35);

                        break;
                    }

                    if (getLocation() === 12 && me.realm === formerRealm) {
                        ControlAction.click(6, 609, 113, 182, 30);
                        locationTimeout(2000, location);
                        break;
                    }

                    if (firstLogin && getLocation() === 9) { // multiple realm botting fix in case of R/D or disconnect
                        ControlAction.click(6, 33, 572, 128, 35);
                    }

                    D2Bot.updateStatus("Logging In");

                    try {
                        login(me.profile);
                    } catch (e) {
                        print(e + " " + getLocation());
                    }

                    break;
                case 10: // Login Error
                    string = "";
                    text = ControlAction.getText(4, 199, 377, 402, 140);

                    if (text) {
                        for (i = 0; i < text.length; i += 1) {
                            string += text[i];

                            if (i !== text.length - 1) {
                                string += " ";
                            }
                        }

                        switch (string) {
                            case getLocaleString(5207):
                                D2Bot.updateStatus("Invalid Password");
                                D2Bot.printToConsole("Invalid Password");

                                break;
                            case getLocaleString(5208):
                                D2Bot.updateStatus("Invalid Account");
                                D2Bot.printToConsole("Invalid Account");

                                break;
                            case getLocaleString(5202): // cd key intended for another product
                            case getLocaleString(10915): // lod key intended for another product
                                D2Bot.updateStatus("Invalid CDKey");
                                D2Bot.printToConsole("Invalid CDKey: " + gameInfo.mpq, 6);
                                D2Bot.CDKeyDisabled();

                                if (gameInfo.switchKeys) {
                                    ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                    D2Bot.restart(true);
                                } else {
                                    D2Bot.stop();
                                }

                                break;
                            case getLocaleString(5199):
                                D2Bot.updateStatus("Disabled CDKey");
                                D2Bot.printToConsole("Disabled CDKey: " + gameInfo.mpq, 6);
                                D2Bot.CDKeyDisabled();

                                if (gameInfo.switchKeys) {
                                    ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                    D2Bot.restart(true);
                                } else {
                                    D2Bot.stop();
                                }

                                break;
                            case getLocaleString(10913):
                                D2Bot.updateStatus("Disabled LoD CDKey");
                                D2Bot.printToConsole("Disabled LoD CDKey: " + gameInfo.mpq, 6);
                                D2Bot.CDKeyDisabled();

                                if (gameInfo.switchKeys) {
                                    ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                    D2Bot.restart(true);
                                } else {
                                    D2Bot.stop();
                                }

                                break;
                            case getLocaleString(5347):
                                D2Bot.updateStatus("Disconnected");
                                D2Bot.printToConsole("Disconnected");
                                ControlAction.click(6, 335, 412, 128, 35);

                                break MainSwitch;
                            default:
                                D2Bot.updateStatus("Login Error");
                                D2Bot.printToConsole("Login Error - " + string);

                                if (gameInfo.switchKeys) {
                                    ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                    D2Bot.restart(true);
                                } else {
                                    D2Bot.stop();
                                }

                                break;
                        }
                    }

                    ControlAction.click(6, 335, 412, 128, 35);

                    while (true) {
                        delay(1000);
                    }

                    break;
                case 11: // Unable To Connect
                    D2Bot.updateStatus("Unable To Connect");

                    if (connectFail) {
                        ControlAction.timeoutDelay("Unable to Connect", StarterConfig.UnableToConnectDelay * 6e4);

                        connectFail = false;
                    }

                    if (!ControlAction.click(6, 335, 450, 128, 35)) {
                        break;
                    }

                    connectFail = true;

                    break;
                case 13: // Realm Down - Character Select screen
                    D2Bot.updateStatus("Realm Down");
                    delay(1000);

                    if (!ControlAction.click(6, 33, 572, 128, 35)) {
                        break;
                    }

                    updateCount();
                    ControlAction.timeoutDelay("Realm Down", StarterConfig.RealmDownDelay * 6e4);
                    D2Bot.CDKeyRD();

                    if (gameInfo.switchKeys && !gameInfo.rdBlocker) {
                        D2Bot.printToConsole("Realm Down - Changing CD-Key");
                        ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                        D2Bot.restart(true);
                    } else {
                        D2Bot.printToConsole("Realm Down - Restart");
                        D2Bot.restart();
                    }

                    break;
                case 14: // Character Select / Main Menu - Disconnected
                    D2Bot.updateStatus("Disconnected");
                    delay(500);
                    ControlAction.click(6, 351, 337, 96, 32);

                    break;
                case 16: // Character Select - Please Wait popup
                    if (!locationTimeout(StarterConfig.PleaseWaitTimeout * 1e3, location)) {
                        ControlAction.click(6, 351, 337, 96, 32);
                    }

                    break;
                case 17: // Lobby - Lost Connection - just click okay, since we're toast anyway
                    delay(1000);
                    ControlAction.click(6, 351, 337, 96, 32);

                    break;
                case 19: // Login - Cdkey In Use
                    D2Bot.printToConsole(gameInfo.mpq + " is in use by " + ControlAction.getText(4, 158, 310, 485, 40), 6);
                    D2Bot.CDKeyInUse();

                    if (gameInfo.switchKeys) {
                        ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                        D2Bot.restart(true);
                    } else {
                        ControlAction.click(6, 335, 450, 128, 35);
                        ControlAction.timeoutDelay("CD-Key in use", StarterConfig.CDKeyInUseDelay * 6e4);
                    }

                    break;
                case 20: // Single Player - Select Difficulty
                    break;
                case 21: // Main Menu - Connecting
                    if (!locationTimeout(StarterConfig.ConnectingTimeout * 1e3, location)) {
                        ControlAction.click(6, 330, 416, 128, 35);
                    }

                    break;
                case 22: // Login - Invalid Cdkey (classic or xpac)
                    text = ControlAction.getText(4, 162, 270, 477, 50);
                    string = "";

                    if (text) {
                        for (i = 0; i < text.length; i += 1) {
                            string += text[i];

                            if (i !== text.length - 1) {
                                string += " ";
                            }
                        }
                    }

                    switch (string) {
                        case getLocaleString(10914):
                            D2Bot.printToConsole(gameInfo.mpq + " LoD key in use by " + ControlAction.getText(4, 158, 310, 485, 40), 6);
                            D2Bot.CDKeyInUse();

                            if (gameInfo.switchKeys) {
                                ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                D2Bot.restart(true);
                            } else {
                                ControlAction.click(6, 335, 450, 128, 35);
                                ControlAction.timeoutDelay("LoD key in use", StarterConfig.CDKeyInUseDelay * 6e4);
                            }

                            break;
                        default:
                            if (gameInfo.switchKeys) {
                                D2Bot.printToConsole("Invalid CD-Key");
                                ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                D2Bot.restart(true);
                            } else {
                                ControlAction.click(6, 335, 450, 128, 35);
                                ControlAction.timeoutDelay("Invalid CD-Key", StarterConfig.CDKeyInUseDelay * 6e4);
                            }

                            break;
                    }

                    break;
                case 23: // Character Select - Connecting
                case 42: // Empty character screen
                    string = "";
                    text = ControlAction.getText(4, 45, 318, 531, 140);

                    if (text) {
                        for (i = 0; i < text.length; i += 1) {
                            string += text[i];

                            if (i !== text.length - 1) {
                                string += " ";
                            }
                        }

                        if (string === getLocaleString(11161)) { // CDKey disabled from realm play
                            D2Bot.updateStatus("Realm Disabled CDKey");
                            D2Bot.printToConsole("Realm Disabled CDKey: " + gameInfo.mpq, 6);
                            D2Bot.CDKeyDisabled();

                            if (gameInfo.switchKeys) {
                                ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                                D2Bot.restart(true);
                            } else {
                                D2Bot.stop();
                            }
                        }
                    }

                    if (!locationTimeout(StarterConfig.ConnectingTimeout * 1e3, location)) {
                        ControlAction.click(6, 33, 572, 128, 35);

                        if (gameInfo.rdBlocker) {
                            D2Bot.restart();
                        }
                    }

                    break;
                case 24: // Server Down - not much to do but wait..
                    break;
                case 25: // Lobby - Please Wait
                    if (!locationTimeout(StarterConfig.PleaseWaitTimeout * 1e3, location)) {
                        ControlAction.click(6, 351, 337, 96, 32);
                    }

                    break;
                case 26: // Lobby - Game Name Exists
                    ControlAction.click(6, 533, 469, 120, 20);

                    gameCount += 1;
                    lastGameStatus = "ready";

                    break;
                case 27: // Gateway Select
                    ControlAction.click(6, 436, 538, 96, 32);

                    break;
                case 28: // Lobby - Game Does Not Exist
                    D2Bot.printToConsole("Game doesn't exist");

                    if (gameInfo.rdBlocker) {
                        D2Bot.printToConsole(gameInfo.mpq + " is probably flagged.", 6);

                        if (gameInfo.switchKeys) {
                            ControlAction.timeoutDelay("Key switch delay", StarterConfig.SwitchKeyDelay * 1000);
                            D2Bot.restart(true);
                        }
                    } else {
                        locationTimeout(StarterConfig.GameDoesNotExistTimeout * 1e3, location);
                    }

                    lastGameStatus = "ready";

                    break;
                case 38: // Game is full
                    // doesn't happen when making
                    break;
                case 43:
                    ControlAction.click(4, 461, 230, 320, 70, 621, 245 + 30 * (realmNumber - 1)); //点击国度标签
                    ControlAction.click(6, 495, 438, 96, 32);
                    locationTimeout(2000, location);
                    break;
                default:
                    if (location !== undefined) {
                        D2Bot.printToConsole("Unhandled location " + location);
                        //takeScreenshot();
                        delay(500);
                        D2Bot.restart();
                    }

                    break;
            }
    };

    let complete = false;
    const formerRealm = me.realm;
    me.blockMouse = true;
    D2Bot.updateStatus("Changing Realm");

    const tick = getTickCount();
    while (!complete) {
        if (getTickCount - tick > 20 * 1e3) {
            throw new Error("Failed to change realm.");
        }
        this.locationAction(getLocation());
        delay(1000);
    }

    me.blockMouse = false;
    return true;
};
