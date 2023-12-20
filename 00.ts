type creature = {
    creatureId?: number;
    color?: number;
    type?: number;
    isVisible?: boolean;
    creatureX?: number;
    creatureY?: number;
    creatureVx?: number;
    creatureVy?: number;
};

type drone = {
    droneId: number;
    droneX: number;
    droneY: number;
    emergency: number;
    battery: number;
    holdScanned: number[];
    radarBlip: radar[];
    droneVisibility: number;
    visibleMonsters: Map<number, creature>;
    firstMove: boolean;
    goSurface: boolean;
}

type player = {
    score?: number;
    nbCreatureScanned?: number;
    creatureScanned?: number[];
    dronesCount?: number;
    drones?: drone[];
};

type radar = {
    dir?: string;
    creatureId?: number;
}

type tuple = {
    nbx: number;
    nby: number;
};

type fixedValues = {
    firstMove: boolean;
    goSurface: boolean;
    countLight: number;
    droneVisibility: number;
}

const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

/************************************************/

const creatureCount: number = parseInt(readline());

let fishies = new Map<number, creature>();
let monsters = new Map<number, creature>();

for (let i = 0; i < creatureCount; i++) {
    let inputs: string[] = readline().split(' ');
    let newCreature: creature = {
        creatureId: parseInt(inputs[0]),
        color: parseInt(inputs[1]),
        type: parseInt(inputs[2]),
        isVisible: false,
    }
    if (newCreature.type == -1)
        monsters.set(newCreature.creatureId, newCreature);
    else
        fishies.set(newCreature.creatureId, newCreature);
}

let player: player = { drones: [], creatureScanned: [] };
let foe: player = { drones: [], creatureScanned: [] };
let fixedValues: fixedValues[] = [{
    firstMove: true,
    goSurface: false,
    countLight: 4,
    droneVisibility: 800,
}, {
    firstMove: true,
    goSurface: false,
    countLight: 4,
    droneVisibility: 800,
}];

/*                 game loop					*/

