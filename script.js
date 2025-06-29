document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const optionsArea = document.getElementById('options-area');
    let currentNodeId = 'start';
    let userLevel = 'mittel'; // Standard-Level

    function displayNode(nodeId) {
        const node = dialogueTree[nodeId];
        if (!node) {
            currentNodeId = 'error_node';
            displayNode(currentNodeId);
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `speaker-${node.speaker.toLowerCase()}`);
        messageDiv.innerHTML = node.text;

        if (node.speaker.toLowerCase() === 'alex') {
            const avatar = document.createElement('img');
            avatar.src = 'alex.png';
            avatar.alt = 'Avatar von Alex';
            avatar.classList.add('avatar');
            messageDiv.prepend(avatar);
        }

        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        optionsArea.innerHTML = '';

        if (node.options && node.options.length > 0) {
            node.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    // Bei Level-Auswahl merken
                    if (option.level) {
                        userLevel = option.level;
                    }
                    currentNodeId = option.nextNodeId;
                    displayNode(currentNodeId);
                });
                optionsArea.appendChild(button);
            });
        }
    }

    const dialogueTree = {
        start: {
            speaker: "Alex",
            text: "Hey! Ich bin Alex, dein Passwort-Coach. Lass uns in 2 Minuten deine Passwort-Sicherheit checken!<br><br>Zuerst: Wie würdest du dein technisches Wissen einschätzen?",
            options: [
                { text: "1: Ich bin Anfänger", nextNodeId: "level_confirmed", level: "tief" },
                { text: "2: Solides Grundwissen", nextNodeId: "level_confirmed", level: "mittel" },
                { text: "3: Ich kenne mich gut aus", nextNodeId: "level_confirmed", level: "hoch" }
            ]
        },
        level_confirmed: {
            speaker: "Alex",
            text: "Super! Dann legen wir los 🚀",
            options: [
                { text: "Let's go!", nextNodeId: "frage_pw_staerke" }
            ]
        },
        frage_pw_staerke: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "Was macht ein Passwort stark? (Tipp: Je länger und zufälliger, desto besser!)";
                } else if (userLevel === 'hoch') {
                    return "Quick Check: Welche Aussage über sichere Passwörter ist korrekt?";
                } else {
                    return "Was ist das wichtigste Merkmal eines starken Passworts?";
                }
            }(),
            options: function() {
                if (userLevel === 'hoch') {
                    return [
                        { text: "Mindestens 12 Zeichen, keine Wörterbuch-Attacken möglich", nextNodeId: "antwort_richtig_1" },
                        { text: "Monatlicher Wechsel ist Pflicht", nextNodeId: "antwort_falsch_1" }
                    ];
                } else {
                    return [
                        { text: "Mind. 12 Zeichen mit Mix aus Buchstaben/Zahlen/Sonderzeichen", nextNodeId: "antwort_richtig_1" },
                        { text: "Mein Geburtsdatum + Name", nextNodeId: "antwort_falsch_1" }
                    ];
                }
            }()
        },
        antwort_richtig_1: {
            speaker: "Alex",
            text: "Genau! 💪 Lange, zufällige Passwörter sind der Schlüssel",
            options: [ { text: "Weiter", nextNodeId: "frage_pw_sharing" } ]
        },
        antwort_falsch_1: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "Nicht ganz. Persönliche Infos sind tabu! Besser: Lange, zufällige Kombinationen.";
                } else {
                    return "Nope! Regelmässige Wechsel ohne Grund schwächen sogar die Sicherheit.";
                }
            }(),
            options: [ { text: "Verstanden", nextNodeId: "frage_pw_sharing" } ]
        },
        frage_pw_sharing: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "Dein Kollege braucht kurz dein Passwort. Was machst du?";
                } else if (userLevel === 'hoch') {
                    return "Szenario: Shared Account für Social Media im Team. Sicherheitstechnisch okay?";
                } else {
                    return "Ist es okay, Passwörter mit vertrauten Personen zu teilen?";
                }
            }(),
            options: [
                { text: userLevel === 'hoch' ? "Nein, Audit-Trail geht verloren" : "Niemals teilen!", nextNodeId: "antwort_richtig_2" },
                { text: userLevel === 'hoch' ? "Mit MFA ist es vertretbar" : "Klar, wenn ich der Person vertraue", nextNodeId: "antwort_falsch_2" }
            ]
        },
        antwort_richtig_2: {
            speaker: "Alex",
            text: "Perfekt! 🎯 Passwörter sind wie Zahnbürsten: Teilen wir lieber nicht :)",
            options: [ { text: "Check!", nextNodeId: "frage_pw_reuse" } ]
        },
        antwort_falsch_2: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'hoch') {
                    return "Auch mit MFA bleibt das Accountability-Problem. Besser: Separate Accounts mit Rollen-Management.";
                } else {
                    return "Gefährlich! Geteilte Passwörter = geteiltes Risiko. Immer eigene Zugänge nutzen.";
                }
            }(),
            options: [ { text: "Macht Sinn", nextNodeId: "frage_pw_reuse" } ]
        },
        frage_pw_reuse: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "Du nutzt das gleiche Passwort für E-Mail und Shopping. Problem?";
                } else if (userLevel === 'hoch') {
                    return "Credential Stuffing Attacks, deine Gegenstrategie?";
                } else {
                    return "Warum ist es riskant, dasselbe Passwort mehrfach zu verwenden?";
                }
            }(),
            options: function() {
                if (userLevel === 'hoch') {
                    return [
                        { text: "Unique passwords + haveibeenpwned Monitoring", nextNodeId: "antwort_richtig_3" },
                        { text: "Starke Passwörter reichen aus", nextNodeId: "antwort_falsch_3" }
                    ];
                } else {
                    return [
                        { text: "Ein Hack = alle Konten in Gefahr", nextNodeId: "antwort_richtig_3" },
                        { text: "Kein Problem, wenn es stark ist", nextNodeId: "antwort_falsch_3" }
                    ];
                }
            }()
        },
        antwort_richtig_3: {
            speaker: "Alex",
            text: "Spot on! 🛡️ Ein Passwort pro Konto ist Pflicht!",
            options: [ { text: "Klar!", nextNodeId: "frage_pw_manager" } ]
        },
        antwort_falsch_3: {
            speaker: "Alex",
            text: "Leider nein. Auch das stärkste Passwort hilft nicht, wenn es geleakt wird!",
            options: [ { text: "Stimmt", nextNodeId: "frage_pw_manager" } ]
        },
        frage_pw_manager: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "Passwortmanager sind Apps, die alle deine Passwörter sicher speichern. Nutzt du sowas?";
                } else if (userLevel === 'hoch') {
                    return "Browser-integriert vs. Standalone Passwortmanager: Deine Präferenz?";
                } else {
                    return "Wie verwaltest du deine vielen verschiedenen Passwörter am besten?";
                }
            }(),
            options: function() {
                if (userLevel === 'hoch') {
                    return [
                        { text: "Standalone mit Zero-Knowledge-Architektur", nextNodeId: "antwort_richtig_4" },
                        { text: "Browser reicht für die meisten Fälle", nextNodeId: "antwort_ok_4" }
                    ];
                } else if (userLevel === 'tief') {
                    return [
                        { text: "Ja, nutze ich / will ich nutzen", nextNodeId: "antwort_richtig_4" },
                        { text: "Nein, ich merke sie mir", nextNodeId: "antwort_falsch_4" }
                    ];
                } else {
                    return [
                        { text: "Mit einem Passwortmanager", nextNodeId: "antwort_richtig_4" },
                        { text: "Ich nutze Variationen eines Passworts", nextNodeId: "antwort_falsch_4" }
                    ];
                }
            }()
        },
        antwort_richtig_4: {
            speaker: "Alex",
            text: "Top! 🏆 Passwortmanager sind der beste Weg zu sicheren, einzigartigen Passwörtern.",
            options: [ { text: "Cool!", nextNodeId: "quick_tip" } ]
        },
        antwort_ok_4: {
            speaker: "Alex",
            text: "Browser-Speicherung ist okay, aber dedizierte Manager bieten mehr Sicherheit & Features.",
            options: [ { text: "Gut zu wissen", nextNodeId: "quick_tip" } ]
        },
        antwort_falsch_4: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "Das wird schnell unübersichtlich! Ein Passwortmanager nimmt dir die Arbeit ab.";
                } else {
                    return "Variationen sind leicht zu knacken! Zeit für einen Passwortmanager (z.B. KeePass / iCloud Schlüsselbund).";
                }
            }(),
            options: [ { text: "Überzeugend", nextNodeId: "quick_tip" } ]
        },
        quick_tip: {
            speaker: "Alex",
            text: function() {
                if (userLevel === 'tief') {
                    return "💡 Quick-Tipp: Probier die '3-Wörter-Methode': Apfel-Rakete-Tanz = sicher & merkbar!<br><br>Und check mal haveibeenpwned.com: Zeigt dir, ob deine E-Mail in Datenlecks war.";
                } else if (userLevel === 'hoch') {
                    return "💡 Pro-Tipp: Aktiviere Breach-Monitoring in deinem Passwortmanager und nutze Hardware-Keys für kritische Accounts. Standardpasswörter bei IoT-Geräten nicht vergessen!";
                } else {
                    return "💡 Merke: Lange Passphrasen > komplizierte Passwörter. Und haveibeenpwned.com zeigt dir, ob deine Daten geleakt wurden!";
                }
            }(),
            options: [ { text: "Danke für die Tipps!", nextNodeId: "final_summary" } ]
        },
        final_summary: {
            speaker: "Alex",
            text: function() {
                const base = "🎉 Geschafft! In 2 Minuten hast du die wichtigsten Passwort-Regeln gelernt:<br><br>✅ 12+ Zeichen<br>✅ Nie teilen<br>✅ Jedes Konto = eigenes Passwort<br>✅ Passwortmanager nutzen";
                if (userLevel === 'hoch') {
                    return base + "<br>✅ Zero-Knowledge-Verschlüsselung<br>✅ Breach-Monitoring aktiv";
                }
                return base;
            }(),
            options: [ { text: "Auf zu sicheren Passwörtern! 🚀", nextNodeId: "final_goodbye" } ]
        },
        final_goodbye: {
            speaker: "System",
            text: "Chat beendet. Bleib sicher im Netz! 🔐",
            options: []
        },
        error_node: {
            speaker: "System",
            text: "Ups, da lief was schief. Bitte Seite neu laden.",
            options: []
        }
    };

    displayNode(currentNodeId);
});
