const { screen, waitFor, straightTo, centerOf, mouse, OptionalSearchParameters, Region, imageResource, Button, right, up, down, left, sleep } = require("@nut-tree/nut-js");
require("@nut-tree/template-matcher");
const { AbortController } = require("node-abort-controller");
const sound = require("sound-play");



(async() => {
    const resources = [{
            id: 1,
            name: 'fresno',
            time: 4900,
            nImg: 5
        }, {
            id: 2,
            name: 'roble',
            time: 4900,
            nImg: 5
        },
        {
            id: 3,
            name: 'castano',
            time: 4900,
            nImg: 4
        }, {
            id: 4,
            name: 'arce',
            time: 11800,
            nImg: 5
        }, {
            id: 5,
            name: 'nogal',
            time: 8900,
            nImg: 4
        }, {
            id: 6,
            name: 'cerezo',
            time: 8900,
            nImg: 3
        }, {
            id: 7,
            name: 'ebano',
            time: 12000,
            nImg: 1
        },
    ];

    const mapData = [{
            id: '-124',
            forward: 2,
            back: 4,
            resources: []
        }, {
            id: '024',
            forward: 3,
            back: 4,
            resources: []
        }, {
            id: '025',
            forward: 3,
            back: 4,
            resources: []
        }, {
            id: '026',
            forward: 3,
            back: 4,
            resources: []
        }, {
            id: '027',
            forward: 3,
            back: 4,
            resources: []
        }, {
            id: '028',
            forward: 3,
            back: 4,
            resources: []
        }, {
            id: '130',
            forward: 2,
            back: 4,
            resources: [3]
        }, {
            id: '230',
            forward: 3,
            back: 4,
            resources: [3]
        }, {
            id: '231',
            forward: 2,
            back: 1,
            resources: [1, 2]
        }, {
            id: '331',
            forward: 1,
            back: 4,
            resources: [1, 5, 2]
        }, {
            id: '3312',
            forward: 1,
            back: 4,
            resources: [1, 5, 2]
        }, {
            id: '330',
            forward: 2,
            back: 3,
            resources: [3]
        }, {
            id: '430',
            forward: 3,
            back: 4,
            resources: [2, 3, 5]
        }, {
            id: '431',
            forward: 2,
            back: 1,
            resources: [1, 2, 5]
        }, {
            id: '030',
            forward: 2,
            back: 0,
            resources: [3]
        }, {
            id: '531',
            forward: 1,
            back: 4,
            resources: [2]
        }, {
            id: '630',
            forward: 2,
            back: 4,
            resources: [6, 5, 1, 4]
        }, {
            id: '530',
            forward: 2,
            back: 4,
            resources: [1, 3]
        }, {
            id: '730',
            forward: 2,
            back: 4,
            resources: [5]
        }, {
            id: '830',
            forward: 2,
            back: 4,
            resources: [7, 1, 5]
        }, {
            id: '930',
            forward: 1,
            back: 4,
            resources: [5]
        }, {
            id: '929',
            forward: 4,
            back: 3,
            resources: [1]
        }, {
            id: '829',
            forward: 4,
            back: 2,
            resources: [1]
        }, {
            id: '729',
            forward: 4,
            back: 2,
            resources: [1]
        },
        {
            id: '629',
            forward: 4,
            back: 2,
            resources: [1, 5]
        },
        {
            id: '529',
            forward: 4,
            back: 2,
            resources: [5, 3, 2, 1]
        },
        {
            id: '429',
            forward: 4,
            back: 2,
            resources: [1]
        }, {
            id: '329',
            forward: 4,
            back: 2,
            resources: []
        }, {
            id: '229',
            forward: 4,
            back: 2,
            resources: []
        }, {
            id: '129',
            forward: 4,
            back: 2,
            resources: []
        }, {
            id: '029',
            forward: 3,
            back: 2,
            resources: []
        },
    ]


    const delay = 2800;
    let running = true;
    let starSamples = 20;
    let matchMapPos = 0.98;
    let screenActive;
    let regions;
    let currentMap;
    let isMoving = false;
    let onBattle = false;
    let changingMap = false;
    let searchWidth = 100;
    let exitConfidance = 0.999;
    let isFailing = false;
    let failCount = 0;

    console.log('STARTING BOT');
    screen.config.highlightDurationMs = 200;
    screen.config.resourceDirectory = "./assets";
    screen.config.confidence = 0.70;
    screen.config.autoHighlight = true;
    mouse.config.mouseSpeed = 40000;
    mouse.config.autoDelayMs = 300;


    // Configure the confidence you wish Nut to have before finding a match
    const confidence = 0.935;
    // Configure whether Nut should try to match across multiple scales of Image
    const searchMultipleScales = false;
    // Configure an Abort controller so that you can cancel the find operation at any time
    const controller = new AbortController();
    const { signal } = controller;


    try {
        screenActive = await screen.find(imageResource('screen.png'));
        console.log('GAME SCREEN DEFINED');

        console.log(screenActive.width - searchWidth)
        regions = [
            new Region(screenActive.left, screenActive.top, screenActive.width, searchWidth),
            new Region(screenActive.width - (searchWidth + 30), screenActive.top, (searchWidth + 30), screenActive.height),
            new Region(screenActive.left, screenActive.height - searchWidth + 10, screenActive.width, searchWidth),
            new Region(screenActive.left, screenActive.top, searchWidth, screenActive.height),
        ];


    } catch (error) {
        //console.log(error);
    }
    const fullSearchOptionsConfiguration = new OptionalSearchParameters(screenActive, confidence, searchMultipleScales, signal);
    const exitConf = new OptionalSearchParameters(screenActive, 0.95, searchMultipleScales, signal);
    try {
        currentMap = await getCurrentMap();

    } catch (error) {

    }
    let negativeResults = [];
    while (running) {
        if (currentMap == false || isMoving) {
            currentMap = await getCurrentMap();
            isMoving = false;
        }
        console.log('START LOOP');

        let check = await checkStatus();
        if (check) {
            try {
                let result = await checkResources();
                console.log('Recolectando ' + result.type)
                await collect(result);

            } catch (error) {
                console.log('No se detectan arboles');
                await navigate();

                negativeResults = [];


            }
        } else {
            console.log('Esperando 7 segs....');
            await wait(7000);
        }
        // console.log(negativeResults);

    }
    console.log('Inventory FULL cerrando bot.');

    async function collect(p) {

        let confirmRGBA = [{ R: 213, G: 207, B: 170, A: 255 }, { R: 213, G: 207, B: 170, A: 255 }, { R: 255, G: 102, B: 0, A: 255 }]

        await mouse.move(straightTo(p.data));
        await mouse.leftClick();
        await mouse.move(down(44));
        await mouse.move(right(33));
        let currentColor = await screen.colorAt(mouse.getPosition())
            //console.log(currentColor)
        let canClick = confirmRGBA.find(e => {
            if (e.A == currentColor.A && e.B == currentColor.B) {
                return true
            }
        })
        if (canClick !== undefined) {
            await mouse.leftClick();
            await wait(p.time)
        } else {
            negativeResults.push(p.data);
        }
    }

    function wait(time) {
        return new Promise(function(resolve, reject) {

            setTimeout(() => {
                resolve(true)
            }, time + delay)
        }).then(() => {
                // console.log('Restart loop');

            }

        )

    }

    async function checkStatus() {
        let canFind = true;
        await battleCheck() ? canFind = false : ''
        await lvlUpCheck() ? canFind = false : ''
            // await checkInventory() ? canFind = false : ''

        async function battleCheck() {
            console.log('CHECK INBATTLE');
            const checksBattle = ['batalla1.png', 'batalla2.png']
            let inCombat = false;
            let check1, check2, checkEnd;

            for (i = 0; i < checksBattle.length; i++) {
                try {
                    await screen.find(imageResource(checksBattle[i]), fullSearchOptionsConfiguration);
                    await sound.play('./assets/audio/battle.wav')
                    inCombat = true
                } catch (error) {

                }

            }
            if (!inCombat) {
                try {
                    await mouse.move(straightTo(centerOf(screen.find(imageResource('final_combate.png'), fullSearchOptionsConfiguration))))
                    await mouse.leftClick();
                    inCombat = false;
                } catch (error) {
                    // console.log(error);
                }
            }

            return inCombat;

        }
        async function lvlUpCheck() {
            let lvlPending = false;
            let posLvl;

            try {
                posLvl = await screen.find(imageResource('lvlUp.png'), fullSearchOptionsConfiguration);
                lvlPending = true
            } catch (error) {

            }

            if (lvlPending) {
                console.log('LVL UP DETECTED');
                await mouse.move(straightTo(centerOf(posLvl)));
                await mouse.leftClick();
            }
            return lvlPending
        }

        async function checkInventory() {
            let isFull = false
            const podsParams = new OptionalSearchParameters(screenActive, 1, searchMultipleScales, signal);
            try {
                posLvl = await screen.find(imageResource('inventarioLleno.png', podsParams));
                await mouse.move(straightTo(centerOf(screen.find(imageResource('mochila.png'), fullSearchOptionsConfiguration))))
                await mouse.leftClick();
                await wait(2000);
                await screen.find(imageResource('fullInventario.png'), fullSearchOptionsConfiguration);
                isFull = true;
                running = false;
                await closeInventory();
            } catch (error) {
                await closeInventory();
            }

            async function closeInventory() {
                try {
                    await mouse.move(straightTo(centerOf(screen.find(imageResource('cerrarInventario.png'), fullSearchOptionsConfiguration))))
                    await mouse.leftClick();
                    await wait(2000);
                } catch (error) {

                }

            }
            return isFull
        }

        return canFind

    }

    async function navigate() {
        console.log('NAVIGATOR////')
        if (!currentMap) {
            console.log('NO MAP////')
            currentMap = await getCurrentMap();
        }
        let prevMap = currentMap;

        try {
            let exits = await getExits(currentMap.forward);
            // console.log(currentMap.forward);
            await mouse.move(straightTo(
                centerOf(exits)
            ))

            await mouse.leftClick();
            console.log('MOVING////')
            isMoving = true;
            await wait(2500);


        } catch (error) {
            console.log(error);
        }


    }

    async function getCurrentMap() {
        let assets = getMapCordAssets();
        let tempPos;
        let mapFound;
        const searchPosParams = new OptionalSearchParameters(regions[0], matchMapPos - (failCount / 100) / 2, searchMultipleScales, signal);
        for (let index = 0; index < assets.length; index++) {
            try {
                await screen.find(imageResource(assets[index]), searchPosParams);
                tempPos = mapData[index];
                mapFound = true;

            } catch (error) {
                // console.log(error)
            }

        }
        if (mapFound != undefined) {
            console.log('MAP DEFINED');
            console.log(tempPos);
            failCount = 0;
            isFailing = false;

            return tempPos
        } else {
            isFailing = true;
            failCount++;
            return false
        }

    }

    async function getExits(n) {
        let regionArr;

        let exits = await findExit(regions[n - 1])


        async function findExit(r) {
            let assets = getStarAssets();
            await screen.highlight(r);
            let actualConf = exitConfidance - (failCount / 100) / 4;
            console.log('FIND EXIT WITH CONFIDENCE');
            console.log(actualConf);
            let tempConf = new OptionalSearchParameters(r, actualConf, searchMultipleScales, signal);
            let tempData;
            for (let index = 0; index < assets.length; index++) {
                try {

                    let dataE = await screen.find(imageResource(assets[index]), tempConf);
                    // console.log(dataE);
                    tempData = dataE;
                    // console.log('EXITFOUND');
                    index = assets.length

                } catch (error) {
                    // console.log('EXITerror');
                    // console.log(error)
                }

            }
            if (!tempData) {
                isFailing = true;
                failCount++;
            } else {
                isFailing = false;
                failCount = 0;
            }
            return tempData
        }
        console.log('Returning exits');
        console.log(exits);
        return exits
    }



    async function checkResources() {
        console.log('CHECKRESOURCES')
        if (currentMap.resources.length > 0) {
            let resourceData = undefined;
            let currentResources = [];
            currentMap.resources.forEach(e => {
                currentResources.push(resources.find(r => r.id == e))
            });


            for (let index = 0; index < currentResources.length; index++) {

                try {

                    resourceData = {
                        data: await checkWood(currentResources[index].name, currentResources[index].nImg),
                        type: currentResources[index].name,
                        time: currentResources[index].time,
                    }
                    resourceData.data !== undefined ? index = currentResources.length : resourceData = undefined

                } catch (error) {
                    console.log('error en check')
                }

            }
            return resourceData;
        } else {
            console.log('Sin recursos en el mapa');
        }

    }

    async function checkWood(w, nImg) {

        let assetsW = getAssets(w, nImg);
        // console.log(`CHECKWOOD // ${w}  // Verificando ${assetsW.length} imagenes ///`)
        let data;
        let nSamples = 3

        for (let index = 0; index < assetsW.length; index++) {
            try {
                let tempData = await centerOf(screen.find(imageResource(assetsW[index]), fullSearchOptionsConfiguration));
                let checkNeg = negativeResults.find(d => {
                    if (d.x == tempData.x && d.y == tempData.y) {
                        return true
                    }
                })
                if (checkNeg == undefined) {
                    data = tempData;
                    index = assetsW.length
                } else {
                    console.log('Evitando Match incorecto');
                }

            } catch (error) {
                //console.log(`${index + 1}/${nSamples} ////${error}`);
            }

        }

        return data;


    }

    function getAssets(woodType, nImg) {
        let assetsArr = [];

        for (let index = 0; index < nImg; index++) {

            assetsArr.push(`${woodType}${index+1}.png`)
        }


        return assetsArr
    }

    function getMapCordAssets() {
        let assetsArr = [];

        for (let index = 0; index < mapData.length; index++) {

            assetsArr.push(`c${mapData[index].id}.png`)
        }


        return assetsArr
    }

    function getStarAssets() {
        let assetsArr = [];

        for (let index = 0; index < starSamples; index++) {

            assetsArr.push(`star${index+1}.png`)
        }


        return assetsArr
    }
})()