/**
 *    @filename     Color.js
 *    @author       Black phoen1x
 *    @des          To fix console color issue due to UTF-8 charset does not work with 113d-core15 version
 */

let Color = {
    y: "ÿ",
    white: "ÿc0",
    red: "ÿc1",
    lGreen: "ÿc2",
    blue: "ÿc3",
    dGold: "ÿc4",
    gray: "ÿc5",
    black: "ÿc6",
    lGold: "ÿc7",
    orange: "ÿc8",
    yellow: "ÿc9",
    dGreen: "ÿc:",
    purple: "ÿc;",
    green: "ÿc<"
};

Misc.getItemDesc = function (unit) {
    var i, desc,
        stringColor = "";

    desc = unit.description;

    if (!desc) {
        return "";
    }

    desc = desc.split("\n");

    // Lines are normally in reverse. Add color tags if needed and reverse order.
    for (i = 0; i < desc.length; i += 1) {
        desc[i] = desc[i].replace("?", "ÿ", "g");
        if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
            desc.splice(i, 1);

            i -= 1;
        } else {
            if (desc[i].match(/^(y|ÿ)c/)) {
                stringColor = desc[i].substring(0, 3);
            } else {
                desc[i] = stringColor + desc[i];
            }
        }

        desc[i] = desc[i].replace(/(y|ÿ)c([0-9!"+<;.*])/g, "\\xffc$2");
    }

    if (desc[desc.length - 1]) {
        desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
    }

    desc = desc.reverse().join("\n");

    return desc;
};

if (isIncluded("MuleLogger.js")) {
    MuleLogger.getItemDesc = function (unit, logIlvl) {
        var i, desc,
            stringColor = "";

        if (logIlvl === undefined) {
            logIlvl = this.LogItemLevel;
        }

        desc = unit.description.split("\n");

        // Lines are normally in reverse. Add color tags if needed and reverse order.
        for (i = 0; i < desc.length; i += 1) {
            desc[i] = desc[i].replace("?", "ÿ", "g");
            if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
                desc.splice(i, 1);

                i -= 1;
            } else {
                if (desc[i].match(/^(y|ÿ)c/)) {
                    stringColor = desc[i].substring(0, 3);
                } else {
                    desc[i] = stringColor + desc[i];
                }
            }

            desc[i] = desc[i].replace(/(y|ÿ)c([0-9!"+<;.*])/g, "\\xffc$2").replace("\xFF", "\\xff", "g");
        }

        if (logIlvl && desc[desc.length - 1]) {
            desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
        }

        desc = desc.reverse().join("\\n");

        return desc;
    };
}

