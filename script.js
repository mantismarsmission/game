// Clear any leftover minigame results from previous sessions
localStorage.removeItem("mars_tunnel_descent_results");

// Game State Variables
let gameState = {
    life: 100,
    food: 100,
    radiation: 100,
    energy: 100,
    discovery: 0,
    sol: 1,
    currentEventId: "welcome",
    randomEventsRemaining: 2,
    inRandomPhase: true,
    randomPool: ["dust_tornado", "event2", "event3", "event4", "event5", "event6"]
};

// Pick and remove a random event ID from the pool so it cannot repeat
function pickRandomEvent() {
    const randomIndex = Math.floor(Math.random() * gameState.randomPool.length);
    const chosenId = gameState.randomPool[randomIndex];
    gameState.randomPool.splice(randomIndex, 1);
    return chosenId;
}

/* 
  ========================================================================
  MISSIONS & EVENTS LIST 
  ========================================================================
*/
const eventsList = {
    "welcome": {
        tag: "Outpost Initialized",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/july/PIA00621.jpg?w=1280&h=612&fit=crop&crop=faces%2Cfocalpoint",
        alt: "This is the view of Mars through the vision of a rover.",
        heading: "Welcome to Mantis Mars Mission",
        description: "Your habitation module has successfully touched down in the Elysium Planitia region. Systems are green, but harsh Martian weather patterns loom on the horizon. Manage your resources carefully to ensure mission survival.",
        choices: [
            {
                text: "Begin Mission Logistics",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "RANDOM"
            }
        ]
    },

    "sol_transition": {
        tag: "End of Sol Log",
        image: "https://ciencia.nasa.gov/wp-content/uploads/sites/2/2023/12/925-pia07997-1280.jpg?resize=868,500",
        alt: "Martian horizon at dusk",
        heading: "Sol Complete",
        description: "It was a tough day, or as we call it here on Mars, a tough Sol. Systems have been stabilized for the freezing Martian night. We will continue operations tomorrow on the next Sol.",
        choices: [
            {
                text: "Continue to Next Sol",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "RANDOM"
            }
        ]
    },

    "sol_transition_2": {
        tag: "End of Sol Log",
        image: "https://ciencia.nasa.gov/wp-content/uploads/sites/2/2023/12/rocky-dusty-red-plain-in-fading-light.-a-bit-of-the-viking-lander-is-in-the-foreground.webp",
        alt: "Martian horizon at dusk",
        heading: "Sol 2 Complete",
        description: "Another grueling Martian day comes to a close. With initial outpost hazards stabilized, Mission Control clears your crew to choose tomorrow's operational priority.",
        choices: [
            {
                text: "Continue to Next Sol",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "mission_choice"
            }
        ]
    },

    "mission_choice": {
        tag: "Operational Orders",
        image: "https://www.asc-csa.gc.ca/images/recherche/tiles/5fa79378-dbb6-4391-9e70-1decf94d34ff.jpg",
        alt: "Mantis Outpost command console",
        heading: "Choose Your Priority",
        description: "Systems are nominal for the new Sol. Will you proceed immediately with the primary biosignature investigation, or divert a team to handle a sidequest?",
        choices: [
            {
                text: "Go to the Main Mission",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: +5 },
                nextEvent: "main_mission"
            },
            {
                text: "Do a Sidequest",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "sidequest_menu"
            }
        ]
    },

    "sidequest_menu": {
        tag: "Side Operations",
        image: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/rover2-1.jpg?w=1200&h=900&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Martian surface exploration targets",
        heading: "Select a Sidequest",
        description: "Three secondary objectives have been flagged near the perimeter. You only have enough time and daylight to complete one before starting the main mission tomorrow.",
        choices: [
            {
                text: "Repair the Sojourner rover",
                effects: { life: 0, food: -10, radiation: 0, energy: -10, discovery: +5 },
                nextEvent: "sidequest1"
            },
            {
                text: "Collect outpost solar panels from a previous mission",
                effects: { life: 0, food: +15, radiation: 0, energy: +15, discovery: +5 },
                nextEvent: "sidequest2"
            },
            {
                text: "Obtain the supply rocket rations",
                effects: { life: +15, food: -5, radiation: 0, energy: -5, discovery: +10 },
                nextEvent: "sidequest3"
            }
        ]
    },

    "sol_transition_sidequest": {
        tag: "End of Sol Log",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/july/PIA00621.jpg?w=1280&h=612&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Martian horizon at dusk",
        heading: "Sidequest Complete",
        description: "The team returns to the habitat as night falls over Elysium Planitia. Tomorrow, all crew members will focus on the main mission.",
        choices: [
            {
                text: "Start Main Mission on Next Sol",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "main_mission"
            }
        ]
    },

    "start": {
        tag: "System Status",
        image: "image1.png",
        alt: "Mars habitat landing site overview under dusty skies",
        heading: "Touchdown Confirmed",
        description: "The descent engines have cooled. Your AI assistant alerts you that minor atmospheric disturbances are forming nearby. How do you want to allocate your initial crew assignments?",
        choices: [
            {
                text: "Reinforce external solar panels and grid stability.",
                effects: { life: -5, food: 0, radiation: 0, energy: +10, discovery: 0 },
                nextEvent: "event2"
            },
            {
                text: "Seal airlock bulkheads and run full-system radiation sweeps.",
                effects: { life: 0, food: 0, radiation: +10, energy: -10, discovery: 0 },
                nextEvent: "dust_tornado"
            }
        ]
    },

    "dust_tornado": {
        tag: "Xtreme weather",
        image: "https://www.nasa.gov/wp-content/uploads/2015/09/21_the_serpent_dust_devil_on_mars_pia15116-br2.jpg?resize=900,597",
        alt: "a dust tornado in mars",
        heading: "The bad tornados",
        description: "Two dust tornadoes are heading toward the space base, one toward the solar panels and the other toward the living quarters. You only have enough time to build a barricade to stop one of the approaching tornadoes. Which one will you protect?",
        choices: [
            {
                text: "Create a barricade to protect the bedroom",
                effects: { life: 0, food: -10, radiation: 0, energy: -20, discovery: 0 },
                nextEvent: "event3"
            },
            {
                text: "Create a barricade to protect the solar panels",
                effects: { life: -20, food: -10, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "event2"
            }
        ]
    },

    "event2": {
        tag: "Cosmic event",
        image: "https://science.nasa.gov/wp-content/uploads/2023/04/hubble_friday_07302015-jpg.webp?resize=900,658",
        alt: "Image of a dying star’s final surge",
        heading: "Cosmic radiation surge",
        description: "A dying star explodes light-years away, sending a sudden surge of high-energy gamma rays and cosmic radiation across space. Mars has no magnetic field and a very thin atmosphere, so the radiation slams directly into the surface without being blocked.",
        choices: [
            {
                text: "Move the gym shields to the greenhouse",
                effects: { life: -15, food: -5, radiation: -5, energy: 0, discovery: +5 },
                nextEvent: "event6"
            },
            {
                text: "Leave the greenhouse and take shelter",
                effects: { life: +5, food: -15, radiation: 0, energy: 0, discovery: +5 },
                nextEvent: "event3"
            }
        ]
    },

    "event3": {
        tag: "Weather event",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2002/december/northmars_mgs_big.jpg?w=2000&h=1500&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Spring Dust Storms at the North Pole of Mars",
        heading: "Dust storm",
        description: "A storm is approaching the space base, causing a lack of sunlight for crops, and the suspended particles absorb heat in the upper layers of the atmosphere and prevent the heat from reaching the ground, causing the surface to cool down during the day.",
        choices: [
            {
                text: "Use extra power from the ship to run the emergency lights and save the plants, but people will be cold",
                effects: { life: -10, food: +5, radiation: 0, energy: -10, discovery: +5 },
                nextEvent: "event5"
            },
            {
                text: "Use extra energy to keep people warm, but some plants are going to die",
                effects: { life: +5, food: -10, radiation: 0, energy: -20, discovery: +5 },
                nextEvent: "event4"
            }
        ]
    },

    "event4": {
        tag: "Cosmic Event",
        image: "https://svs.gsfc.nasa.gov/vis/a010000/a014200/a014263/133DaysontheSun_StillSept15.jpg",
        alt: "This is an image of the sun causing turbulence",
        heading: "Magnetohydrodynamic Turbulence",
        description: "The turbulence would be caused by the strong magnetic fields of the sun damaging the radiation shields by supercharging the particles hitting the shield.\n\nIt would affect the energy supply because turbulence steadily degrades solar panels over time and can trigger sudden power surges or short circuits that knock critical systems offline.",
        choices: [
            {
                text: "Fix the energy supply.",
                effects: { life: 0, food: -5, radiation: -15, energy: +15, discovery: 0 },
                nextEvent: "event5"
            },
            {
                text: "Fix the radiation shield.",
                effects: { life: 0, food: -5, radiation: +15, energy: -15, discovery: 0 },
                nextEvent: "event6"
            }
        ]
    },

    "event5": {
        tag: "GRB radiation event",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/june/eagle.jpg?w=1876&h=2000&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Lethal dose of radiation has been emitted by a nearby supernova",
        heading: "Gamma Ray Bursts and radiation has come down to Mars",
        description: "A nearby Type Ic hypernovae (a supernova) emitted a large dose of gamma ray bursts and cosmic radiation. Anything caught in this beam even thousands of light-years away would suffer catastrophic radiation damage, such as body altering effects and affecting the electronics.",
        choices: [
            {
                text: "Override the life support system, hence the computer is currently affected by the radiation and is glitching, the computer might start accidentally venting cabin air or shutting off oxygen flow.",
                effects: { life: +15, food: -10, radiation: 0, energy: 0, discovery: +5 },
                nextEvent: "event6"
            },
            {
                text: "The radiation might affect and alter food supplies or ruin food crops. You can seal and put away all the ailments to protect them from radiation",
                effects: { life: -15, food: +10, radiation: 0, energy: 0, discovery: +5 },
                nextEvent: "event6"
            }
        ]
    },

    "event6": {
        tag: "Extreme temperature",
        image: "https://www.nasa.gov/wp-content/uploads/2017/04/lunar_greenhouse_demo_u_of_az_09_b.jpg?resize=2000,1541",
        alt: "This is an example of a greenhouse in Mars",
        heading: "Extreme Temperatures on Mars",
        description: "Everything seemed normal at the Mars research base. The astronauts had been growing their own vegetables inside a greenhouse and depending on solar panels for electricity. But that night something went wrong. The temperature outside began to drop rapidly. Mars already had an average temperature of approximately −65°C (−85°F), but the approaching Martian night brought even colder conditions. Suddenly, an alarm echoed through the base.<br><br><strong>WARNING: GREENHOUSE TEMPERATURE DROPPING, LOW BATTERY POWER.</strong><br><br>The extreme cold was making battery performance more difficult, while the heating system continued demanding electricity. Outside, the solar panels could not generate power during the night. The astronauts faced a terrifying possibility: if they couldn't maintain the greenhouse temperature, they could lose their crops. Without fresh food, their already limited food supplies would become an even bigger problem. They had to find a solution before the greenhouse became too cold.",
        choices: [
            {
                text: "Increase greenhouse heating to help the plants",
                effects: { life: 0, food: -5, radiation: 0, energy: -15, discovery: 0 },
                nextEvent: "solar_flare_warning"
            },
            {
                text: "Reduce greenhouse heating and save energy",
                effects: { life: 0, food: -15, radiation: 0, energy: +15, discovery: 0 },
                nextEvent: "solar_flare_warning"
            }
        ]
    },

    "solar_flare_warning": {
        tag: "Space Weather Alert",
        image: "image2.png",
        alt: "Coronal mass ejection visual simulation over the red horizon",
        heading: "Solar Flare Incoming",
        description: "Deep space monitors flare up red. A heavy coronal mass ejection is hurtling directly toward Elysium Planitia, threatening unshielded electronics and crew health.",
        choices: [
            {
                text: "Activate emergency magnetic shields (High Energy Drain).",
                effects: { life: 0, food: 0, radiation: +15, energy: -35, discovery: 0 },
                nextEvent: "dust_storm_approach"
            },
            {
                text: "Reroute power to life support life-cells and hunker down.",
                effects: { life: +10, food: 0, radiation: -20, energy: -15, discovery: 0 },
                nextEvent: "dust_storm_approach"
            }
        ]
    },

    "dust_storm_approach": {
        tag: "Atmospheric Hazard",
        image: "image1.png",
        alt: "Massive towering wall of red dust rolling across the crater",
        heading: "Global Dust Storm Spikes",
        description: "A colossal wall of iron-oxide dust blots out the afternoon sun. Solar generation drops to near-zero as fine particulate grit batters the exterior panels.",
        choices: [
            {
                text: "Deploy automated scraping drones to clear collector glass.",
                effects: { life: -10, food: 0, radiation: -5, energy: +15, discovery: 0 },
                nextEvent: "EJEMPLOEVENTO"
            },
            {
                text: "Conserve all battery reserves and shut down non-essential electronics.",
                effects: { life: -15, food: 0, radiation: 0, energy: +5, discovery: 0 },
                nextEvent: "EJEMPLOEVENTO"
            }
        ]
    },

    "EJEMPLOEVENTO": {
        tag: "esto es un ejemplo",
        image: "image1.png",
        alt: "Texto alternativo",
        heading: "Titulo ejemplo",
        description: "texto descriptivo ejemplo",
        choices: [
            {
                text: "Opción 1.",
                effects: { life: -10, food: 0, radiation: -5, energy: +15, discovery: 0 },
                nextEvent: "marsquake_event"
            },
            {
                text: "Opcion 2",
                effects: { life: -15, food: 0, radiation: 0, energy: +5, discovery: 0 },
                nextEvent: "marsquake_event"
            }
        ]
    },

    "sidequest1": {
        tag: "Side quest",
        image: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/i/a/0/PIA01551-1.jpg?w=1099&h=572&fit=clip&crop=faces%2Cfocalpoint",
        alt: "Image of the Sojourner rover",
        heading: "Repair the Sojourner rover",
        description: "In 1997, the Sojourner rover was sent to Mars by NASA. Now, it is broken due to irreversible damage caused by the Martian climate, having initially become inactive following a communication failure. You will repair it.",
        choices: [
            {
                text: "End the Sol and prepare for the main mission",
                effects: { life: +15, food: -5, radiation: 0, energy: -5, discovery: 0 },
                nextEvent: "sol_transition_sidequest"
            }
        ]
    },

    "sidequest2": {
        tag: "Sidequest",
        image: "https://assets.science.nasa.gov/content/dam/science/psd/mars/resources/detail_files/6/6197_mars-human-exploration-art-astronauts-outpost-habitat-full2.jpg",
        alt: "Image of a Mars Outpost simulation",
        heading: "Collect outpost solar panels from a previous mission",
        description: "You and your team went to collect the outpost solar panels from a previous mission and also found food rations",
        choices: [
            {
                text: "End the Sol and prepare for the main mission",
                effects: { life: +5, food: +15, radiation: 0, energy: +20, discovery: 0 },
                nextEvent: "sol_transition_sidequest"
            }
        ]
    },

    "sidequest3": {
        tag: "Side quest",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9N56nnnppiXR7_zKyYXcetZPzfNVPiW7PI5xpSLtoFedR8pg_oURhEoQ&s=10",
        alt: "a supply rocket destroyed on Mars",
        heading: "Obtain the supplies",
        description: "You went to a place containing supplies brought by NASA, because you were told over the radio that they had sent rations.",
        choices: [
            {
                text: "When you arrived at the location where the supplies were, you saw that they had been destroyed by the impact and nothing had survived",
                effects: { life: 0, food: -10, radiation: 0, energy: -10, discovery: 0 },
                nextEvent: "sol_transition_sidequest"
            }
        ]
    },

    "main_mission": {
        tag: "MISSION",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2022/june/MarsFingers_Curiosity_1338.jpg?w=1338&h=1193&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Life on Mars, could there be life in the underground of the red planet?",
        heading: "Mission for Life on Mars",
        description: "A sample collected by NASA’s Perseverance Mars rover from an ancient dry riverbed in Jezero Crater could preserve evidence of ancient microbial life. Taken from a rock named ‘Cheyava Falls’, the sample, called ‘Sapphire Canyon’ contains potential biosignatures. The astronauts head down to check if more evidence of life resides in the underground of Mars.",
        choices: [
            {
                text: "Continue with the mission",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: +5 },
                nextEvent: "crater_exploration"
            }
        ]
    },

    "crater_exploration": {
        tag: "Jezero Crater exploration",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2022/june/MarsFingers_Curiosity_1338.jpg?w=1338&h=1193&fit=crop&crop=faces%2Cfocalpoint",
        alt: "The Perseverance Rover has stopped working",
        heading: "Jezero Exploration",
        description: "The Perseverance Rover has been damaged from hazardous terrain.",
        choices: [
            {
                text: "Go back to the base to fix the damaged Rover, and investigate the few samples that it has collected.",
                effects: { life: 0, food: -5, radiation: 0, energy: -10, discovery: +5 },
                nextEvent: "back_at_the_base"
            },
            {
                text: "Try to fix it as best as you can but continue to collect and analyse samples from the crater.",
                effects: { life: 0, food: -5, radiation: 0, energy: -10, discovery: +5 },
                nextEvent: "analyze_samples"
            }
        ]
    },

    "back_at_the_base": {
        tag: "Going back to the base",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2020/january/HillsRidgesTracks_Curiosity_2725.jpg?w=2000&h=1245&fit=crop&crop=faces%2Cfocalpoint",
        alt: "We are back at the base",
        heading: "What’s next?",
        description: "You are back to the base. The Rover is heavily damaged, the wheels and suspension are damaged. The samples collected by the Rover are ready to be examined.",
        choices: [
            {
                text: "Repair the Rover.",
                effects: { life: -5, food: 0, radiation: 0, energy: -5, discovery: 0 },
                nextEvent: "marsquake_event"
            },
            {
                text: "Examine the samples collected by the Rover.",
                effects: { life: 0, food: 0, radiation: 0, energy: -5, discovery: +5 },
                nextEvent: "analyze_samples"
            }
        ]
    },

    "analyze_samples": {
        tag: "Analysing samples",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/july/TurtleRock_Curiosity_2048.jpg?w=2000&h=1204&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Biosignatures in Jezero Crater",
        heading: "Traces of ancient microbes",
        description: "As you analyse the samples, there seems to be traces of ancient microbes, what do you do?",
        choices: [
            {
                text: "Report the discovery and stop investigating further.",
                effects: { life: 0, food: 0, radiation: 0, energy: -5, discovery: +5 },
                nextEvent: "marsquake_event"
            },
            {
                text: "Continue to search through the Jezero Crater, and collect more samples regarding the traces you have found.",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "minigame_descent"
            }
        ]
    },

    "minigame_descent": {
        tag: "Subsurface Recon",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/july/TurtleRock_Curiosity_2048.jpg?w=2000&h=1204&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Subsurface reconnaissance drone",
        heading: "Subsurface Descent: Jezero Crater",
        description: "Deploy the scout drone into the subterranean cavern to collect ancient microbial biosignatures. Complete the descent before continuing.",
        isMinigame: true,
        choices: [
            {
                text: "Continue Mission",
                effects: { life: 0, food: 0, radiation: 0, energy: 0, discovery: 0 },
                nextEvent: "marsquake_event"
            }
        ]
    },

    "marsquake_event": {
        tag: "Geological Event",
        image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2022/august/SiccarPoint_CuriosityGill_7640.jpg?w=2000&h=977&fit=crop&crop=faces%2Cfocalpoint",
        alt: "Marsquake Magnitude 5.1",
        heading: "Marsquake resonating throughout Mars",
        description: "A marsquake of magnitude 5.1 has shaken all throughout Mars, inflicting damages to all the systems. Unfortunately everything is damaged.",
        choices: [
            {
                text: "Continue",
                effects: { life: -5, food: -5, radiation: -5, energy: -5, discovery: 0 },
                nextEvent: "mission_success"
            },
        ]
    },

    "mission_success": {
        tag: "Mission Outcome",
        image: "images/missionaccomplished.png",
        alt: "Astronaut drawing showing that the mission was accomplished",
        heading: "Outpost Stabilized: Accomplished!",
        description: "Through calculated risks, stellar resource management, and groundbreaking scientific discoveries, you have weathered the planet's harshest extremes.",
        isEnd: true,
        outcomeType: "accomplished"
    },

    "mission_complete": {
        tag: "Mission Outcome",
        image: "images/missioncomplete.png",
        alt: "Astronaut drawing showing that the mission was just barely completed",
        heading: "Outpost Stabilized: Complete!",
        description: "Your crew survived the harsh conditions of Mars and maintained critical outpost systems, though major scientific discoveries remain to be uncovered.",
        isEnd: true,
        outcomeType: "complete"
    },

    "mission_failure": {
        tag: "Critical Failure",
        image: "images/missionfailed.png",
        alt: "Astronaut drawing showing that the mission failed",
        heading: "Catastrophic System Failure",
        description: "Critical thresholds have been breached. Whether due to radiation poisoning, oxygen failure, or total power collapse, the Ares-IV outpost has gone dark.",
        isEnd: true,
        outcomeType: "failed"
    }
};

