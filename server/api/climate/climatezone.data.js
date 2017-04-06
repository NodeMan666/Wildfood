'use strict';

///http://en.wikipedia.org/wiki/File:Australia-Oceania_Koppen_Map.png
//http://www.bom.gov.au/jsp/ncc/climate_averages/climate-classifications/index.jsp?maptype=kpn#maps

var entries = [
    {
        bomcode: 42,
        category: "Equatorial",
        description: 'rainforest (monsoonal)',
        color:"#B57250",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 41,
        category: "Equatorial",
        description: 'Savanna',
        color:"#B3942F",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 37,
        category: "Tropical",
        description: 'Rainforest (persistently wet)',
        color:"#4B5F3B",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 36,
        category: "Tropical",
        description: 'rainforest (monsoonal)',
        color:"#5F873D",
        koppenCode: "Am",
        koppenDescription: "monsoon climate",
        samplePlaces: [
            {
                country: "Australia",
                town: "Cairns"
            }
        ]
    },
    {
        bomcode: 35,
        category: "Tropical",
        description: 'savanna',
        color:"#8BAF3F",
        koppenCode: "Aw",
        koppenDescription: "tropical savanna climate",
        samplePlaces: [
            {
                country: "Australia",
                town: "Darwin",
                code:"DAR"

            }
        ]

    },
    {
        bomcode: 34,
        category: "Subtropical",
        description: 'no dry season',
        color:"#BCC87C",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: "Brisbane"
            }
        ]
    },
    {
        bomcode: 33,
        category: "Subtropical",
        description: 'distinctly dry summer',
        color:"#CDE186",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: "Perth"
            }
        ]
    },
    {
        bomcode: 32,
        category: "Subtropical",
        description: 'distinctly dry winter',
        color:"#D8E9B4",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 31,
        category: "Subtropical",
        description: 'moderately dry winter',
        color:"#E3F2E2",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 24,
        category: "Desert",
        description: 'hot (persistently dry)',
        color:"#A72C32",
        koppenCode: "BWh",
        koppenDescription: "warm desert climate",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 23,
        category: "Desert",
        description: 'hot (summer drought)',
        color:"#D2582A",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 22,
        category: "Desert",
        description: 'hot (winter drought)',
        color:"#F79760",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 21,
        category: "Desert",
        description: 'warm (persistently dry)',
        color:"#FDD6B6",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 15,
        category: "Grassland",
        description: 'hot (persistently dry) ',
        color:"#E2BE22",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 14,
        category: "Grassland",
        description: 'hot (summer drought) ',
        color:"#FFDE00",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 13,
        category: "Grassland",
        description: 'hot (winter drought)',
        color:"#FFE493",
        koppenCode: "Bsh",
        koppenDescription: "warm semi-arid climate",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 12,
        category: "Grassland",
        description: 'warm (persistently dry)',
        color:"#F7F2CF",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 11,
        category: "Grassland",
        description: 'warm (summer drought)',
        color:"#FFFBE8",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 9,
        category: "Temperate",
        description: 'no dry season (hot summer) ',
        color:"#DEC3D2",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "Australia",
                town: "Sydney"
            }
        ]
    },
    {
        bomcode: 8,
        category: "Temperate",
        description: 'moderately dry winter (hot summer)',
        color:"#BE9294",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 7,
        category: "Temperate",
        description: 'distinctly dry (and hot) summer',
        color:"#98489B",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: "Adeleide"
            }
        ]
    },
    {
        bomcode: 6,
        category: "Temperate",
        description: 'no dry season (warm summer)',
        color:"#615988",
        koppenCode: "",
        samplePlaces: [
          {
            country: "Australia",
            town: "Melbourne"
          }
        ]
    },
    {
        bomcode: 5,
        category: "Temperate",
        description: 'moderately dry winter (warm summer)',
        color:"#0D7AAA",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 4,
        category: "Temperate",
        description: 'distinctly dry (and warm) summer',
        color:"#179ED2",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 3,
        category: "Temperate",
        description: 'no dry season (mild summer)',
        color:"#63CAF2",
        koppenCode: "Cfb",
        koppenDescription: "temperate oceanic climate",
        samplePlaces: [
            {
                country: "",
                town: "Hobart"
            }
        ]
    },
    {
        bomcode: 2,
        category: "Temperate",
        description: 'distinctly dry (and mild) summer',
        color:"#B8E3FA",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    },
    {
        bomcode: 1,
        category: "Temperate",
        description: 'no dry season (cool summer)',
        color:"#E2F4FD",
        koppenCode: "",
        koppenDescription: "",
        samplePlaces: [
            {
                country: "",
                town: ""
            }
        ]
    }
]


module.exports = entries;