while (true) {
    monsters.forEach((elem) => { elem.isVisible = false; });
    fishies.forEach((elem) => { elem.isVisible = false; });

    player.score = parseInt(readline());
    foe.score = parseInt(readline());

    player.nbCreatureScanned = parseInt(readline());
    for (let i = 0; i < player.nbCreatureScanned; i++) {
        player.creatureScanned[i] = parseInt(readline());
    }

    foe.nbCreatureScanned = parseInt(readline());
    for (let i = 0; i < foe.nbCreatureScanned; i++) {
        foe.creatureScanned[i] = parseInt(readline());
    }

    player.dronesCount = parseInt(readline());
    for (let i = 0; i < player.dronesCount; i++) {
        let inputs: string[] = readline().split(' ');
        player.drones[i] = {
            droneId: parseInt(inputs[0]),
            droneX: parseInt(inputs[1]),
            droneY: parseInt(inputs[2]),
            emergency: parseInt(inputs[3]),
            battery: parseInt(inputs[4]),
            holdScanned: [],
            radarBlip: [],
            firstMove: fixedValues[i].firstMove,
            goSurface: fixedValues[i].goSurface,
            droneVisibility: fixedValues[i].droneVisibility,
            visibleMonsters: new Map<number, creature>(),
        };
    }

    foe.dronesCount = parseInt(readline());
    for (let i = 0; i < foe.dronesCount; i++) {
        let inputs: string[] = readline().split(' ');
        foe.drones[i] = {
            droneId: parseInt(inputs[0]),
            droneX: parseInt(inputs[1]),
            droneY: parseInt(inputs[2]),
            emergency: parseInt(inputs[3]),
            battery: parseInt(inputs[4]),
            holdScanned: [],
            radarBlip: [],
            firstMove: undefined,
            goSurface: undefined,
            visibleMonsters: undefined,
            droneVisibility: undefined,

        };
    }

    const droneScanCount: number = parseInt(readline());
    for (let i = 0; i < droneScanCount; i++) {
        let inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
        player.drones.forEach((element) => {
            if (droneId == element.droneId)
                element.holdScanned.push(creatureId);
        })
        foe.drones.forEach((element) => {
            if (droneId == element.droneId)
                element.holdScanned.push(creatureId);
        })
    }

    const visibleCreatureCount: number = parseInt(readline());
    for (let i = 0; i < visibleCreatureCount; i++) {
        var inputs: string[] = readline().split(' ');
        const creatureId: number = parseInt(inputs[0]);
        let element: creature = {};
        if (fishies.has(creatureId)) {
            element.isVisible = true;
            element.creatureX = parseInt(inputs[1]);
            element.creatureY = parseInt(inputs[2]);
            element.creatureVx = parseInt(inputs[3]);
            element.creatureVy = parseInt(inputs[4]);
            fishies.set(creatureId, element);
        }
        else if (monsters.has(creatureId)) {
            element.isVisible = true;
            element.creatureX = parseInt(inputs[1]);
            element.creatureY = parseInt(inputs[2]);
            element.creatureVx = parseInt(inputs[3]);
            element.creatureVy = parseInt(inputs[4]);
            monsters.set(creatureId, element);
            if (Math.abs(element.creatureX - player.drones[0].droneX) <= player.drones[0].droneVisibility &&
                Math.abs(element.creatureY - player.drones[0].droneY) <= player.drones[0].droneVisibility) {
                player.drones[0].visibleMonsters.set(element.creatureId, element);
                console.error("goes for drone ID", player.drones[0].droneId);
            }
            if (Math.abs(element.creatureX - player.drones[1].droneX) <= player.drones[1].droneVisibility &&
                Math.abs(element.creatureY - player.drones[1].droneY) <= player.drones[1].droneVisibility) {
                player.drones[1].visibleMonsters.set(element.creatureId, element);
                console.error("goes for drone ID", player.drones[1].droneId);

            }
        }
    }

    const radarBlipCount: number = parseInt(readline());
    for (let i = 0; i < radarBlipCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        let newBlip: radar = {
            creatureId: parseInt(inputs[1]),
            dir: inputs[2]
        };
        player.drones.forEach((elem) => {
            if (droneId == elem.droneId)
                elem.radarBlip.push(newBlip);
        })
    }

    let x: number;
    let y: number;
    let light: number = 0;

    for (let i = 0; i < player.dronesCount; i++) {
        if (player.drones[i].firstMove == true) {
            if (player.drones[i].droneX < 5000) {
                x = 2500;
                y = 3725;
                if (player.drones[i].droneX > 2400 && player.drones[i].droneY > 3100) {
                    light = 1;
                    fixedValues[i].goSurface = true;
                    fixedValues[i].firstMove = false;
                }
            }
            else {
                x = 7500;
                y = 3725;
                if (player.drones[i].droneX > 7400 && player.drones[i].droneY > 3100) {
                    light = 1;
                    fixedValues[i].goSurface = true;
                    fixedValues[i].firstMove = false;
                }
            }
        }
        else if (player.drones[i].goSurface == true) {
            x = player.drones[i].droneX;
            y = 500;
            if (player.drones[i].droneY == 500)
                fixedValues[i].goSurface = false;
        }
        else {

            if (player.drones[i].droneY < 8500) {
                y = 9000;
                x = player.drones[i].droneX;
            }
            else if (player.drones[i].droneY >= 8500) {
               fixedValues[i].goSurface = true;
            }
        }
        if (player.drones[i].firstMove == false && player.drones[i].droneY > 5000) {
            fixedValues[i].countLight--;
            if (fixedValues[i].countLight == 0) {
                fixedValues[i].countLight = 3;
                light = 1;
            }
        }
        console.error(i, "light = ", fixedValues[i].countLight);

        /*override previous instruction bcs you should avoid the big fishie*/
        if (player.drones[i].visibleMonsters.size > 0) {
            light = 0;
            console.error("drone ID", player.drones[i].droneId, " should get moving");
            player.drones[i].visibleMonsters.forEach((elem) => {
                //  let distX = (abs)elem.creatureX;
                if (player.drones[i].droneX >= elem.creatureX)
                    x = 10000;
                else if (player.drones[i].droneX < elem.creatureX)
                    x = 0;
                if (player.drones[i].droneY >= elem.creatureY)
                    y = 10000;
                else if (player.drones[i].droneY < elem.creatureY)
                    y = 0;
            })
        }

        if (light == 1)
            fixedValues[i].droneVisibility = 2000;
        else
            fixedValues[i].droneVisibility = 800;
        console.log('MOVE', x, y, light);
    }
}