// Evaluate final mission outcome based on thresholds
function evaluateMissionOutcome() {
    const meetsMinimums =
        gameState.life >= 70 &&
        gameState.food >= 30 &&
        gameState.radiation >= 80 &&
        gameState.energy >= 50;

    if (!meetsMinimums) {
        return "failed";
    }

    if (gameState.discovery >= 35) {
        return "accomplished";
    }

    return "complete";
}

// Update UI elements based on the current active event ID
function updateGame() {
    // Check premature collapse triggers (0% on critical stats)
    if (gameState.life <= 0 || gameState.radiation <= 0 || gameState.energy <= 0) {
        renderEndScreen("failed");
        return;
    }

    const current = eventsList[gameState.currentEventId];

    if (current.isEnd) {
        renderEndScreen(evaluateMissionOutcome());
        return;
    }

    // Update Sol day counter in header
    document.getElementById("day-counter").innerText = `Sol ${gameState.sol}`;

    // Update stats display
    document.getElementById("stat-life").innerText = `${gameState.life}%`;
    document.getElementById("stat-food").innerText = `${gameState.food}%`;
    document.getElementById("stat-radiation").innerText = `${gameState.radiation}%`;
    document.getElementById("stat-energy").innerText = `${gameState.energy}%`;

    // Update narrative copy
    document.getElementById("event-heading").innerText = current.heading;
    document.getElementById("event-description").innerHTML = current.description;

    const visualContainer = document.getElementById("visual-container");
    const choicesArea = document.getElementById("choices-area");

    // Special handling for the embedded Subsurface Descent minigame
    if (current.isMinigame) {
        visualContainer.style.height = "560px";
        visualContainer.innerHTML = `
            <iframe
                id="minigame-frame"
                src="marsminigame.html"
                title="Life on Mars: Subsurface Descent"
                style="width: 100%; height: 100%; border: none; border-radius: 8px; display: block;"
            ></iframe>
        `;

        // Disable Continue button until the drone finishes its descent
        choicesArea.innerHTML = `
            <button class="choice-btn" id="choice-0" onclick="makeChoice(0)" disabled style="opacity: 0.5; cursor: not-allowed;">
                <span id="choice-0-text">Complete Drone Descent to Continue...</span>
                <span class="arrow">→</span>
            </button>
        `;

        const unlockContinue = (points) => {
            gameState.discovery += points;
            const continueBtn = document.getElementById("choice-0");
            const continueText = document.getElementById("choice-0-text");
            if (continueBtn && continueText) {
                continueBtn.disabled = false;
                continueBtn.style.opacity = "1";
                continueBtn.style.cursor = "pointer";
                continueText.innerText = `${current.choices[0].text} (+${points} Discovery)`;
            }
        };

        const iframe = document.getElementById("minigame-frame");
        iframe.addEventListener("load", () => {
            try {
                iframe.contentWindow.addEventListener("marsMiniGameOver", (e) => {
                    const results = e.detail || {};
                    unlockContinue(results.discoveryPoints || 0);
                });
            } catch (err) {
                // Fallback if opened via file:// where cross-frame event access may be restricted
                const pollInterval = setInterval(() => {
                    const raw = localStorage.getItem("mars_tunnel_descent_results");
                    if (raw) {
                        const results = JSON.parse(raw);
                        localStorage.removeItem("mars_tunnel_descent_results");
                        clearInterval(pollInterval);
                        unlockContinue(results.discoveryPoints || 0);
                    }
                }, 500);
            }
        });
        return;
    }

    // Restore normal image layout for standard events
    visualContainer.style.height = "";
    visualContainer.innerHTML = `
        <div class="event-badge" id="event-tag">${current.tag}</div>
        <img id="event-image" src="${current.image}" alt="${current.alt}">
    `;

    // Dynamically render 1, 2, or 3 buttons based on how many choices the event has
    choicesArea.innerHTML = current.choices.map((choice, index) => `
        <button class="choice-btn" id="choice-${index}" onclick="makeChoice(${index})">
            <span id="choice-${index}-text">${choice.text}</span>
            <span class="arrow">→</span>
        </button>
    `).join("");
}

