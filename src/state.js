export const cars = [
    {
        id: 'spectre-gt',
        name: 'SPECTRE',
        suffix: 'GT',
        desc: 'The pinnacle of aerodynamic engineering. Designed to cut through the air with zero resistance.',
        specs: {
            speed: '340 KM/H',
            accel: '2.9 S',
            hp: '780 HP',
            engine: 'V12 HYBRID'
        },
        color: '#00f3ff', // Neon Blue
        modelUrl: null // Placeholder, will rely on default geometry or external URL if added
    },
    {
        id: 'cyclone-x',
        name: 'CYCLONE',
        suffix: 'X',
        desc: 'Raw power meets electric precision. The Cyclone X redefines what an electric sports car can be.',
        specs: {
            speed: '310 KM/H',
            accel: '2.1 S',
            hp: '1020 HP',
            engine: 'DUAL MOTOR'
        },
        color: '#ff003c', // Neon Red
        modelUrl: null
    },
    {
        id: 'viper-ev',
        name: 'VIPER',
        suffix: 'EV',
        desc: 'Silent but deadly. The Viper EV combines stealth with explosive acceleration.',
        specs: {
            speed: '290 KM/H',
            accel: '2.5 S',
            hp: '850 HP',
            engine: 'TRI MOTOR'
        },
        color: '#0aff00', // Neon Green
        modelUrl: null
    }
];

export const state = {
    currentCarIndex: 0,
    isLoading: true
};
