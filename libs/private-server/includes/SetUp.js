/**
 *    @filename     SetUp.js
 *    @author       Black phoen1x
 *    @des          Setup functions for including files and loading threads.
 */

const PrivateServer = {
    entryScripts: ["D2BotMap", "D2BotLead", "D2BotFollow", "D2BotMule"],

    include: function () {
        const path = "private-server/includes/";
        let files = dopen("libs/" + path).getFiles();

        const priorList = ["Polyfill.js", "Color.js"];

        for (let file of priorList) {
            include(path + file);
        }

        if (typeof StarterConfig !== "undefined" && ["D2BotLead", "D2BotFollow"].includes(this.entryScript())) { // 入口线程
            files = ["OOGOverrides.js", "AutoMuleOverrides.js"];
        }

        for (let file of files) {
            !priorList.includes(file) && file.slice(file.length - 3) === ".js" && include(path + file);
        }

        return true;
    },

    load: function () {
        const path = "libs/private-server/tools/";

        load(path + "ToolsThread.js");

        if (Config.TownCheck || Config.TownHP || Config.TownMP) {
            load(path + "TownChicken.js");
        }


        if (Config.PublicMode) {
            load(path + "Party.js");
        }
    },

    setUp: function () {
        const entryScript = this.entryScript();

        if (entryScript) {
            switch (entryScript) {
                case "D2BotMap":
                    const hookText = new Text("", 400, 60, 2, 3, 2, false);
                    addEventListener("scriptmsg", (msg) => {
                        if (msg !== hookText.text) {
                            hookText.text = msg;
                        }
                    });
                    while (true) {
                        delay(1000);
                    }
                    break;
                default:
                    this.include();
                    break;
            }
            return true;
        }

        return false;
    },

    entryScript: function () {
        const entryScripts = this.entryScripts;
        let scriptName;
        for (let script of entryScripts) {
            scriptName = script + "PrivateServer.dbj";
            if (getScript(scriptName)) {
                return script;
            }
        }
        return false;
    }
};
