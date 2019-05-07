const Critical = (function() {
    const createEffect = (range, name, effect, minorInjuries, majorInjuries) => ({
        range,
        name,
        effect,
        minorInjuries,
        majorInjuries
    });

    // stage one regex: ^([^?|.|!]+)+..([^\n]+) /gim || createEffect(1, '$1', '$2'),\n
    // stage two regex: (\d), '(\n) || _$1, '_

    /* eslint-disable no-magic-numbers */
    /* eslint-disable  max-len */
    const bludgeoningTable = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Smashed off balance', 'Roll damage as normal and the next attack against the creature has advantage.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Sent reeling', 'Do not roll your damage dice,instead deal the maximum result possible with those dice and push the creature up to 15 feet in any direction.'),
        createEffect(3, 'Great hit', 'Roll your damage dice twice and add them together.'),
        createEffect(2, 'Take a seat', 'Roll damage dice twice and add them together and the creature is knocked prone.'),
        createEffect(3, 'Rocked and rolled', 'Roll damage dice twice and add them together, push the creature up to 15 feet away, and the creature is knocked prone.'),
        createEffect(2, 'Grievous injury', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add the result. Then roll on the Minor Injury chart. If the creature is wearing heavy armor roll on the Major Injury chart instead.', 1, 1),
        createEffect(1, 'Crushed', 'Deal the twice maximum result of your damage dice and roll on the major injury chart.', 0, 1),
        createEffect(1, 'Splat', 'Deal the maximum result of your damage dice twice, the creature is stunned until the end of your next turn, and roll on the major injury chart.', 0, 1),
    ];

    const piercingTable = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Lunge and thrust', 'Roll damage dice twice and use the higher result.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Stabbed', 'Roll your damage dice twice and add them together.'),
        createEffect(3, 'Great hit', 'Roll your damage dice twice and add them together.'),
        createEffect(2, 'Swiss cheese', 'Roll twice as many damage dice as normal. Then roll twice on the minor injury chart and use the lower result.', 2),
        createEffect(3, 'Punctured', 'Roll your damage dice twice and add them together.', 1),
        createEffect(2, 'Cruel prick', 'Roll your damage dice twice and add them together.', 0, 1),
        createEffect(1, 'Run through', 'Deal twice the maximum result of your damage dice.', 0,1),
        createEffect(1, 'Pierce', 'Deal the maximum result of your damage dice twice.', 1,2)
    ];

    const slashingTable = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Sliced and diced',     'Roll damage as normal and the creature loses 1d6 hit points at the start of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Open gash', 'Roll your damage dice as normal and the creature is bleeding. For the next minute the creature loses 1d4 damage at the start of each of its turns until it uses an action to staunch this wound.'),
        createEffect(3, 'Great hit', 'Roll your damage dice twice and add them together'),
        createEffect(2, 'Deep slice', 'Roll your damage dice twice and add them together and the creature is bleeding. For the next minute the creature loses 1d8 hit points at the start of each of its turns until it uses an action to staunch this wound.'),
        createEffect(3, 'Lacerated', 'Roll your damage dice twice and add them together and the creature is bleeding. For the next minute the creature loses 1d12 hit points at the start of each of its turns until it uses an action to staunch this wound.'),
        createEffect(2, 'Severed', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add the result. Then roll on the Minor Injury chart. If the creature is wearing light or no armor roll on the Major Injury chart instead.', 1, 1),
        createEffect(1, 'Dissected', 'Deal twice the maximum result of your damage dice', 0, 1),
        createEffect(1, 'Slash', 'Deal the maximum result of your damage dice twice, and the creature is bleeding. For the next minute the creature loses 2d8 hit points at the start of each of its turns until it uses an action to staunch this wound.', 0, 1)
    ];

    const minorInjuries = [
        createEffect(3, 'Injured leg', 'The creature’s movement speed is reduced by 10 ft.'),
        createEffect(5, 'Injured arm', 'Randomly determine one of the creature’s arms. That arm cannot be used to hold a shield and the creature has  disadvantage on any rolls involving the use of that arm.'),
        createEffect(3, 'Multiple injuries', 'The creature’s maximum hit points are reduced by an amount equivalent to half of the damage dealt by the attack.'),
        createEffect(5, 'Badly beaten', 'The creature has disadvantage on Constitution saving throws.'),
        createEffect(3, 'Ringing blow', 'The creature is stunned until the end of its next turn and deafened until it completes a the recuperate downtime activity.'),
        createEffect(1, 'Blow to the head', 'The creature is unconscious for 2d12 hours.')
    ];

    const majorInjuries = [
        createEffect(3, 'Crippled leg', 'The creature’s movement speed is reduced by 10 feet and it has disadvantage on Dexterity saving throws.'),
        createEffect(5, 'Crippled arm', 'Randomly determine one of the creature’s arms. That arm cannot be used to hold an item and any ability check requiring that arm automatically fails or has disadvantage (DM’s choice).'),
        createEffect(3, 'Severely wounded', 'The creature’s maximum hit points are reduced by an amount equivalent to the damage dealt by the attack.'),
        createEffect(5, 'Edge of death', 'The creature has disadvantage on Constitution and death saving throws.'),
        createEffect(3, 'My eyes', 'The creature is blinded.'),
        createEffect(1, 'Decapitated', 'The creature is dead.')
    ];

    const criticalHitTables = {
        bludgeoning: bludgeoningTable,
        piercing: piercingTable,
        slashing: slashingTable
    };

    /* eslint-enable max-len */
    /* eslint enable no-magic-numbers */

    const getRandomNumber = (min, max) => Math.round(Math.random() * (max - min) + min)+1;

    const getTableRange = (table) => table.reduce((accumulator, currentEffect) => accumulator + currentEffect.range, 0);

    const getEffectByRoll = (roll, table) => {
        let currentValue = 0;
        let effectByRoll = undefined;

        table.forEach((effect) => {
            currentValue = currentValue + effect.range;

            if(currentValue >= roll && !effectByRoll) {
                effectByRoll = effect;
            }
        });

        return effectByRoll;
    };

    const rollOnTableAndGetEffect = (table) => {
        const minValue = 1;
        const maxValue = getTableRange(table);
        const roll = getRandomNumber(minValue, maxValue);
        let effect = getEffectByRoll(roll, table);

        effect.roll = roll;

        return effect;
    };

    const injuriesToString = (type, injuryArray) => {
        let injuryString = '';
        for(let i = 0; i < injuryArray.length; i++) {
            const injury = injuryArray[i];
            injuryString = `${type}: ${injury.roll}, ${injury.name}\n`;
            injuryString = `${injuryString}${injury.effect}\n`;
        }

        return injuryString;
    };

    const registerEventHandlers = () => {
        on('chat:message', Critical.handleChatMessage);
    };

    /**
     * Grab chat message objects
     *
     * @param {object} msg
     */
    function handleChatMessage(msg) {
        // Check if we are dealing with a !critical command.
        if (msg.type === 'api' && msg.content.indexOf('!critical') === 0) {
            const content = msg.content;
            const words = content.split(' ');

            if(!words[1]) {
                sendChat('Error, no damage type specified', `valid options: ${Object.keys(criticalHitTables)}`);
                return;
            } else if(!criticalHitTables[words[1]]) {
                sendChat('Error, missing damage type', `no damage type ${words[1]}, valid options: ${Object.keys(criticalHitTables)}`);
                return;
            }

            const effectTable = criticalHitTables[words[1]];
            const effect = rollOnTableAndGetEffect(effectTable);
            const minor = [];
            const major = [];

            if (effect.minorInjuries) {
                for(let i = 0; i < effect.minorInjuries; i++) {
                    minor.push(rollOnTableAndGetEffect(minorInjuries));
                }
            }

            if (effect.majorInjuries) {
                for(let i = 0; i < effect.minorInjuries; i++) {
                    major.push(rollOnTableAndGetEffect(majorInjuries));
                }
            }

            sendChat(
                'Critical Hit',
                `
                ${words[1]}, ${effect.roll}: ${effect.name}
                ${effect.effect}
                ${injuriesToString("MINOR", minor)}
                ${injuriesToString("MAJOR", major)}
                `
            );
        }
    }

    return {
        registerEventHandlers: registerEventHandlers,
        handleChatMessage: handleChatMessage,
    };
}());

/**
 * Fires when the page has loaded.
 */
on('ready', () => {
    Critical.registerEventHandlers();
});
