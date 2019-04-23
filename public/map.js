var map = [
    {
        name: "ground1",
        position: {
            x: 3000-200,
            y: 340
        },
        background: false,
        paralax: 0,
        front: false,
        source: "platform.png"
    },
    {
        name: "ground1",
        position: {
            x: 3000-60,
            y: 340
        },
        background: false,
        paralax: 0,
        front: false,
        source: "platform.png"
    },
    
    {
        name: "ground1",
        position: {
            x: 2850,
            y: 160
        },
        background: false,
        paralax: 0,
        front: false,
        source: "platform.png"
    },
    
    {
        name: "ground1",
        position: {
            x: 1200,
            y: 570
        },
        background: false,
        paralax: 0,
        front: false,
        source: "ground_grass_snow.png"
    },
    {
        name: "ground1",
        position: {
            x: 2400,
            y: 570
        },
        background: false,
        paralax: 0,
        front: false,
        source: "ground_grass_to_snow.png"
    },
    {
        name: "ground1",
        position: {
            x: 3600,
            y: 570
        },
        background: false,
        paralax: 0,
        front: false,
        source: "ground_grass.png"
    },
    
    
    
];
for (i = 0; i < 8; i++) {
    map.push({
        name: "ground1",
        position: {
            x: 0 + i * 150,
            y: 570
        },
        background: false,
        paralax: 0,
        front: false,
        source: "cegla_niebieska.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 4800 + i * 150,
            y: 570
        },
        background: false,
        paralax: 0,
        front: false,
        source: "cegla_czerwona.png"
    });
    for (j = 0; j < 4; j++) {
        if(i==3&&(j==1||j==2)) continue;
        if(i==1&&(j==1||j==2)) continue;
        if(i==5&&(j==1||j==2)) continue;

        map.push({
            name: "ground1",
            position: {
                x: 0 + i * 150,
                y: -30 + j * 150
            },
            background: true,
            paralax: 0,
            front: false,
            source: "cegla_niebieska_bg.png"
        });
        map.push({
            name: "ground1",
            position: {
                x: 6000 -150 - i * 150,
                y: -30 + j * 150
            },
            background: true,
            paralax: 0,
            front: false,
            source: "cegla_czerwona_bg.png"
        });
    }
    map.push({
        name: "ground1",
        position: {
            x: 450,
            y: -30 + 150
        },
        background: true,
        paralax: 0,
        front: false,
        source: "okno_niebieskie.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 6000 - 600,
            y: -30 + 150
        },
        background: true,
        paralax: 0,
        front: false,
        source: "okno_czerwone.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 150,
            y: -30 + 150
        },
        background: true,
        paralax: 0,
        front: false,
        source: "okno_niebieskie.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 6000 - 300,
            y: -30 + 150
        },
        background: true,
        paralax: 0,
        front: false,
        source: "okno_czerwone.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 750,
            y: -30 + 150
        },
        background: true,
        paralax: 0,
        front: false,
        source: "okno_niebieskie.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 6000 - 900,
            y: -30 + 150
        },
        background: true,
        paralax: 0,
        front: false,
        source: "okno_czerwone.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 1050,
            y: -30
        },
        background: false,
        paralax: 0,
        front: true,
        source: "cegla_niebieska.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 1050,
            y: -30 + 150
        },
        background: false,
        paralax: 0,
        front: true,
        source: "cegla_niebieska.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 6000-1200,
            y: -30
        },
        background: false,
        paralax: 0,
        front: true,
        source: "cegla_czerwona.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 6000-1200,
            y: -30 + 150
        },
        background: false,
        paralax: 0,
        front: true,
        source: "cegla_czerwona.png"
    });
    map.push({
        name: "ground1",
        position: {
            x: 3000-250,
            y: 600-427-20
        },
        background: false,
        paralax: 0,
        front: true,
        source: "castle.png"
    });
    
    
}
