// Game State Variables
        let gameState = {
            life: 100,
            food: 100,
            radiation: 100,
            energy: 100,
            currentEventId: "start"
        };

        /* 
          ========================================================================
          MISSIONS & EVENTS LIST 
          ========================================================================
          You can easily add or modify events by copy-pasting the structure below.
          - id: Unique string identifier for the event node.
          - tag: Badge text displayed over the image.
          - image: Placeholder image path ("image1.png", "image2.png", etc.)
          - alt: Alt text for accessibility.
          - heading: Title of the event card.
          - description: Narrative text explaining the scenario.
          - choices: Array containing the 2 decisions, their stat impacts, and 
                     where they lead next (`nextEvent`).
        */
        const eventsList = {
            "start": {
                tag: "System Status",
                image: "image1.png",
                alt: "Mars habitat landing site overview under dusty skies",
                heading: "Touchdown Confirmed",
                description: "The descent engines have cooled. Your AI assistant alerts you that minor atmospheric disturbances are forming nearby. How do you want to allocate your initial crew assignments?",
                choices: [
                    {
                        text: "Reinforce external solar panels and grid stability.",
                        effects: { energy: +10, life: -5, radiation: 0 , food: 0},
                        nextEvent: "event2"
                    },
                    {
                        text: "Seal airlock bulkheads and run full-system radiation sweeps.",
                        effects: { radiation: +10, energy: -10, life: 0 , food: 0},
                        nextEvent: "dust_storm_approach"
                    }
                ]
            },
           "event2": {
                tag: "Cosmic event",
                image: "https://science.nasa.gov/wp-content/uploads/2023/04/hubble_friday_07302015-jpg.webp?resize=900,658",
                alt: "Image of a dying star’s final surge",
                heading: "Cosmic radiation surge",
                description: "A dying star explodes light-years away, sending a sudden surge of high-energy gamma rays and cosmic radiation across space. Mars has no magnetic field and a very thin atmosphere, so the radiation slams directly into the surface without being blocked. ",
                choices: [
                    {
                        text: "Move the gym shields to the greenhouse",
                        effects: { life: -15, food: +0, radiation: -5, energy: +0 },
                        nextEvent: "event6"
                    },
                    {
                        text: "Leave the greenhouse and take shelter",
                        effects: { life: +5, food: -15, radiation: +0, energy: +0 },
                        nextEvent: "event3"
                    }
                ]
            },
           "event3": {
                tag: "Weather event",
                image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2002/december/northmars_mgs_big.jpg?w=2000&h=1500&fit=crop&crop=faces%2Cfocalpoint",
                alt: "Spring Dust Storms at the North Pole of Mars",
                heading: "Dust storm",
                description: "A storm is approaching the space base, causing a lack of sunlight for crops, and the suspended particles absorb heat in the upper layers of the atmosphere and prevent the heat from reaching the ground, causing the surface to cool down during the day.
",
                choices: [
                    {
                        text: "Use extra power from the ship to run the emergency lights and save the plants, but people will be cold",
                        effects: { life: -10, food: +0, radiation: +0, energy: -10 },
                        nextEvent: "event5"
                    },
                    {
                        text: "Use extra energy to keep people warm, but some plants are going to die",
                        effects: { energy: -20, life: +5, radiation: +0, food: -10},
                        nextEvent: "event5"
                    }
                ]
            },

          "event5": {
                tag: "GRB radiation event",
                image: "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/june/eagle.jpg?w=1876&h=2000&fit=crop&crop=faces%2Cfocalpoint",
                alt: "Lethal dose of radiation has been emitted by a nearby supernova",
                heading: "Gamma Ray Bursts and radiation has come down to Mars",
                description: "A nearby Type Ic hypernovae (a supernova) emitted a large dose of gamma ray bursts and cosmic radiation. Anything caught in this beam even thousands of light-years away would suffer catastrophic radiation damage, such as body altering effects and affecting the electronics. ",
                choices: [
                    {
                        text: " Override the life support system, hence the computer is currently affected by the radiation and is glitching, the computer might start accidentally venting cabin air or shutting off oxygen flow.",
                        effects: { life: +15, food: -10, radiation: +5, energy: +0 },
                        nextEvent: "event6"
                    },
                    {
                        text: "The radiation might affect and alter food supplies or ruin food crops, You can seal and put away all the ailments to protect them from radiation",
                        effects: { life: -15, food: +10, radiation: +5, energy: +0 },
                        nextEvent: "marsquake_event"
                    }
                ]
            },
            "event6": {
                tag: "Extreme temperature",
                image: "https://www.nasa.gov/wp-content/uploads/2017/04/lunar_greenhouse_demo_u_of_az_09_b.jpg?resize=2000,1541",
                alt: "This is an example of a greenhouse in Mars",
                heading: "Extreme Temperatures on Mars",
                description: "Everything seemed normal at the Mars research base. The astronauts had been growing their own vegetables inside a greenhouse and depending on solar panels for electricity. But that night something went wrong. The temperature outside began to drop rapidly. Mars already had an average temperature of approximately −65°C (−85°F), but the approaching Martian night brought even colder conditions. Suddenly, an alarm echoed through the base. WARNING: GREENHOUSE TEMPERATURE DROPPING, LOW BATTERY POWER. The extreme cold was making battery performance more difficult, while the heating system continued demanding electricity. Outside, the solar panels could not generate power during the night. The astronauts faced a terrifying possibility: if they couldn't maintain the greenhouse temperature, they could lose their crops. Without fresh food, their already limited food supplies would become an even bigger problem. They had to find a solution before the greenhouse became too cold.",
                choices: [
                    {
                        text: "Increase greenhouse heating to help the plants",
                        effects: { life: +0, food: +15, radiation: +0, energy: -15 },
                        nextEvent: "solar_flare_warning"
                    },
                    {
                        text: "Reduce greenhouse heating and save energy",
                        effects: {  life: +0, food: -15, radiation: +0, energy: +15 },
                        nextEvent: "marsquake_event"
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
                        effects: { radiation: +15, energy: -35, life: 0, food: 0},
                        nextEvent: "marsquake_event"
                    },
                    {
                        text: "Reroute power to life support life-cells and hunker down.",
                        effects: { life: +10, radiation: -20, energy: -15, food: 0},
                        nextEvent: "marsquake_event"
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
                        effects: { energy: +15, life: -10, radiation: -5, food: 0 },
                        nextEvent: "EJEMPLOEVENTO"
                    },
                    {
                        text: "Conserve all battery reserves and shut down non-essential electronics.",
                        effects: { energy: +5, life: -15, radiation: 0, food: 0 },
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
                        effects: { energy: +15, life: -10, radiation: -5, food: 0 },
                        nextEvent: "marsquake_event"
                    },
                    {
                        text: "Opcion 2",
                        effects: { energy: +5, life: -15, radiation: 0, food: 0 },
                        nextEvent: "marsquake_event"
                    }
                ]
            },
            "marsquake_event": {
                tag: "Geological Event",
                image: "image2.png",
                alt: "Cracked Martian ground trembling near structural struts",
                heading: "Seismic Activity Detected",
                description: "A magnitude 5.2 marsquake rattles the bedrock beneath your habitation module. Warning alarms chime as a subterranean pressure release threatens the primary oxygen tanks.",
                choices: [
                    {
                        text: "Manually recalibrate the sub-surface pressure release valves.",
                        effects: { life: +15, energy: -15, radiation: -5, food: 0 },
                        nextEvent: "mission_success"
                    },
                    {
                        text: "Rely on automated fail-safes and secure internal loose equipment.",
                        effects: { life: -20, energy: -10, radiation: 0, food: 0 },
                        nextEvent: "check_failure"
                    }
                ]
            },
            "mission_success": {
                tag: "Mission Outcome",
                image: "image1.png",
                alt: "Outpost glowing successfully against a bright Martian sunset",
                heading: "Outpost Stabilized: Success!",
                description: "Through calculated risks and stellar resource management, you have weathered the planet's harshest extremes. The colony beacons transmit a secure status back to mission control on Earth.",
                isEnd: true,
                success: true
            },
            "mission_failure": {
                tag: "Critical Failure",
                image: "image2.png",
                alt: "Darkened emergency outpost panels flashing red warning lights",
                heading: "Catastrophic System Failure",
                description: "Critical thresholds have been breached. Whether due to radiation poisoning, oxygen failure, or total power collapse, the Ares-IV outpost has gone dark.",
                isEnd: true,
                success: false
            }
        };

        // Update UI elements based on the current active event ID
        function updateGame() {
            // Check stat bounds or premature failure triggers
            if (gameState.life <= 0 || gameState.radiation <= 0 || gameState.energy <= 0) {
                renderEndScreen(false);
                return;
            }

            const current = eventsList[gameState.currentEventId];

            if (current.isEnd) {
                renderEndScreen(current.success);
                return;
            }

            // Update stats display
            document.getElementById("stat-life").innerText = `${gameState.life}%`;
            document.getElementById("stat-food").innerText = `${gameState.food}%`;
            document.getElementById("stat-radiation").innerText = `${gameState.radiation}%`;
            document.getElementById("stat-energy").innerText = `${gameState.energy}%`;

            // Update visual elements
            document.getElementById("event-tag").innerText = current.tag;
            const imgElement = document.getElementById("event-image");
            imgElement.src = current.image;
            imgElement.alt = current.alt;

            // Update narrative copy
            document.getElementById("event-heading").innerText = current.heading;
            document.getElementById("event-description").innerText = current.description;

            // Update buttons text
            const choicesArea = document.getElementById("choices-area");
            choicesArea.innerHTML = `
                <button class="choice-btn" onclick="makeChoice(0)">
                    <span id="choice-0-text">${current.choices[0].text}</span>
                    <span class="arrow">→</span>
                </button>
                <button class="choice-btn" onclick="makeChoice(1)">
                    <span id="choice-1-text">${current.choices[1].text}</span>
                    <span class="arrow">→</span>
                </button>
            `;
        }

        // Handle button selections
        function makeChoice(choiceIndex) {
            const current = eventsList[gameState.currentEventId];
            const chosenAction = current.choices[choiceIndex];

            // Apply stats changes
            gameState.life = Math.max(0, Math.min(100, gameState.life + chosenAction.effects.life));
            gameState.radiation = Math.max(0, Math.min(100, gameState.radiation + chosenAction.effects.radiation));
            gameState.energy = Math.max(0, Math.min(100, gameState.energy + chosenAction.effects.energy));

            // Move to next event node
            gameState.currentEventId = chosenAction.nextEvent;
            
            // Special helper check for dynamic failure route
            if (gameState.currentEventId === "check_failure") {
                renderEndScreen(false);
                return;
            }

            updateGame();
        }

        // Render end screens (Success or Failure)
        function renderEndScreen(isSuccess) {
            const container = document.querySelector(".game-container");
            const outcomeClass = isSuccess ? "success" : "failure";
            const outcomeTitle = isSuccess ? "Mission Accomplished!" : "Mission Failure";
            const outcomeText = isSuccess 
                ? "You successfully navigated the volatile hazards of Mars and kept your crew alive. Earth sends its commendations."
                : "The harsh elements of the red planet proved overwhelming. Life support systems failed, ending the Ares-IV mission prematurely.";

            container.innerHTML = `
                <div class="game-over-screen ${outcomeClass}">
                    <div class="visual-area" style="height: 200px; margin-bottom: 20px; border-radius: 8px;">
                        <img src="${isSuccess ? 'image1.png' : 'image2.png'}" alt="Mission final status view">
                    </div>
                    <h2>${outcomeTitle}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${outcomeText}</p>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                        <span style="font-size: 0.9rem;">Life Support: <strong>${gameState.life}%</strong></span>
                        <span style="font-size: 0.9rem;">Radiation Shield: <strong>${gameState.radiation}%</strong></span>
                        <span style="font-size: 0.9rem;">Energy: <strong>${gameState.energy}%</strong></span>
                    </div>
                    <button class="restart-btn" onclick="restartGame()">Restart Mission</button>
                </div>
            `;
        }

        // Reset game back to initial state
        function restartGame() {
            gameState = {
                life: 100,
                radiation: 100,
                energy: 100,
                currentEventId: "start"
            };

            // Rebuild original container layout structure if it was overwritten by end screen
            location.reload(); 
        }
