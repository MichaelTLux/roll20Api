const Critical = (function() {
    const createEffect = (range, name, effect, minorInjuries, majorInjuries, insanityInjuries) => ({
        range,
        name,
        effect,
        minorInjuries,
        majorInjuries,
        insanityInjuries
    });

    // stage one regex: ^([^?|.|!]+)+..([^\n]+) /gim || createEffect(1, '$1', '$2'),\n
    // stage two regex: (\d), '(\n) || _$1, '_

    /* eslint-disable no-magic-numbers */
    /* eslint-disable  max-len */
    const bludgeoning = [
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

    const piercing = [
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

    const slashing = [
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

    const acid = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Scalding bile', 'Roll damage as normal and the creature is scarred. While scarred the creature has disadvantage on all Charisma ability checks except Charisma (Intimidation). Being scarred can be healed in the same way as a minor injury.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Melted flesh', 'Roll your damage as normal and the creature is disfigured. While disfigured the creature has disadvantage on all Charisma ability checks except Charisma (Intimidation). Being disfigured can be removed with the spell greater restoration.'),
        createEffect(3, 'Great hit', 'Roll your damage dice twice and add them together.'),
        createEffect(2, 'Boiling flesh', 'Roll twice as many damage dice as normal and if the creature is wearing armor its AC modifier is reduced by 1 until it can be repaired (for 1/4th the price of new armor of the same type) or cleaned (if the armor is magical). If the creature is not wearing armor, roll on the minor injury chart.', 1),
        createEffect(3, 'Horrific mutilation', 'Roll twice as many damage dice as normal. Additionally, the creature is disfigured. While disfigured the creature has disadvantage on all Charisma ability checks except Charisma (Intimidation). Being disfigured can be removed with the spell greater restoration.', 1),
        createEffect(2, 'Caustic trauma', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. If the creature is wearing armor, roll on the minor injury chart and its AC modifier is reduced by 2 until it can be repaired (for half the price of new armor of the same type) or cleaned (if the armor is magical). If the creature is not wearing armor, roll on the major injury chart.', 1,1),
        createEffect(1, 'Vitriolic', 'Deal twice the maximum result of your damage dice.', 0, 1),
        createEffect(1, 'Acid bath', 'Deal twice the maximum result of your damage dice. If the creature is wearing armor, the armor is destroyed (if non-magical) or rendered useless until cleaned during a long rest (if magical). If the creature is not wearing armor, the creature is disfigured. While disfigured the creature has disadvantage on all Charisma ability checks except Charisma (Intimidation). Being disfigured can be removed with the spell greater restoration', 0 ,1)
    ];

    const cold = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Chills', 'Roll damage as normal and the creature may only move half its movement speed on its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Frosty', 'Roll your damage as normal and the creature’s movement speed is 0 until the end of its next turn.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Freezing', 'Roll twice as many damage dice as normal and the creature is paralyzed until the end of its next turn.'),
        createEffect(3, 'Frozen', 'Roll twice as many damage dice as normal and the creature is paralyzed until the end of its next turn. If the creature takes damage before the end of its next turn.', 1),
        createEffect(2, 'Ice block', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. The creature is paralyzed until the end of its next turn.', 1),
        createEffect(1, 'Glacial', 'Deal twice the maximum result of your damage dice.', 0,1),
        createEffect(1, 'Subzero', 'Deal twice the maximum result of your damage dice, and the creature is paralyzed for the next minute. The creature may attempt a saving throw at the end of each of its turns (DC 16) to end this effect. If it fails this saving throw three times it is frozen solid and becomes a petrified but frozen solid in a block of ice rather than turned to stone.', 0,1)
    ];

    const fire = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Heat wave', 'Roll damage as normal and attack rolls for attacks that deal fire damage have advantage when made against the creature until the end of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Hot flash', 'Roll your damage as normal and the creature is on fire. While the creature is on fire it takes 2d4 fire damage at the start of each of its turns. The creature can end this condition by dropping prone and using 5 feet of movement to roll on the ground.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Ablaze', 'Roll twice as many damage dice as normal and the creature is on fire. While the creature is on fire it takes 2d6 fire damage at the start of each of its turns. The creature can end this condition by dropping prone and using 5 feet of movement to roll on the ground.'),
        createEffect(3, 'Burnt to a crisp', 'Roll twice as many damage dice as normal and the creature is charred. If the creature has resistance to fire, it loses that resistance. If the creature does not have resistance to fire, it gains vulnerability to fire. Both of these effects can be ended the same as a minor injury.'),
        createEffect(2, 'Hellfire', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. Additionally, the creature is on fire. While the creature is on fire it takes 2d6 fire damage at the start of each of its turns. The creature can end this condition by dropping prone and using 5 feet of movement to roll on the ground.', 0 ,1),
        createEffect(1, 'Combustion', 'Deal twice the maximum result of your damage dice.', 0 ,1),
        createEffect(1, 'Inferno', 'Deal twice the maximum result of your damage dice. Additionally, the creature is on fire. While the creature is on fire it takes 2d8 fire damage at the start of each of its turns. The creature can end this condition by dropping prone and using 5 feet of movement to roll on the ground.', 0,1)
    ];

    const force = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Spellstruck', 'Roll damage as normal and the creature has disadvantage on saving throws against spells until the end of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Eldritch incandescence', 'Roll your damage as normal and spell attack rolls against the creature have advantage until the end of its next turn.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Bewitching blow', 'Roll twice as many damage dice as normal and the creature is spellbound until the end of its next turn. While spellbound it makes saving throws against spells with disadvantage and spell attack rolls against it have advantage.'),
        createEffect(3, 'Mystic magnet', 'Roll twice as many damage dice as normal and the creature is spellbound for the next minute. While spellbound it makes saving throws against spells with disadvantage and spell attack rolls against it have advantage. At the end of each of the creature’s turns it can make an Intelligence saving throw (DC 14) to end this effect.'),
        createEffect(2, 'Ensorcelled', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result . Additionally, the creature is spellbound for the next minute. While spellbound it makes saving throws against spells with disadvantage and spell attack rolls against it have advantage. At the end of each of the creature’s turns it can make an Intelligence saving throw (DC 16) to end this effect.', 1),
        createEffect(1, 'Arcane injury', 'Deal twice the maximum result of your damage dice.', 0 ,1),
        createEffect(1, 'Magically mauled', 'Deal twice the maximum result of your damage dice. Additionally, the creature is spellbound for the next minute. While spellbound it makes saving throws against spells with disadvantage and spell attack rolls against it have advantage. At the end of each of the creature’s turns it can make an Intelligence saving throw (DC 18) to end this effect.', 0 ,1)
    ];

    const lightning = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Shocking', 'Roll damage as normal and the creature cannot use reactions until the end of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Sparks fly', 'Roll your damage as normal and you may choose one other creature within 15 ft. of the victim. That creature must succeed on a Dexterity saving throw (DC 14) or take half as much damage.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Electric arc', 'Roll twice as many damage dice as normal and you may choose one other creature within 15 ft. of the victim. That creature must succeed on a Dexterity saving throw (DC 18) or take half as much damage.'),
        createEffect(3, 'Fulminate', 'Roll twice as many damage dice as normal and roll on the minor injury chart. If the creature is wearing metal armor roll on the major injury chart instead.', 1,1),
        createEffect(2, 'Lit up', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. The creature and each creature you choose within 15 ft. of it cannot take reactions until the end of their next turn.', 1),
        createEffect(1, 'Electrocuted', 'Deal twice the maximum result of your damage dice.', 0 ,1),
        createEffect(1, 'Lightning rod', 'Deal twice the maximum result of your damage dice and you may choose one other creature within 15 ft. of the victim. That creature must succeed on a Dexterity saving throw (DC 20) or take half as much damage.', 0,1)
    ];

    const necrotic = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Spoil', 'Roll damage as normal and the creature cannot regain hit points until the end of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Fester', 'Roll your damage as normal and the creature’s maximum hit points are reduced by the same amount.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Decay', 'Roll twice as many damage dice as normal and the creature’s maximum hit points are reduced by the same amount.'),
        createEffect(3, 'Rot', 'Roll twice as many damage dice as normal and the creature cannot regain hit points for the next minute. It may make a saving throw (DC 16) at the end of each of its turns to end this effect.'),
        createEffect(2, 'Blight', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. The creature’s maximum hit points are reduced by the same amount. Then roll on the minor injury chart.'),
        createEffect(1, 'Atrophy', 'Deal twice the maximum result of your damage dice and roll on the major injury chart.'),
        createEffect(1, 'Putrefy', 'Deal twice the maximum result of your damage dice, the creature’s maximum hit points are reduced by the same amount, and the creature cannot regain hit points until the end of its next turn. Then roll on the major injury chart.')
    ];

    const poison = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Nauseous', 'Roll damage as normal and the creature has disadvantage on its next ability check, attack roll, or saving throw.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Sickened', 'Roll your damage as normal and the creature has disadvantage on all ability checks, attack rolls, and saving throws until the end of its next turn.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Poisoned', 'Roll twice as many damage dice as normal and the creature is poisoned for the next minute. The creature may attempt a saving throw at the end of each of its turns (DC 12) to end this effect.'),
        createEffect(3, 'Contaminated', 'Roll twice as many damage dice as normal and the creature is poisoned for the next minute. The creature may attempt a saving throw at the end of each of its turns (DC 16) to end this effect.'),
        createEffect(2, 'Toxic shock', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. Then the creature is poisoned for the next minute. The creature may attempt a saving throw at the end of each of its turns (DC 12) to end this effect.', 1),
        createEffect(1, 'System failure', 'Deal twice the maximum result of your damage dice.', 0 ,1),
        createEffect(1, 'Biological breakdown', 'Deal twice the maximum result of your damage dice, and the creature is poisoned for the next minute. The creature may attempt a saving throw at the end of each of its turns (DC 16) to end this effect.', 0 ,1)
    ];

    const psychic = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Disoriented', 'Roll your damage dice as normal and you control the creature’s movement on its next turn.'),
        createEffect(3, 'Confused', 'Roll your damage dice as normal and the creature cannot differentiate friend from foe until the end of its next turn.'),
        createEffect(2, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Dominated', 'Roll twice as many damage dice as normal and you control the creature’s action on its next turn.'),
        createEffect(3, 'Psychological fracture', 'Roll twice as many damage dice as normal and roll on the Insanity chart with disadvantage.', 0,0,2),
        createEffect(2, 'Psychological break', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result.', 0,0,1),
        createEffect(1, 'Madness', 'Deal twice the maximum result of your damage dice.',0,0,1),
        createEffect(1, 'Mind melt', 'Deal twice the maximum result of your damage dice and roll on the Insanity chart with advantage.',0,0,2)
    ];

    const radiant = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Dazzled', 'Roll damage as normal and the creature cannot willingly move closer to you until the end of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Disheartening blast', 'Roll your damage as normal and the creature is frightened until the end of its next turn.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Awed', 'Roll twice as many damage dice as normal and the creature is frightened until the end of its next turn.'),
        createEffect(3, 'Holy terror', 'Roll twice as many damage dice as normal. Additionally, the creature is frightened for the next minute. It can make a Wisdom saving throw (DC 16) at the end of each of its turns to end this effect.',1),
        createEffect(2, 'Righteous mark', 'Deal the maximum amount of damage for your normal damage dice then roll your damage dice and add that result. Additionally, the creature glows for the next minute. While glowing it produces bright light up 10 feet and dim light up to 30 feet and all successful attacks against the creature deal an additional 1d4 radiant damage.',1),
        createEffect(1, 'Wrath of the gods', 'Deal twice the maximum result of your damage dice.', 0 ,1),
        createEffect(1, 'Smote', 'Deal twice the maximum result of your damage dice. Additionally, the creature glows for the next minute. While glowing it produces bright light up 10 feet and dim light up to 30 feet and all successful attacks against the creature deal an additional 1d6 radiant damage.', 0,1)
    ];

    const thunder = [
        createEffect(1, 'You call that a crit', 'Roll damage as normal.'),
        createEffect(2, 'Boom', 'Roll damage as normal and the creature is deafened until the end of its next turn.'),
        createEffect(3, 'Good hit', 'Do not roll your damage dice, instead deal the maximum result possible with those dice.'),
        createEffect(2, 'Ka-boom', 'Roll your damage as normal and the creature is deafened for one minute.'),
        createEffect(3, 'Great hit', 'Roll twice as many damage dice as normal.'),
        createEffect(2, 'Thunder clap', 'Roll twice as many damage dice as normal and the creature is stunned until the start of its next turn and deafened for one minute.'),
        createEffect(3, 'Burst ear drums', 'Roll twice as many damage dice as normal and the creature is deafened permanently.',1),
        createEffect(2, 'Concussive blast', 'Deal the maximum amount of damage from your normal damage dice then roll your damage dice and add that result. The creature stunned until the end of its next turn and deafened permanently.',1),
        createEffect(1, 'Wall of sound', 'Deal twice the maximum result of your damage dice.', 0,1),
        createEffect(1, 'Sonic salvo', 'Deal twice the maximum result of your damage dice, the creature is deafened permanently, and stunned until the end of its next round.', 0,1)
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

    const insanity = [
        createEffect(1, 'Synesthesia', 'You can hear colors, smell sounds, or taste textures. Regardless of the specific manifestation, you have disadvantage on all Perception and Investigation skill checks.'),
        createEffect(1, 'Kleptomania', 'Once per day when you are in a personal residence or marketplace, the DM can call on you to succeed on a Wisdom saving throw (DC 12) or attempt to steal an item of insignificant practical and monetary value.'),
        createEffect(1, 'Paranoia', 'Once per day following an interaction with another creature (including other PCs) the DM can call on you to succeed on a Wisdom saving throw (DC 12) or you suspect that creature is secretly plotting against you.'),
        createEffect(1, 'Obsession', 'Choose a person or personal interest you are obsessed with. Once per day, when you are presented with an opportunity to interact with or learn more about the subject of your obsession the DM can call on you to succeed on a Wisdom saving throw (DC 14) or ignore everything else to obsess over the object of your fascination.'),
        createEffect(1, 'Addiction', 'Choose a behavior or substance you have used. Once per day, when you are presented with an opportunity to do the behavior or use the substance the DM can call on you to succeed on a Wisdom saving throw (DC 14) or ignore everything else to indulge in your vice.'),
        createEffect(1, 'Odd Thinking', 'Once per day when you hear a rational explanation for an event or occurrence, your DM may call on you to succeed on a Wisdom saving throw (DC 12) or you reject the rational explanation for a conspiratorial or fantastical explanation.'),
        createEffect(1, 'Narcissism', 'When you take an action or series of action that doesn’t directly benefit you, you must pass a Wisdom saving throw (DC 11) or you can’t take that action / series of actions. If any self-sacrifice on your part would be required the DC of the saving throw is increased to 16.'),
        createEffect(1, 'Delusional', 'When you gain this insanity the DM will tell you a belief that you have. No matter what evidence is presented to the contrary so long as you have this insanity you cannot be persuaded that this belief is not true.'),
        createEffect(1, 'Pica', 'Once per day the DM can call on you to pass a Wisdom saving throw (DC 14) or immediately eat one non-food object (such as dirt, napkins, or a small piece of jewelry) of the DM’s choice.'),
        createEffect(1, 'Retrograde amnesia', 'You forget everything about your personal life prior to the moment you received this insanity. '),
        createEffect(1, 'Overwhelmed', 'If you do not have immunity or resistance to psychic damage, you gain vulnerability to psychic damage. If you have resistance to psychic damage, you lose it. If you have immunity to psychic damage, you lose it but gain resistance to psychic damage.'),
        createEffect(1, 'Anterograde amnesia', 'Whenever you try to recall a fact you learned since you received this insanity, make a Wisdom saving throw (DC 12). If you fail you cannot recall the fact.'),
        createEffect(1, 'Dependence', 'You must pass a Wisdom saving throw (DC 14) to take an action that one or more of your allies disapprove of.'),
        createEffect(1, 'Anxious', 'You have disadvantage on saving throws against being frightened. Additionally, once per day the DM can call on you to succeed a Wisdom saving throw (DC 14) or be frightened by a creature of the DM’s choosing for the next minute.'),
        createEffect(1, 'Mute', 'Whenever you wish to speak allowed (including casting a spell that has verbal components) you must succeed on a Wisdom saving throw (DC 13) to do so.'),
        createEffect(1, 'Narcolepsy', 'You have disadvantage on saving throws against sleeping or unconsciousness. Once per day the DM may call on you to succeed on a Constitution saving throw (DC 12) or fall unconscious for one minute or until you take damage or another creature spends their action trying to rouse you.'),
        createEffect(1, 'Insomnia', 'You cannot take long rests and your short rests take 8 hours to complete.'),
        createEffect(1, 'Homicidal', 'After each long rest you must pass a Wisdom saving throw (DC 14) or be overcome with the urge to end the life of a humanoid creature and you cannot benefit from another long rest until you do so.'),
        createEffect(1, 'Suicidal', 'After each long rest you must pass a Wisdom saving throw (DC 12) or make an attempt to end your own life.'),
        createEffect(1, 'Catatonia', 'You are unconscious for 10d10 years.')
    ];

    const criticalHitTables = {
        bludgeoning,
        piercing,
        slashing,
        acid,
        cold,
        fire,
        force,
        lightning,
        necrotic,
        poison,
        psychic,
        radiant,
        thunder
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
            const insanity = [];

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

            if (effect.majorInjuries) {
                for(let i = 0; i < effect.minorInjuries; i++) {
                    insanity.push(rollOnTableAndGetEffect(insanity));
                }
            }

            sendChat(
                'Critical Hit',
                `
                ${words[1]}, ${effect.roll}: ${effect.name}
                ${effect.effect}
                ${injuriesToString('MINOR', minor)}
                ${injuriesToString('MAJOR', major)}
                ${injuriesToString('INSANITY', insanity)}
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
