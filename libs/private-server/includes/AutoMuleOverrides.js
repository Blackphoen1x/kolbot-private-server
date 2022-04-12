/**
 *    @filename     AutoMuleOverrides.js
 *    @author       Black phoen1x
 *    @des          Overrided AutoMule for muling in a given realm.
 */

if ("undefined" !== typeof AutoMule) {
    AutoMule.outOfGameCheck = function () {
        if (!this.check && !this.torchAnniCheck) {
            return false;
        }

        StarterConfig && StarterConfig.muleRealm !== StarterConfig.MFRealm && ControlAction.changeRealm(StarterConfig.muleRealm);

        var i, control, muleObj,
            stopCheck = false,
            muleInfo = {status: ""},
            failCount = 0;

        muleObj = this.getMule();

        if (!muleObj) {
            return false;
        }

        function MuleCheckEvent(mode, msg) {
            if (mode === 10) {
                muleInfo = JSON.parse(msg);
            }
        }

        addEventListener("copydata", MuleCheckEvent);
        D2Bot.printToConsole("Starting " + (this.torchAnniCheck === 2 ? "anni" : this.torchAnniCheck === 1 ? "torch" : "") + " mule profile: " + muleObj.muleProfile, 7);

        MainLoop:
            while (true) {
                // If nothing received our copy data start the mule profile
                if (!sendCopyData(null, muleObj.muleProfile, 10, JSON.stringify({
                    profile: me.profile,
                    mode: this.torchAnniCheck || 0
                }))) {
                    D2Bot.start(muleObj.muleProfile);
                }

                delay(1000);

                switch (muleInfo.status) {
                    case "loading":
                        if (!stopCheck && muleObj.stopProfile && me.profile.toLowerCase() !== muleObj.stopProfile.toLowerCase()) {
                            D2Bot.stop(muleObj.stopProfile);

                            stopCheck = true;
                        }

                        failCount += 1;

                        break;
                    case "busy":
                    case "begin":
                        D2Bot.printToConsole("Mule profile is busy.", 9);

                        break MainLoop;
                    case "ready":
                        control = getControl(6, 652, 469, 120, 20);

                        if (control) {
                            delay(200);
                            control.click();
                        }

                        delay(2000);

                        this.inGame = true;
                        me.blockMouse = true;

                        try {
                            joinGame(muleObj.muleGameName[0], muleObj.muleGameName[1]);
                        } catch (joinError) {

                        }

                        me.blockMouse = false;

                        // Untested change 11.Feb.14.
                        for (i = 0; i < 8; i += 1) {
                            delay(1000);

                            if (me.ingame && me.gameReady) {
                                break MainLoop;
                            }
                        }

                        break;
                    default:
                        failCount += 1;

                        break;
                }

                if (failCount >= 60) {
                    D2Bot.printToConsole("No response from mule profile.", 9);

                    break;
                }
            }

        removeEventListener("copydata", MuleCheckEvent);

        while (me.ingame) {
            delay(1000);
        }

        this.inGame = false;
        this.check = false;
        this.torchAnniCheck = false;

        StarterConfig && StarterConfig.muleRealm !== StarterConfig.MFRealm && ControlAction.changeRealm(StarterConfig.MFRealm);

        // No response - stop mule profile
        if (failCount >= 60) {
            D2Bot.stop(muleObj.muleProfile);
            delay(1000);
        }

        if (stopCheck && muleObj.stopProfile) {
            D2Bot.start(muleObj.stopProfile);
        }

        return true;
    };
}
