document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const optionsArea = document.getElementById('options-area');
    let currentNodeId = 'start';

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
            text: "Hey! Ich bin Alex. Bereit für einen kurzen Check zur Passwort-Hygiene? Geht ganz schnell – versprochen.",
            options: [
                { text: "Klar, leg los!", nextNodeId: "frage_pw_merkmal" },
                { text: "Worum geht’s da genau?", nextNodeId: "erklärung_pw_hygiene" }
            ]
        },
        erklärung_pw_hygiene: {
            speaker: "Alex",
            text: "Passwort-Hygiene meint: starke, einzigartige Passwörter – idealerweise in einem Passwortmanager gespeichert. Verhindert, dass bei einem Datenleck gleich alles offenliegt.",
            options: [
                { text: "Okay, klingt sinnvoll.", nextNodeId: "frage_pw_merkmal" }
            ]
        },
        frage_pw_merkmal: {
            speaker: "Alex",
            text: "Was ist ein Merkmal eines sicheren Passworts?",
            options: [
                { text: "Mind. 12 Zeichen, Gross-/Kleinschreibung, Sonderzeichen", nextNodeId: "antwort_richtig_1" },
                { text: "Geburtsdatum oder Name", nextNodeId: "antwort_falsch_1" }
            ]
        },
        antwort_richtig_1: {
            speaker: "Alex",
            text: "Yes! Genau das macht Passwörter schwer zu knacken.",
            options: [ { text: "Nächste Frage", nextNodeId: "frage_pw_manager" } ]
        },
        antwort_falsch_1: {
            speaker: "Alex",
            text: "Leider nein – persönliche Daten sind leicht erratbar. Besser sind komplexe, zufällige Kombinationen.",
            options: [ { text: "Okay, weiter!", nextNodeId: "frage_pw_manager" } ]
        },
        frage_pw_manager: {
            speaker: "Alex",
            text: "Wie speicherst du deine Passwörter idealerweise?",
            options: [
                { text: "In einem Passwortmanager", nextNodeId: "antwort_richtig_2" },
                { text: "In einer Notiz-App oder im Browser", nextNodeId: "antwort_falsch_2" }
            ]
        },
        antwort_richtig_2: {
            speaker: "Alex",
            text: "Sehr gut! Passwortmanager helfen, starke und unterschiedliche Passwörter zu verwalten.",
            options: [ { text: "Letzte Frage", nextNodeId: "frage_einzigartigkeit" } ]
        },
        antwort_falsch_2: {
            speaker: "Alex",
            text: "Notiz-Apps oder Browser sind nicht optimal. Ein Passwortmanager ist sicherer und speichert alles verschlüsselt.",
            options: [ { text: "Letzte Frage", nextNodeId: "frage_einzigartigkeit" } ]
        },
        frage_einzigartigkeit: {
            speaker: "Alex",
            text: "Warum sollte jedes Konto ein eigenes Passwort haben?",
            options: [
                { text: "Damit ein Leck nicht alle Konten betrifft", nextNodeId: "antwort_richtig_3" },
                { text: "Weil es einfacher zu merken ist", nextNodeId: "antwort_falsch_3" }
            ]
        },
        antwort_richtig_3: {
            speaker: "Alex",
            text: "Exakt! So bleibt der Schaden begrenzt, falls ein Passwort kompromittiert wird.",
            options: [ { text: "Danke Alex, war hilfreich!", nextNodeId: "final_goodbye" } ]
        },
        antwort_falsch_3: {
            speaker: "Alex",
            text: "Leider falsch. Gleiches Passwort = gleich hohes Risiko überall. Deshalb: einzigartig pro Konto!",
            options: [ { text: "Danke, ich hab was gelernt!", nextNodeId: "final_goodbye" } ]
        },
        final_goodbye: {
            speaker: "System",
            text: "Der Chat ist beendet. Du kannst jetzt zum Kurs übergehen.",
            options: []
        },
        error_node: {
            speaker: "System",
            text: "Hoppla, hier ist etwas schiefgelaufen. Lade die Seite neu.",
            options: []
        }
    };

    displayNode(currentNodeId);
});
