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
}

const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

/************************************************/

const creatureCount: number = parseInt(readline());

let creatures: creature[] = [];
let monsters: number[] = [];

for (let i = 0; i < creatureCount; i++) {
    let inputs: string[] = readline().split(' ');
    let newCreature: creature = {
        creatureId: parseInt(inputs[0]),
        color: parseInt(inputs[1]),
        type: parseInt(inputs[2]),
        isVisible: false,
    }
    creatures.push(newCreature);
    if (newCreature.type == -1)
        monsters.push(newCreature.creatureId);
}

let player: player = { drones: [], creatureScanned: [] };
let foe: player = { drones: [], creatureScanned: [] };
let fixedValues: fixedValues[] = [{
    firstMove: true,
    goSurface: false,
}, {
    firstMove: true,
    goSurface: false,
    }];

/*                 game loop					*/

while (true) {
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
            goSurface:fixedValues[i].goSurface
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
            goSurface: undefined
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
        creatures.forEach((element) => {
            if (element.creatureId == creatureId) {
                element.isVisible = true;
                element.creatureX = parseInt(inputs[1]);
                element.creatureY = parseInt(inputs[2]);
                element.creatureVx = parseInt(inputs[3]);
                element.creatureVy = parseInt(inputs[4]);
            }
        })
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
                    console.error(i, player.drones[i].goSurface, player.drones[i].firstMove);
                }
            }
            else {
                x = 7500;
                y = 3725;
                if (player.drones[i].droneX > 7400 && player.drones[i].droneY > 3100) {
                    light = 1;
                    fixedValues[i].goSurface = true;
                    fixedValues[i].firstMove = false;
                    console.error(i, player.drones[i].goSurface, player.drones[i].firstMove);
                }
            }
            console.error(i, player.drones[i].goSurface, player.drones[i].firstMove);
        }
        else if (player.drones[i].goSurface == true)
        {
            x = player.drones[i].droneX;
            y = 500;
            if (player.drones[i].droneY == 500)
                fixedValues[i].goSurface = false;
        }
        
        else {
            if (player.drones[i].droneY < 8500 && player.drones[i].droneX <= 3500) {
                y = 9000;
                x = player.drones[i].droneX;
            }
            else if (player.drones[i].droneY >= 8500 && player.drones[i].droneX < 8500) {
                y = 9000;
                x = 9000;
            }
            else if (player.drones[i].droneX >= 8500 && player.drones[i].droneY > 500) {
                y = 500;
                x = player.drones[i].droneX;
            }
            else {
                y = 3500;
                x = 1500;
            }
        }
        console.log('MOVE', x, y, light);
    }
}
