/**
 *    @file        townConfig.js
 *    @author      Black phoen1x
 *    @desc        custom config for town NPC location and pathes
 */

const townConfig = {
    act1: { // ["stash", "warriv", "cain", NPC.Kashya, NPC.Akara, NPC.Charsi, NPC.Gheed, "portalspot", "waypoint",
        // "exit"]

    },
    act2: { // [NPC.Fara, "cain", NPC.Lysander, NPC.Greiz, NPC.Elzix, "palace", "sewers", "meshif", NPC.Drognan, "atma",
        //  "warriv", "portalspot", "stash", "waypoint", "exit"];

    },
    act3: { // ["meshif", NPC.Hratli, NPC.Ormus, NPC.Asheara, NPC.Alkor, "cain", "stash", "portalspot", "waypoint", "exit"]
        extraSpots: {
            portalspot2: [5168, 5088]
        },
        townMode1: {
            resetSpots: {},
            keyBarrierCoords: [
                [5131, 5127], // breakable barriers point on path
            ],
            guidedAstar: [
                {
                    oneSide: ["meshif", NPC.Hratli, NPC.Ormus, "portalspot2"],
                    otherSide: ["cain", "stash", "portalspot", "waypoint", "exit"],
                    flags: [
                        [5151, 5078],
                        [5146, 5067]
                    ]
                },
            ]
        },
        townMode2: {}
    },
    act4: { // ["cain", NPC.Halbu, NPC.Tyrael, NPC.Jamella, "stash", "portalspot", "waypoint"]
    },
    act5: {},
};