// Handle button selections
function makeChoice(choiceIndex) {
    const previousId = gameState.currentEventId;
    const current = eventsList[previousId];
    const chosenAction = current.choices[choiceIndex];

    // Apply stats changes
    gameState.life = Math.max(0, Math.min(100, gameState.life + (chosenAction.effects.life || 0)));
    gameState.food = Math.max(0, Math.min(100, gameState.food + (chosenAction.effects.food || 0)));
    gameState.radiation = Math.max(0, Math.min(100, gameState.radiation + (chosenAction.effects.radiation || 0)));
    gameState.energy = Math.max(0, Math.min(100, gameState.energy + (chosenAction.effects.energy || 0)));
    gameState.discovery = Math.max(0, gameState.discovery + (chosenAction.effects.discovery || 0));

    // Determine next event node
    if (previousId === "welcome") {
        // Sol 1: Pick 1st random event
        gameState.randomEventsRemaining--;
        gameState.currentEventId = pickRandomEvent();
    } else if (gameState.inRandomPhase && gameState.randomEventsRemaining > 0 && previousId !== "sol_transition") {
        // Finished Random Event #1 -> End of Sol 1 screen
        gameState.currentEventId = "sol_transition";
    } else if (previousId === "sol_transition") {
        // Start Sol 2 -> Pick 2nd (non-repeating) random event
        gameState.sol++;
        gameState.randomEventsRemaining--;
        gameState.currentEventId = pickRandomEvent();
    } else if (gameState.inRandomPhase && gameState.randomEventsRemaining === 0) {
        // Finished Random Event #2 -> End of Sol 2 screen
        gameState.inRandomPhase = false;
        gameState.currentEventId = "sol_transition_2";
    } else if (previousId === "sol_transition_2") {
        // Start Sol 3 -> Choice between Main Mission or Sidequest
        gameState.sol++;
        gameState.currentEventId = "mission_choice";
    } else if (previousId === "mission_choice" || previousId === "sidequest_menu") {
        // Same Sol while selecting a sidequest or launching the main mission
        gameState.currentEventId = chosenAction.nextEvent;
    } else {
        // Advance to next Sol for sidequest completion and main mission events
        gameState.sol++;
        gameState.currentEventId = chosenAction.nextEvent;
    }

    // Special helper check for dynamic failure route
    if (gameState.currentEventId === "check_failure") {
        renderEndScreen("failed");
        return;
    }

    updateGame();
}

// Render end screens ("accomplished", "complete", or "failed")
function renderEndScreen(outcome) {
    const container = document.querySelector(".game-container");

    let outcomeClass = "failure";
    let outcomeTitle = "Mission Failure";
    let outcomeImage = "images/missionfailed.png";
    let outcomeText = `Critical survival thresholds were not met by Sol ${gameState.sol} (Required: Life ≥ 70%, Food ≥ 30%, Shielding ≥ 80%, Energy ≥ 50%).`;

    if (outcome === "accomplished") {
        outcomeClass = "success";
        outcomeTitle = "Mission Accomplished!";
        outcomeImage = "images/missionaccomplished.png";
        outcomeText = `You survived ${gameState.sol} Sols on Mars, kept all outpost systems above critical thresholds, and achieved ${gameState.discovery} Discovery points!`;
    } else if (outcome === "complete") {
        outcomeClass = "complete";
        outcomeTitle = "Mission Complete!";
        outcomeImage = "images/missioncomplete.png";
        outcomeText = `You survived ${gameState.sol} Sols on Mars and kept all outpost systems above critical thresholds, finishing with ${gameState.discovery} Discovery points (35 required for full Mission Accomplished).`;
    }

    container.innerHTML = `
        <div class="game-over-screen ${outcomeClass}">
            <div class="visual-area" style="height: 450px; margin-bottom: 20px; border-radius: 8px;">
                <img src="${outcomeImage}" alt="${outcomeTitle}">
            </div>
            <h2>${outcomeTitle}</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${outcomeText}</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 20px;">
                <span style="font-size: 0.9rem;">Life Support: <strong>${gameState.life}%</strong></span>
                <span style="font-size: 0.9rem;">Food: <strong>${gameState.food}%</strong></span>
                <span style="font-size: 0.9rem;">Radiation Shield: <strong>${gameState.radiation}%</strong></span>
                <span style="font-size: 0.9rem;">Energy: <strong>${gameState.energy}%</strong></span>
                <span style="font-size: 0.9rem;">Discovery: <strong>${gameState.discovery}</strong></span>
            </div>
            <button class="restart-btn" onclick="restartGame()">Restart Mission</button>
        </div>
    `;
}

// Reset game back to initial state
function restartGame() {
    location.reload();
}
